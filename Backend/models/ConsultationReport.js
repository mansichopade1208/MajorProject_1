
import mongoose from "mongoose";

const consultationReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    finalReport: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ConsultationReport =
  mongoose.models.ConsultationReport ||
  mongoose.model("ConsultationReport", consultationReportSchema);

export default ConsultationReport;
