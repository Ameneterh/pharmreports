import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
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
    },

    carePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarePlan",
    },

    scheduledDate: Date,

    actualDate: Date,

    monitoringParameters: [
      {
        name: String,
        target: String,
      },
    ],

    findings: String,

    outcome: String,

    status: {
      type: String,
      enum: ["scheduled", "completed", "missed", "cancelled"],
      default: "scheduled",
    },

    nextFollowUpDate: Date,

    notes: String,

    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

followUpSchema.index({
  patient: 1,
  scheduledDate: 1,
});

export default mongoose.model("FollowUp", followUpSchema);
