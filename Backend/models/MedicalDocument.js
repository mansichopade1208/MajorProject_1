
import mongoose from "mongoose";

const medicalDocumentSchema = new mongoose.Schema(
  {
    // Patient who owns this document
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Consultation associated with this document, if applicable
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsultationReport",
      default: null,
    },

    // Original filename uploaded by the patient
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    // Unique filename used for permanent storage
    storedFileName: {
      type: String,
      required: true,
      unique: true,
    },

    // Location of the stored file on the server
    filePath: {
      type: String,
      required: true,
    },

    // Supported document MIME types
    mimeType: {
      type: String,
      required: true,
      enum: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/dicom",
        "application/zip",
      ],
    },

    // File size in bytes
    fileSize: {
      type: Number,
      required: true,
    },

    // Where the document was uploaded from
    uploadSource: {
      type: String,
      enum: ["consultation", "manual"],
      default: "consultation",
    },

    // Document category
    category: {
      type: String,
      enum: [
        "Lab Reports",
        "Prescriptions",
        "Scans & Images",
        "DICOM Series",
        "Other",
      ],
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

// Quickly retrieve documents belonging to a patient
medicalDocumentSchema.index({
  patientId: 1,
  createdAt: -1,
});

const MedicalDocument =
  mongoose.models.MedicalDocument ||
  mongoose.model("MedicalDocument", medicalDocumentSchema);

export default MedicalDocument;
