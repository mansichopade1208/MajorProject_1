
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
  },
  { timestamps: true }
);

const ConsultationReport =
  mongoose.models.ConsultationReport ||
  mongoose.model("ConsultationReport", consultationReportSchema);

export default ConsultationReport;
