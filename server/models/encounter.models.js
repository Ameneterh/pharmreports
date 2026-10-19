import mongoose from "mongoose";

const encounterSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    encounterType: {
      type: String,
      enum: [
        "admission",
        "outpatient",
        "pharmaceutical_care",
        "follow_up",
        "discharge",
        "medication_review",
        "other",
      ],
      required: true,
    },

    encounterDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    admissionDate: Date,

    dischargeDate: Date,

    hospital: String,

    ward: String,

    bed: String,

    consultant: {
      name: String,
      specialty: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Patient's measurements at this encounter
    height: Number,

    heightUnit: {
      type: String,
      default: "cm",
    },

    weight: Number,

    weightUnit: {
      type: String,
      default: "kg",
    },

    // Subjective assessment
    presentingComplaints: String,

    complaintDuration: String,

    familyHistoryNotes: String,

    socialHistoryNotes: String,

    pastMedicalHistoryNotes: String,

    complianceHistory: String,

    medicationAllergyNotes: String,

    herbalMedicineNotes: String,

    currentMedicationComplaints: String,

    // Objective assessment
    objectiveNotes: String,

    // Clinical summary
    assessmentSummary: String,

    status: {
      type: String,
      enum: ["open", "completed", "cancelled"],
      default: "open",
    },

    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

encounterSchema.index({
  patient: 1,
  encounterDate: -1,
});

encounterSchema.index({
  patient: 1,
  status: 1,
});

export default mongoose.model("Encounter", encounterSchema);
