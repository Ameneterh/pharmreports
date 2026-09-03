import mongoose from "mongoose";

const updatesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    readBy: [
      {
        reader: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    updateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Update = mongoose.model("Update", updatesSchema);

export default Update;
