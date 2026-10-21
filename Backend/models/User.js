
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },

    // Patient fields
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    bloodGroup: String,
    city: String,
    address: String,

    // Doctor fields
    medicalRegistrationNumber: String,
    specialization: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
