
import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { mkdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import MedicalDocument from "../models/MedicalDocument.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Storage directory
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const backendDirectory = path.resolve(currentDirectory, "..");

const documentStorageDirectory = path.join(
  backendDirectory,
  "uploads",
  "medical-documents"
);

// Allowed categories
const allowedCategories = [
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "Other",
];

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPG and PNG files are allowed.")
      );
    }

    cb(null, true);
  },
});

// Authentication and patient authorization
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

// Upload a document manually
router.post("/upload", (req, res, next) => {
  upload.single("medicalDocument")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "File upload failed.",
      });
    }

    next();
  });
}, async (req, res) => {
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

    const extensionMap = {
      "application/pdf": ".pdf",
      "image/jpeg": ".jpg",
      "image/png": ".png",
    };

    const extension = extensionMap[req.file.mimetype];

    if (!extension) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format.",
      });
    }

    await mkdir(documentStorageDirectory, {
      recursive: true,
    });

    const storedFileName = `${randomUUID()}${extension}`;

    savedFilePath = path.join(
      documentStorageDirectory,
      storedFileName
    );

    // Save actual file
    const { writeFile } = await import("node:fs/promises");

    await writeFile(savedFilePath, req.file.buffer);

    // Save document metadata
    savedDocument = await MedicalDocument.create({
      patientId: req.user.userId,
      consultationId: null,
      originalName: path.basename(req.file.originalname),
      storedFileName,
      filePath: savedFilePath,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadSource: "manual",
      category,
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

    // Roll back saved file and database record if necessary
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
});

// Get patient documents
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

// View/download document
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

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${path.basename(document.originalName)}"`
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

// Delete document
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
