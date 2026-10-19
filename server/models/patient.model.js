import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    hospitalNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // email: {
    //   type: String,
    //   trim: true,
    //   lowercase: true,
    // },

    // address: {
    //   type: String,
    //   trim: true,
    // },

    // occupation: {
    //   type: String,
    //   trim: true,
    // },

    // maritalStatus: {
    //   type: String,
    //   enum: [
    //     "single",
    //     "married",
    //     "divorced",
    //     "widowed",
    //     "separated",
    //     "unknown",
    //   ],
    // },

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      address: String,
    },

    // Long-term history
    allergies: [
      {
        allergen: {
          type: String,
          required: true,
        },

        reaction: String,

        severity: {
          type: String,
          enum: ["mild", "moderate", "severe", "unknown"],
        },

        status: {
          type: String,
          enum: ["active", "resolved", "uncertain"],
          default: "active",
        },

        recordedAt: {
          type: Date,
          default: Date.now,
        },

        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    medicalHistory: [
      {
        condition: String,
        diagnosisDate: Date,
        status: {
          type: String,
          enum: ["active", "resolved", "unknown"],
        },

        notes: String,

        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    familyHistory: [
      {
        condition: String,
        relationship: String,
        notes: String,
      },
    ],

    socialHistory: {
      smoking: {
        status: {
          type: String,
          enum: ["never", "current", "former", "unknown"],
        },
        quantity: String,
      },

      alcohol: {
        status: {
          type: String,
          enum: ["none", "occasional", "regular", "unknown"],
        },
        quantity: String,
      },

      occupationExposure: String,

      livingArrangement: String,

      notes: String,
    },

    herbalMedicineHistory: [
      {
        productName: String,
        purpose: String,
        frequency: String,
        currentUse: Boolean,
        notes: String,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "deceased"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.index({ hospitalNumber: 1 }, { unique: true });

patientSchema.index({
  lastName: 1,
  firstName: 1,
});

export default mongoose.model("Patient", patientSchema);
