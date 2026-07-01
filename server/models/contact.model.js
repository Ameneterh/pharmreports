import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    sender_name: {
      type: String,
      required: true,
      trim: true,
    },

    sender_email: {
      type: String,
      required: true,
    },

    sender_phone: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "deleted"],
      default: "unread",
    },

    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
