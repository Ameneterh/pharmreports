import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    workStation: {
      type: String,
      required: true,
      trim: true,
    },

    dutyType: {
      type: String,
      required: true,
      trim: true,
    },

    reportStartDate: {
      type: Date,
    },

    reportEndDate: {
      type: Date,
    },

    timeOfDuty: {
      type: String,
      required: true,
      trim: true,
    },

    dutyDateTime: {
      type: String,
      required: true,
      trim: true,
    },

    reportingWeekStart: Date,

    dutiesDone: {
      type: String,
      required: true,
      trim: true,
    },

    challenges: {
      type: String,
      required: true,
      trim: true,
    },

    observations: {
      type: String,
      required: true,
      trim: true,
    },

    interventions: {
      type: String,
      required: true,
      trim: true,
    },

    outOfStock: {
      type: String,
      required: true,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    comments: [
      {
        commentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
