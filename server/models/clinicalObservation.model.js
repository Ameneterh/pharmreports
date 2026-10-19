import mongoose from "mongoose";

const clinicalObservationSchema = new mongoose.Schema(
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

    observationDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "blood_pressure",
        "heart_rate",
        "respiratory_rate",
        "temperature",
        "oxygen_saturation",
        "weight",
        "height",
        "blood_glucose",
        "pain_score",
        "other",
      ],
      required: true,
    },

    value: Number,

    systolic: Number,

    diastolic: Number,

    unit: String,

    interpretation: String,

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

clinicalObservationSchema.index({
  patient: 1,
  type: 1,
  observationDate: -1,
});

export default mongoose.model("ClinicalObservation", clinicalObservationSchema);
