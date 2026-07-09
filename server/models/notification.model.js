import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
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

    notificationBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
