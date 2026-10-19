import mongoose from "mongoose";

const drugRelatedProblemSchema = new mongoose.Schema(
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

    category: {
      type: String,
      enum: [
        "medication_related",
        "disease_related",
        "lifestyle_related",
        "other",
      ],
      required: true,
    },

    type: {
      type: String,
      enum: [
        "low_dose",
        "high_dose",
        "drug_drug_interaction",
        "drug_food_interaction",
        "wrong_medication",
        "suggested_drug_addition",
        "suggested_drug_deletion",
        "non_adherence",
        "adverse_drug_reaction",
        "inappropriate_dosage_form",
        "incorrect_administration",
        "disease_not_controlled",
        "untreated_indication",
        "lifestyle_problem",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    relatedMedications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicationTherapy",
      },
    ],

    relatedDiagnoses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis",
      },
    ],

    severity: {
      type: String,
      enum: ["minor", "moderate", "major", "critical", "unknown"],
      default: "unknown",
    },

    status: {
      type: String,
      enum: [
        "identified",
        "intervention_planned",
        "resolved",
        "unresolved",
        "monitoring",
      ],
      default: "identified",
    },

    identifiedDate: {
      type: Date,
      default: Date.now,
    },

    resolvedDate: Date,

    identifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

drugRelatedProblemSchema.index({
  patient: 1,
  status: 1,
});

drugRelatedProblemSchema.index({
  encounter: 1,
  category: 1,
});

export default mongoose.model("DrugRelatedProblem", drugRelatedProblemSchema);
