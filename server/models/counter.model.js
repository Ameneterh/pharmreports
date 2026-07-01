import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

counterSchema.index(
  {
    business: 1,
    year: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Counter", counterSchema);
