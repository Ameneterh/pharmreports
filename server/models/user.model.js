import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["architect", "admin", "pharmacist", "pharmtech", "staff"],
      required: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    usernameLower: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      // sparse: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },

    avatar: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/black-white-handshake-symbol-with-starburst-background_1294240-23568.jpg",
    },

    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    rank: {
      type: String,
      enum: [
        "Pharmacy Technician",
        "Senior Pharm Tech",
        "Intern Pharmacist",
        "Pharmacist 1",
        "Senior Pharmacist",
        "Principal Pharmacist",
        "Chief Pharmacist",
        "Asst Director",
        "Dep Director",
        "Director",
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
