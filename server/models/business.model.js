import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    business_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    business_phone: {
      type: String,
      required: true,
      unique: true,
    },

    business_address: {
      type: String,
      required: true,
    },

    banker: {
      type: String,
    },

    account_name: {
      type: String,
    },

    account_number: {
      type: String,
    },

    business_logo: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/black-white-handshake-symbol-with-starburst-background_1294240-23568.jpg",
    },

    website: {
      type: String,
      lowercase: true,
      trim: true,
    },

    subscription: {
      plan: {
        type: String,
        enum: ["free", "monthly", "yearly", "lifetime"],
        default: "free",
      },

      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active",
      },

      startedAt: {
        type: Date,
      },

      expiresAt: {
        type: Date,
      },

      autoRenew: {
        type: Boolean,
        default: true,
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // invoicePrefix: {
    //   type: String,
    //   required: true,
    // },

    invoiceLimit: {
      type: Number,
      default: 5,
    },

    maxHandlers: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    plan: {
      type: String,
      enum: ["trial", "basic", "premium"],
      default: "trial",
    },
  },
  { timestamps: true },
);

const Business = mongoose.model("Business", businessSchema);

export default Business;
