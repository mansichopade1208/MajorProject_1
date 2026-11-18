
import { Router } from "express";
import multer from "multer";
import { extractPdfText } from "../utils/pdfParser.js";
import { createWorker } from "tesseract.js";
import { pdf as renderPdf } from "pdf-to-img";
import { z } from "zod";

import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  randomUUID,
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";

import ConsultationReport from "../models/ConsultationReport.js";
import MedicalDocument from "../models/MedicalDocument.js";
import { generateFinalReport } from "../services/finalReportAI.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// ==================== CONFIGURATION ====================

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(currentDirectory, "..");

const documentStorageDirectory = path.join(
  backendDirectory,
  "uploads",
  "medical-documents"
);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const MAX_TEXT_LENGTH = 5000;
const MAX_EXTRACTED_TEXT = 100000;
const MIN_PDF_TEXT_LENGTH = 30;

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function isPdf(file) {
  return getExtension(file.originalname) === ".pdf";
}

function isImage(file) {
  return [".jpg", ".jpeg", ".png"].includes(
    getExtension(file.originalname)
  );
}

// ==================== MULTER ====================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
    fields: 2,
    fieldSize: MAX_TEXT_LENGTH * 4,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/octet-stream",
    ];

    if (
      !ALLOWED_EXTENSIONS.includes(getExtension(file.originalname)) ||
      !allowedMimes.includes(file.mimetype)
    ) {
      return callback(
        new Error("Only PDF, JPG, JPEG and PNG files are allowed.")
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
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

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

const submissionSchema = z.object({
  interviewSummary: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  medicalHistory: z.string().trim().max(MAX_TEXT_LENGTH),
}).strict();

// ==================== OCR ====================

async function extractImageText(buffer, worker) {
  const result = await worker.recognize(buffer);
  return result.data.text;
}

async function extractScannedPdfText(buffer, worker) {
  const pdfDocument = await renderPdf(buffer, { scale: 2 });
  const pageTexts = [];

  for await (const pageImage of pdfDocument) {
    const result = await worker.recognize(pageImage);
    pageTexts.push(result.data.text);
  }

  return pageTexts.join("\n\n");
}

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
      return extractScannedPdfText(
        file.buffer,
        await getOcrWorker()
      );
    }

    return extractedText;
  }

  if (isImage(file)) {
    if (!getImageType(file.buffer)) {
      throw new Error("INVALID_IMAGE");
    }

    return extractImageText(
      file.buffer,
      await getOcrWorker()
    );
  }

  throw new Error("UNSUPPORTED_FILE");
}

// ==================== ACCESS TOKEN ====================

function getEncryptionKey() {
  const secret = process.env.REPORT_TOKEN_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("REPORT_TOKEN_ENCRYPTION_KEY is missing.");
  }

  return createHash("sha256").update(secret).digest();
}

function generateAccessToken() {
  return `MK-${randomBytes(6).toString("hex").toUpperCase()}`;
}

function hashAccessToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function encryptAccessToken(token) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex"),
  };
}

function decryptAccessToken(report) {
  if (
    !report.accessTokenEncrypted ||
    !report.accessTokenIv ||
    !report.accessTokenAuthTag
  ) {
    return null;
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(report.accessTokenIv, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(report.accessTokenAuthTag, "hex")
  );

  let decrypted = decipher.update(
    report.accessTokenEncrypted,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}

// ==================== GET PATIENT CONSULTATIONS ====================

router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({
      success: false,
      message: "Only patients can access their consultations.",
    });
  }

  try {
    const consultations = await ConsultationReport.find({
      patientId: req.user.userId,
    })
      .select(
        "finalReport createdAt accessTokenEncrypted accessTokenIv accessTokenAuthTag"
      )
      .sort({ createdAt: -1 })
      .lean();

    const data = consultations.map((report) => {
      let accessToken = null;

      try {
        accessToken = decryptAccessToken(report);
      } catch (error) {
        console.error("Token decryption failed:", error.message);
      }

      return {
        _id: report._id,
        finalReport: report.finalReport,
        createdAt: report.createdAt,
        accessToken,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Fetch consultations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your consultations.",
    });
  }
});

// ==================== SUBMIT CONSULTATION ====================

router.post(
  "/submit",
  authenticateToken,
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
      const validation = submissionSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid interview summary and medical history.",
        });
      }

      const { interviewSummary, medicalHistory } = validation.data;
      const files = req.files || [];
      const documents = [];

      const getOcrWorker = async () => {
        if (!ocrWorker) {
          ocrWorker = await createWorker("eng");
        }

        return ocrWorker;
      };

      // Extract text from uploaded documents
      for (const file of files) {
        try {
          const extractedText = await extractDocumentText(
            file,
            getOcrWorker
          );

          if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({
              success: false,
              message: `No readable text found in "${file.originalname}".`,
            });
          }

          documents.push({
            fileName: file.originalname,
            text: extractedText.slice(0, MAX_EXTRACTED_TEXT),
          });
        } catch (error) {
          const messages = {
            INVALID_PDF: "is not a valid PDF.",
            INVALID_IMAGE: "is not a valid JPG or PNG image.",
            UNSUPPORTED_FILE: "has an unsupported file format.",
          };

          if (messages[error.message]) {
            return res.status(400).json({
              success: false,
              message: `"${file.originalname}" ${messages[error.message]}`,
            });
          }

          console.error("Document extraction error:", error);

          return res.status(500).json({
            success: false,
            message: `Could not process "${file.originalname}".`,
          });
        }
      }

      // Generate AI report
      const finalReport = await generateFinalReport({
        interviewSummary,
        medicalHistory,
        documents,
      });

      // Generate and encrypt patient token
      const accessToken = generateAccessToken();
      const encryptedToken = encryptAccessToken(accessToken);

      // Save consultation report
      savedReport = await ConsultationReport.create({
        patientId: req.user.userId,
        finalReport,
        accessTokenHash: hashAccessToken(accessToken),
        accessTokenEncrypted: encryptedToken.encrypted,
        accessTokenIv: encryptedToken.iv,
        accessTokenAuthTag: encryptedToken.authTag,
      });

      // Save original uploaded documents
      if (files.length > 0) {
        await mkdir(documentStorageDirectory, {
          recursive: true,
        });

        const documentRecords = [];

        for (const file of files) {
          const extension = getExtension(file.originalname);
          const storedFileName = `${randomUUID()}${extension}`;

          const absoluteFilePath = path.join(
            documentStorageDirectory,
            storedFileName
          );

          await writeFile(absoluteFilePath, file.buffer);
          savedFilePaths.push(absoluteFilePath);

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

        await MedicalDocument.insertMany(documentRecords);
      }

      return res.status(201).json({
        success: true,
        message: "Final consultation report generated successfully.",
        data: {
          reportId: savedReport._id,
          finalReport: savedReport.finalReport,
          accessToken,
          createdAt: savedReport.createdAt,
        },
      });
    } catch (error) {
      // Clean up saved records if submission fails
      if (savedReport) {
        try {
          await MedicalDocument.deleteMany({
            patientId: req.user.userId,
            consultationId: savedReport._id,
          });

          await ConsultationReport.findByIdAndDelete(savedReport._id);
        } catch (cleanupError) {
          console.error("Database cleanup failed:", cleanupError);
        }
      }

      if (savedFilePaths.length > 0) {
        await Promise.allSettled(
          savedFilePaths.map((filePath) => unlink(filePath))
        );
      }

      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Each document must be 10 MB or smaller."
              : error.code === "LIMIT_FILE_COUNT"
                ? "You can upload a maximum of 5 documents."
                : "Uploaded files could not be processed.",
        });
      }

      if (
        error.message ===
        "Only PDF, JPG, JPEG and PNG files are allowed."
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Consultation submission error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to generate the final report. Please try again.",
      });
    } finally {
      if (ocrWorker) {
        await ocrWorker.terminate();
      }
    }
  }
);

export default router;
