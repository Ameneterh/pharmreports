import mongoose from "mongoose";

const medicationTherapySchema = new mongoose.Schema(
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

    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },

    // Snapshot in case medication master data changes
    drugName: {
      type: String,
      required: true,
    },

    dose: {
      value: Number,
      unit: String,
    },

    dosageForm: String,

    route: String,

    frequency: String,

    indication: String,

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      enum: ["active", "completed", "discontinued", "held", "planned"],
      default: "active",
    },

    source: {
      type: String,
      enum: [
        "prescription",
        "patient_report",
        "previous_history",
        "pharmacist",
        "other",
      ],
    },

    comments: String,

    response: String,

    adherence: {
      status: {
        type: String,
        enum: ["good", "partial", "poor", "unknown"],
      },

      notes: String,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

medicationTherapySchema.index({
  patient: 1,
  status: 1,
});

medicationTherapySchema.index({
  encounter: 1,
  status: 1,
});

export default mongoose.model("MedicationTherapy", medicationTherapySchema);
