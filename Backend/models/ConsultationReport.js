
import mongoose from "mongoose";

const consultationReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    finalReport: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Hashed patient report access token
    accessTokenHash: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Encrypted token for displaying it again to the patient
    accessTokenEncrypted: {
      type: String,
    },

    accessTokenIv: {
      type: String,
    },

    accessTokenAuthTag: {
      type: String,
    },

  },
  { timestamps: true }
);

const ConsultationReport =
  mongoose.models.ConsultationReport ||
  mongoose.model("ConsultationReport", consultationReportSchema);

export default ConsultationReport;
