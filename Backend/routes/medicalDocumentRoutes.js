
import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import MedicalDocument from "../models/MedicalDocument.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// ==================== STORAGE DIRECTORY ====================

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const backendDirectory = path.resolve(currentDirectory, "..");

const documentStorageDirectory = path.join(
  backendDirectory,
  "uploads",
  "medical-documents"
);

// ==================== CONFIGURATION ====================

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const allowedCategories = [
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "DICOM Series",
  "Other",
];

const allowedExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".dcm",
  ".zip",
];

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/dicom",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
];

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function isDicom(file) {
  return getExtension(file.originalname) === ".dcm";
}

function isZip(file) {
  return getExtension(file.originalname) === ".zip";
}

function hasValidZipSignature(buffer) {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  const signature = buffer.subarray(0, 4).toString("hex");

  return [
    "504b0304",
    "504b0506",
    "504b0708",
  ].includes(signature);
}

function getMimeType(file) {
  if (isDicom(file)) {
    return "application/dicom";
  }

  if (isZip(file)) {
    return "application/zip";
  }

  const extension = getExtension(file.originalname);

  const mimeMap = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };

  return mimeMap[extension] || null;
}

function getStoredExtension(file) {
  const extension = getExtension(file.originalname);

  const allowedMimeByExtension = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".dcm": "application/dicom",
    ".zip": "application/zip",
  };

  return allowedMimeByExtension[extension] ? extension : null;
}

// ==================== MULTER CONFIGURATION ====================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    const extension = getExtension(file.originalname);

    if (
      !allowedExtensions.includes(extension) ||
      !allowedTypes.includes(file.mimetype)
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

// ==================== AUTHENTICATION ====================

router.use(authenticateToken);

router.use((req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({
      success: false,
      message: "Only patients can access medical documents.",
    });
  }

  next();
});

// ==================== UPLOAD DOCUMENT ====================

router.post(
  "/upload",
  (req, res, next) => {
    upload.single("medicalDocument")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "File size must be 100 MB or smaller."
              : error.message || "File upload failed.",
        });
      }

      next();
    });
  },

  async (req, res) => {
    let savedFilePath = null;
    let savedDocument = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a document.",
        });
      }

      const category = req.body.category;

      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid document category.",
        });
      }

      const extension = getStoredExtension(req.file);
      const mimeType = getMimeType(req.file);

      if (!extension || !mimeType) {
        return res.status(400).json({
          success: false,
          message: "Unsupported file format.",
        });
      }

      // Validate ZIP archive before saving.
      if (isZip(req.file) && !hasValidZipSignature(req.file.buffer)) {
        return res.status(400).json({
          success: false,
          message: "The uploaded ZIP file is invalid.",
        });
      }

      if (isDicom(req.file) && req.file.buffer.length === 0) {
        return res.status(400).json({
          success: false,
          message: "The uploaded DICOM file is empty.",
        });
      }

      // Create storage directory.
      await mkdir(documentStorageDirectory, {
        recursive: true,
      });

      const storedFileName = `${randomUUID()}${extension}`;

      savedFilePath = path.join(
        documentStorageDirectory,
        storedFileName
      );

      // Save original uploaded file.
      await writeFile(savedFilePath, req.file.buffer);

      // Assign category for DICOM files.
      let finalCategory = category;

      if (isZip(req.file)) {
        finalCategory = "DICOM Series";
      } else if (isDicom(req.file)) {
        finalCategory = "Scans & Images";
      }

      // Save document metadata.
      savedDocument = await MedicalDocument.create({
        patientId: req.user.userId,
        consultationId: null,
        originalName: path.basename(req.file.originalname),
        storedFileName,
        filePath: savedFilePath,
        mimeType,
        fileSize: req.file.size,
        uploadSource: "manual",
        category: finalCategory,
      });

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully.",

        data: {
          _id: savedDocument._id,
          originalName: savedDocument.originalName,
          mimeType: savedDocument.mimeType,
          fileSize: savedDocument.fileSize,
          category: savedDocument.category,
          uploadSource: savedDocument.uploadSource,
          createdAt: savedDocument.createdAt,
        },
      });
    } catch (error) {
      console.error("Manual document upload error:", error);

      // Roll back saved file and database record.
      if (savedDocument) {
        await MedicalDocument.findByIdAndDelete(
          savedDocument._id
        ).catch(console.error);
      }

      if (savedFilePath) {
        await unlink(savedFilePath).catch(console.error);
      }

      return res.status(500).json({
        success: false,
        message: "Unable to upload document.",
      });
    }
  }
);

// ==================== GET PATIENT DOCUMENTS ====================

router.get("/my-documents", async (req, res) => {
  try {
    const documents = await MedicalDocument.find({
      patientId: req.user.userId,
    })
      .select("-filePath -storedFileName")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Fetch medical documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve medical documents.",
    });
  }
});

// ==================== VIEW / DOWNLOAD DOCUMENT ====================

router.get("/:id/file", async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({
      _id: req.params.id,
      patientId: req.user.userId,
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
        console.error("Document file error:", error);

        res.status(404).json({
          success: false,
          message: "Document file could not be found.",
        });
      }
    });
  } catch (error) {
    console.error("View medical document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to open this document.",
    });
  }
});

// ==================== DELETE DOCUMENT ====================

router.delete("/:id", async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({
      _id: req.params.id,
      patientId: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await unlink(document.filePath).catch((error) => {
      if (error.code !== "ENOENT") {
        throw error;
      }
    });

    await MedicalDocument.findByIdAndDelete(document._id);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete this document.",
    });
  }
});

export default router;
