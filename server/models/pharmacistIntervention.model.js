import mongoose from "mongoose";

const pharmacistInterventionSchema = new mongoose.Schema(
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
      index: true,
    },

    type: {
      type: String,
      enum: [
        "prescriber_recommendation",
        "patient_counselling",
        "dose_adjustment",
        "drug_addition",
        "drug_discontinuation",
        "drug_switch",
        "monitoring",
        "adherence_intervention",
        "lifestyle_counselling",
        "referral",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    recommendation: String,

    recipient: {
      type: String,
      enum: ["patient", "prescriber", "nurse", "caregiver", "other"],
    },

    response: String,

    acceptance: {
      type: String,
      enum: [
        "accepted",
        "rejected",
        "partially_accepted",
        "pending",
        "not_applicable",
      ],
    },

    interventionDate: {
      type: Date,
      default: Date.now,
    },

    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "PharmacistIntervention",
  pharmacistInterventionSchema,
);
