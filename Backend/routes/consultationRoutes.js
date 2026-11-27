
import { Router } from "express";
import multer from "multer";
import { extractPdfText } from "../utils/pdfParser.js";
import { createWorker } from "tesseract.js";
import { pdf as renderPdf } from "pdf-to-img";
import { z } from "zod";
import User from "../models/User.js";
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

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_FILES = 5;
const MAX_TEXT_LENGTH = 5000;
const MAX_EXTRACTED_TEXT = 100000;
const MIN_PDF_TEXT_LENGTH = 30;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".dcm",
  ".zip",
];

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

function isDicom(file) {
  return getExtension(file.originalname) === ".dcm";
}

function isDicomZip(file) {
  return getExtension(file.originalname) === ".zip";
}

function isDicomFile(file) {
  return isDicom(file) || isDicomZip(file);
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
      "application/dicom",
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
    ];

    if (
      !ALLOWED_EXTENSIONS.includes(getExtension(file.originalname)) ||
      !allowedMimes.includes(file.mimetype)
    ) {
      return callback(
        new Error(
          "Only PDF, JPG, JPEG, PNG, DICOM and ZIP files are allowed."
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

function hasValidZipSignature(buffer) {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  const signature = buffer.subarray(0, 4).toString("hex");

  return ["504b0304", "504b0506", "504b0708"].includes(signature);
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

function getStoredMimeType(file) {
  if (isPdf(file)) return "application/pdf";
  if (isDicom(file)) return "application/dicom";
  if (isDicomZip(file)) return "application/zip";

  return getImageType(file.buffer);
}

function validateDicomFile(file) {
  // DICOM files can have different encodings and may not always
  // contain the standard DICM marker at byte position 128.
  // The .dcm extension is used here to identify the upload.
  return isDicom(file) && file.buffer.length > 0;
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

  // DICOM and ZIP files are stored in their original form.
  // They are not processed by OCR or sent to the AI summariser.
  if (isDicom(file)) {
    if (!validateDicomFile(file)) {
      throw new Error("INVALID_DICOM");
    }

    return "";
  }

  if (isDicomZip(file)) {
    if (!hasValidZipSignature(file.buffer)) {
      throw new Error("INVALID_DICOM_ZIP");
    }

    return "";
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

// ==================== DOCTOR: LOOK UP REPORT USING PATIENT TOKEN ====================

router.post("/doctor/lookup-token", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can access patient reports.",
      });
    }

    const { accessToken } = req.body;

    if (
      typeof accessToken !== "string" ||
      !accessToken.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter the patient's access token.",
      });
    }

    const normalizedToken = accessToken.trim().toUpperCase();

    const report = await ConsultationReport.findOne({
      accessTokenHash: hashAccessToken(normalizedToken),
    })
      .select("patientId finalReport createdAt")
      .lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found. Please check the access token.",
      });
    }

    const patient = await User.findOne({
      _id: report.patientId,
      role: "patient",
    })
      .select("fullName email phone dateOfBirth gender bloodGroup city")
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient information could not be found.",
      });
    }

    const documents = await MedicalDocument.find({
      patientId: report.patientId,
      consultationId: report._id,
    })
      .select("_id originalName mimeType fileSize category createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Patient report retrieved successfully.",
      data: {
        patient: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          city: patient.city,
        },
        report: report.finalReport,
        reportId: report._id,
        createdAt: report.createdAt,
        documents,
      },
    });
  } catch (error) {
    console.error("Doctor report lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the patient report.",
    });
  }
});

// ==================== DOCTOR: VIEW UPLOADED DOCUMENT ====================

router.get(
  "/doctor/:reportId/documents/:documentId/file",
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== "doctor") {
        return res.status(403).json({
          success: false,
          message: "Only doctors can view patient documents.",
        });
      }

      const report = await ConsultationReport.findById(
        req.params.reportId
      ).select("patientId accessTokenHash");

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Consultation report not found.",
        });
      }

      const providedToken = req.headers["x-report-access-token"];

      if (
        typeof providedToken !== "string" ||
        hashAccessToken(providedToken.trim().toUpperCase()) !==
          report.accessTokenHash
      ) {
        return res.status(403).json({
          success: false,
          message: "Invalid report access token.",
        });
      }

      const document = await MedicalDocument.findOne({
        _id: req.params.documentId,
        consultationId: report._id,
        patientId: report.patientId,
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      const safeFileName = path
        .basename(document.originalName)
        .replace(/["\\]/g, "_");

      res.setHeader("Content-Type", document.mimeType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${safeFileName}"`
      );
      res.setHeader("X-Content-Type-Options", "nosniff");

      return res.sendFile(document.filePath, (error) => {
        if (error && !res.headersSent) {
          console.error("Doctor document viewing error:", error);

          res.status(404).json({
            success: false,
            message: "Unable to open this document.",
          });
        }
      });
    } catch (error) {
      console.error("Doctor document error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to view the document.",
      });
    }
  }
);

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
          message:
            "Please provide a valid interview summary and medical history.",
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

      // Extract text only from PDFs and normal images.
      // DICOM files are intentionally excluded from AI processing.
      for (const file of files) {
        try {
          const extractedText = await extractDocumentText(
            file,
            getOcrWorker
          );

          if (isDicomFile(file)) {
            continue;
          }

          if (!extractedText || !extractedText.trim()) {
            if (isPdf(file)) {
              return res.status(400).json({
                success: false,
                message: `No readable text found in "${file.originalname}".`,
              });
            }

            continue;
          }

          documents.push({
            fileName: file.originalname,
            text: extractedText.slice(0, MAX_EXTRACTED_TEXT),
          });
        } catch (error) {
          const messages = {
            INVALID_PDF: "is not a valid PDF.",
            INVALID_IMAGE: "is not a valid JPG or PNG image.",
            INVALID_DICOM: "is not a valid DICOM file.",
            INVALID_DICOM_ZIP: "is not a valid ZIP archive.",
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

      // Generate AI report using text-based documents only.
      const finalReport = await generateFinalReport({
        interviewSummary,
        medicalHistory,
        documents,
      });

      // Generate and encrypt patient token.
      const accessToken = generateAccessToken();
      const encryptedToken = encryptAccessToken(accessToken);

      // Save consultation report.
      savedReport = await ConsultationReport.create({
        patientId: req.user.userId,
        finalReport,
        accessTokenHash: hashAccessToken(accessToken),
        accessTokenEncrypted: encryptedToken.encrypted,
        accessTokenIv: encryptedToken.iv,
        accessTokenAuthTag: encryptedToken.authTag,
      });

      // Save original uploaded documents.
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

          const mimeType = getStoredMimeType(file);

          if (!mimeType) {
            throw new Error("INVALID_FILE_CONTENT");
          }

          let category = "Other";

          if (isImage(file) || isDicom(file)) {
            category = "Scans & Images";
          }

          if (isDicomZip(file)) {
            category = "DICOM Series";
          }

          documentRecords.push({
            patientId: req.user.userId,
            consultationId: savedReport._id,
            originalName: file.originalname,
            storedFileName,
            filePath: absoluteFilePath,
            mimeType,
            fileSize: file.size,
            uploadSource: "consultation",
            category,
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
      // Clean up saved records if submission fails.
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
              ? "Each document must be 100 MB or smaller."
              : error.code === "LIMIT_FILE_COUNT"
                ? "You can upload a maximum of 5 documents."
                : "Uploaded files could not be processed.",
        });
      }

      if (
        error.message ===
        "Only PDF, JPG, JPEG, PNG, DICOM and ZIP files are allowed."
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "INVALID_FILE_CONTENT") {
        return res.status(400).json({
          success: false,
          message: "One of the uploaded files has invalid content.",
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
