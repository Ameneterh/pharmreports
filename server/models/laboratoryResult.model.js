import mongoose from "mongoose";

const laboratoryResultSchema = new mongoose.Schema(
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
      index: true,
    },

    testName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTest",
      index: true,
    },

    testCode: String,

    specimen: String,

    result: {
      value: Number,

      text: String,

      unit: String,
    },

    referenceRange: {
      low: Number,
      high: Number,
      text: String,
    },

    interpretation: {
      type: String,
      enum: ["normal", "low", "high", "critical", "abnormal", "unknown"],
    },

    collectedAt: Date,

    reportedAt: Date,

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

laboratoryResultSchema.index({
  patient: 1,
  testName: 1,
  collectedAt: -1,
});

export default mongoose.model("LaboratoryResult", laboratoryResultSchema);
