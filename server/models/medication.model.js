import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    genericName: {
      type: String,
      required: true,
      trim: true,
    },

    brandNames: [
      {
        type: String,
        trim: true,
      },
    ],

    strength: String,

    dosageForm: String,

    route: String,

    therapeuticClass: String,

    pharmacologicalClass: String,

    activeIngredients: [
      {
        name: String,
        strength: String,
        unit: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

medicationSchema.index({
  genericName: 1,
});

medicationSchema.index({
  genericName: "text",
  brandNames: "text",
});

export default mongoose.model("Medication", medicationSchema);
