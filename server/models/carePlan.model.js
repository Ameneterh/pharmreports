import mongoose from "mongoose";

const carePlanSchema = new mongoose.Schema(
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

    drugRelatedProblem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DrugRelatedProblem",
      required: true,
      index: true,
    },

    problemStatement: {
      type: String,
      required: true,
    },

    goals: [
      {
        description: String,

        targetValue: String,

        targetDate: Date,

        status: {
          type: String,
          enum: ["pending", "in_progress", "achieved", "not_achieved"],
          default: "pending",
        },
      },
    ],

    interventions: [
      {
        description: String,

        interventionType: {
          type: String,
          enum: [
            "drug_change",
            "dose_adjustment",
            "drug_addition",
            "drug_discontinuation",
            "patient_counselling",
            "monitoring",
            "referral",
            "lifestyle_modification",
            "prescriber_communication",
            "other",
          ],
        },

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        performedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    progressNotes: [
      {
        note: String,

        progressStatus: {
          type: String,
          enum: ["no_change", "improving", "worsening", "resolved"],
        },

        recordedAt: {
          type: Date,
          default: Date.now,
        },

        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    outcome: {
      description: String,

      status: {
        type: String,
        enum: [
          "resolved",
          "partially_resolved",
          "not_resolved",
          "unable_to_assess",
        ],
      },

      date: Date,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
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

carePlanSchema.index({
  patient: 1,
  status: 1,
});

export default mongoose.model("CarePlan", carePlanSchema);
