
import { Router } from "express";
import multer from "multer";
import { extractPdfText } from "../utils/pdfParser.js";
import { createWorker } from "tesseract.js";
import { pdf as renderPdf } from "pdf-to-img";
import { z } from "zod";

import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import ConsultationReport from "../models/ConsultationReport.js";
import MedicalDocument from "../models/MedicalDocument.js";

import { generateFinalReport } from "../services/finalReportAI.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// ==================== STORAGE CONFIGURATION ====================

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const backendDirectory = path.resolve(currentDirectory, "..");

const documentStorageDirectory = path.join(
  backendDirectory,
  "uploads",
  "medical-documents"
);

// ==================== FILE CONFIGURATION ====================

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const MAX_TEXT_LENGTH = 5000;
const MAX_EXTRACTED_TEXT = 100000;

const MIN_PDF_TEXT_LENGTH = 30;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/octet-stream",
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

function getExtension(filename) {
  const lastDot = filename.lastIndexOf(".");

  return lastDot === -1
    ? ""
    : filename.slice(lastDot).toLowerCase();
}

function isPdf(file) {
  return getExtension(file.originalname) === ".pdf";
}

function isImage(file) {
  return [".jpg", ".jpeg", ".png"].includes(
    getExtension(file.originalname)
  );
}

// ==================== MULTER CONFIGURATION ====================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
    fields: 2,
    fieldSize: MAX_TEXT_LENGTH * 4,
  },

  fileFilter: (req, file, callback) => {
    const extension = getExtension(file.originalname);

    const isAllowedExtension =
      ALLOWED_EXTENSIONS.includes(extension);

    const isAllowedMime =
      ALLOWED_MIME_TYPES.includes(file.mimetype);

    if (!isAllowedExtension || !isAllowedMime) {
      return callback(
        new Error(
          "Only PDF, JPG, JPEG and PNG files are allowed."
        )
      );
    }

    callback(null, true);
  },
});

// ==================== FILE VALIDATION ====================

function hasValidPdfSignature(buffer) {
  return buffer.subarray(0, 5).toString() === "%PDF-";
}

function getImageType(buffer) {
  // JPEG signature
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG signature
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([
        0x89, 0x50, 0x4e, 0x47,
        0x0d, 0x0a, 0x1a, 0x0a,
      ])
    )
  ) {
    return "image/png";
  }

  return null;
}

// ==================== REQUEST VALIDATION ====================

const submissionSchema = z
  .object({
    interviewSummary: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
    medicalHistory: z.string().trim().max(MAX_TEXT_LENGTH),
  })
  .strict();

// ==================== OCR FUNCTIONS ====================

// Extract text from an image using Tesseract.
async function extractImageText(buffer, worker) {
  const result = await worker.recognize(buffer);
  return result.data.text;
}

// Extract text from a scanned PDF.
async function extractScannedPdfText(buffer, worker) {
  const pdfDocument = await renderPdf(buffer, {
    scale: 2,
  });

  const pageTexts = [];

  for await (const pageImage of pdfDocument) {
    const result = await worker.recognize(pageImage);
    pageTexts.push(result.data.text);
  }

  return pageTexts.join("\n\n");
}

// Extract text from a PDF or image.
async function extractDocumentText(file, getOcrWorker) {
  if (isPdf(file)) {
    if (!hasValidPdfSignature(file.buffer)) {
      throw new Error("INVALID_PDF");
    }

    const extractedText = await extractPdfText(file.buffer);

    if (
      !extractedText ||
      extractedText.trim().length < MIN_PDF_TEXT_LENGTH
    ) {
      console.log(
        `Little or no selectable text in ${file.originalname}. Trying OCR...`
      );

      return await extractScannedPdfText(
        file.buffer,
        await getOcrWorker()
      );
    }

    return extractedText;
  }

  if (isImage(file)) {
    const actualImageType = getImageType(file.buffer);

    if (!actualImageType) {
      throw new Error("INVALID_IMAGE");
    }

    return await extractImageText(
      file.buffer,
      await getOcrWorker()
    );
  }

  throw new Error("UNSUPPORTED_FILE");
}

// ==================== SUBMIT CONSULTATION API ====================

router.post(
  "/submit",

  // Verify JWT before accepting uploaded files.
  authenticateToken,

  // Only patients can submit patient consultations.
  (req, res, next) => {
    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can submit consultations.",
      });
    }

    next();
  },

  upload.array("medicalDocuments", MAX_FILES),

  async (req, res) => {
    let ocrWorker = null;
    let savedReport = null;

    const savedFilePaths = [];

    try {
      // Validate consultation text.
      const validation = submissionSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid interview summary and medical history.",
        });
      }

      const {
        interviewSummary,
        medicalHistory,
      } = validation.data;

      const files = req.files || [];
      const documents = [];

      // Create one OCR worker for this submission.
      const getOcrWorker = async () => {
        if (!ocrWorker) {
          ocrWorker = await createWorker("eng");
        }

        return ocrWorker;
      };

      // ==================== DOCUMENT OCR ====================

      for (const file of files) {
        let extractedText;

        try {
          console.log(
            `Extracting text from: ${file.originalname}`
          );

          extractedText = await extractDocumentText(
            file,
            getOcrWorker
          );

          if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({
              success: false,
              message:
                `No readable text was found in "${file.originalname}". Please upload a clearer document.`,
            });
          }

          console.log(
            `Successfully extracted text from: ${file.originalname}`
          );

        } catch (error) {
          console.error(
            `Document extraction failed for ${file.originalname}:`,
            error
          );

          if (error.message === "INVALID_PDF") {
            return res.status(400).json({
              success: false,
              message:
                `"${file.originalname}" is not a valid PDF.`,
            });
          }

          if (error.message === "INVALID_IMAGE") {
            return res.status(400).json({
              success: false,
              message:
                `"${file.originalname}" is not a valid JPG or PNG image.`,
            });
          }

          if (error.message === "UNSUPPORTED_FILE") {
            return res.status(400).json({
              success: false,
              message:
                `"${file.originalname}" has an unsupported file format.`,
            });
          }

          return res.status(500).json({
            success: false,
            message:
              `Could not process "${file.originalname}". Please try another document.`,
          });
        }

        documents.push({
          fileName: file.originalname,
          text: extractedText.slice(
            0,
            MAX_EXTRACTED_TEXT
          ),
        });
      }

      // ==================== AI REPORT GENERATION ====================

      const finalReport = await generateFinalReport({
        interviewSummary,
        medicalHistory,
        documents,
      });

      // ==================== SAVE CONSULTATION REPORT ====================

      savedReport = await ConsultationReport.create({
        patientId: req.user.userId,
        finalReport,
      });

      // ==================== SAVE ORIGINAL DOCUMENTS ====================

      if (files.length > 0) {
        await mkdir(documentStorageDirectory, {
          recursive: true,
        });

        const documentRecords = [];

        for (const file of files) {
          // Generate a unique server-side filename.
          const extension = getExtension(file.originalname);

          const storedFileName =
            `${randomUUID()}${extension}`;

          const absoluteFilePath = path.join(
            documentStorageDirectory,
            storedFileName
          );

          // Save original file.
          await writeFile(
            absoluteFilePath,
            file.buffer
          );

          savedFilePaths.push(absoluteFilePath);

          // Use the verified actual MIME type.
          const mimeType = isPdf(file)
            ? "application/pdf"
            : getImageType(file.buffer);

          documentRecords.push({
            patientId: req.user.userId,
            consultationId: savedReport._id,
            originalName: file.originalname,
            storedFileName,
            filePath: absoluteFilePath,
            mimeType,
            fileSize: file.size,
            uploadSource: "consultation",
          });
        }

        // Save document information in MongoDB.
        await MedicalDocument.insertMany(documentRecords);
      }

      // ==================== SUCCESS RESPONSE ====================

      return res.status(201).json({
        success: true,
        message:
          "Final consultation report generated successfully.",

        data: {
          reportId: savedReport._id,
          finalReport: savedReport.finalReport,
          createdAt: savedReport.createdAt,
        },
      });

    } catch (error) {

      // ==================== CLEANUP IF SAVING FAILS ====================

      if (savedReport) {
        try {
          await MedicalDocument.deleteMany({
            patientId: req.user.userId,
            consultationId: savedReport._id,
          });

          await ConsultationReport.findByIdAndDelete(
            savedReport._id
          );

        } catch (cleanupError) {
          console.error(
            "Database cleanup failed:",
            cleanupError
          );
        }
      }

      if (savedFilePaths.length > 0) {
        const cleanupResults = await Promise.allSettled(
          savedFilePaths.map((filePath) => unlink(filePath))
        );

        cleanupResults.forEach((result) => {
          if (result.status === "rejected") {
            console.error(
              "File cleanup failed:",
              result.reason
            );
          }
        });
      }

      // ==================== MULTER ERRORS ====================

      if (error instanceof multer.MulterError) {
        const isTooLarge =
          error.code === "LIMIT_FILE_SIZE";

        const isTooManyFiles =
          error.code === "LIMIT_FILE_COUNT";

        return res.status(400).json({
          success: false,
          message: isTooLarge
            ? "Each document must be 10 MB or smaller."
            : isTooManyFiles
              ? "You can upload a maximum of 5 documents."
              : "The uploaded files could not be processed.",
        });
      }

      if (
        error?.message?.includes(
          "Only PDF, JPG, JPEG and PNG files are allowed."
        )
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      console.error(
        "Final consultation submission failed:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "Unable to generate the final report. Please try again.",
      });

    } finally {
      // Always release OCR resources.
      if (ocrWorker) {
        await ocrWorker.terminate();
      }
    }
  }
);

export default router;
