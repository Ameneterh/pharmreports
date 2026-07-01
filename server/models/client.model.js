import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      required: true,
      unique: true,
    },
    client_email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    client_phone: {
      type: String,
      required: true,
      unique: true,
    },
    client_address: {
      type: String,
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
