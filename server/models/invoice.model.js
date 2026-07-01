import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const paymentRecordSchema = new mongoose.Schema(
  {
    amount: Number,

    paymentMethod: {
      type: String,
      enum: ["cash", "transfer", "pos", "cheque"],
    },

    reference: String,

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      // unique: true,
    },

    invoiceType: {
      type: String,
      enum: ["proforma", "cash"],
      required: true,
    },

    invDate: {
      type: Date,
      default: Date.now,
    },

    validity: { type: String, default: "" },

    items: [invoiceItemSchema],

    subtotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "part-payment", "paid", "cancelled"],
      default: "pending",
    },

    totalAmountReceived: {
      type: Number,
      default: 0,
    },

    paymentRecords: [paymentRecordSchema],

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// ADD INDEXES HERE
invoiceSchema.index(
  {
    company: 1,
    invoiceNumber: 1,
  },
  {
    unique: true,
  },
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
