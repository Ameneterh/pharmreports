import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    encounter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Encounter",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    codeSystem: {
      type: String,
      enum: ["ICD-10", "SNOMED", "LOCAL", "OTHER"],
      default: "LOCAL",
    },

    code: String,

    diagnosisType: {
      type: String,
      enum: ["primary", "secondary", "comorbidity", "historical"],
      default: "secondary",
    },

    status: {
      type: String,
      enum: ["active", "resolved", "suspected"],
      default: "active",
    },

    notes: String,

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

diagnosisSchema.index({
  encounter: 1,
  diagnosisType: 1,
});

export default mongoose.model("Diagnosis", diagnosisSchema);
