import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true,
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("LabTest", labTestSchema);
