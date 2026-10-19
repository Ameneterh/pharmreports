import Patient from "../models/patient.model.js";
import mongoose from "mongoose";

// add new user
export const addPatient = async (req, res) => {
  try {
    const {
      hospitalNumber,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      sex,
      phone,
      emergencyContact,
      allergies,
      medicalHistory,
      familyHistory,
      socialHistory,
      herbalMedicineHistory,
    } = req.body;

    // 1. Validate required fields
    if (
      !hospitalNumber?.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !dateOfBirth ||
      !sex
    ) {
      return res.status(400).json({
        message:
          "Hospital number, first name, last name, date of birth, and sex are required.",
      });
    }

    // 2. Validate authenticated user
    if (!req.user._id || !mongoose.isValidObjectId(req.user._id)) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    // 3. Validate sex
    if (!["male", "female"].includes(sex)) {
      return res.status(400).json({
        message: "Sex must be male or female.",
      });
    }

    // 4. Validate date of birth
    const dob = new Date(dateOfBirth);

    if (Number.isNaN(dob.getTime()) || dob > new Date()) {
      return res.status(400).json({
        message: "Please provide a valid date of birth.",
      });
    }

    // 5. Normalize hospital number
    const normalizedHospitalNumber = hospitalNumber.trim().toUpperCase();

    // 6. Check for an existing patient
    const existingPatient = await Patient.findOne({
      hospitalNumber: normalizedHospitalNumber,
    }).select("_id hospitalNumber fullname");

    if (existingPatient) {
      return res.status(409).json({
        message: "A patient with this hospital number already exists.",
        patient: existingPatient,
      });
    }

    // 7. Generate fullname on the server
    const fullname = [firstName, middleName, lastName]
      .filter((name) => name?.trim())
      .map((name) => name.trim())
      .join(" ");

    // 8. Prepare the patient document
    const patientData = {
      hospitalNumber: normalizedHospitalNumber,
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      fullname,
      dateOfBirth: dob,
      sex,
      phone: phone?.trim() || undefined,

      emergencyContact,
      allergies,
      medicalHistory,
      familyHistory,
      socialHistory,
      herbalMedicineHistory,

      // Never take createdBy from req.body.
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    // 9. Save to MongoDB
    const patient = await Patient.create(patientData);

    // 10. Return the saved patient
    return res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    // Handle duplicate-key race conditions.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A patient with this hospital number already exists.",
      });
    }

    // Handle Mongoose validation errors.
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Patient validation failed.",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    // Handle invalid MongoDB values.
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "One or more patient fields are invalid.",
      });
    }

    return res.status(500).json({
      message: "Failed to register patient.",
    });
  }
};

// redundant code below, consider removing it to avoid confusion
export const addPatientRedundant = async (req, res) => {
  const {
    hospitalNumber,
    fullname,
    phoneNumber,
    dateOfBirth,
    admissionDate,
    ward,
    bed,
    consultant,
    createdBy,
  } = req.body;

  try {
    // check content from req.body
    if (
      !hospitalNumber ||
      !fullname ||
      !phoneNumber ||
      !dateOfBirth ||
      !admissionDate ||
      !ward ||
      !bed ||
      !consultant
    ) {
      throw new Error("All fields are required!");
    }

    // check if user already exists
    const patientExists = await Patient.findOne({ hospitalNumber }).collation({
      locale: "en",
      strength: 2,
    });

    if (patientExists) {
      return res
        .status(400)
        .json({ success: false, message: "Patient already exists" });
    }

    // save new user
    const patient = await Patient.create({
      hospitalNumber,
      fullname,
      phoneNumber,
      dateOfBirth,
      admissionDate,
      ward,
      bed,
      consultant,
      createdBy,
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: "New patient successfully added",
      patient,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists.",
      });
    }

    throw error;
    // res.status(400).json({ success: false, message: error.message });
  }
};

// 1. get all users
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({
      status: { $in: ["active"] },
    }).populate("createdBy");

    const patientsCount = await Patient.aggregate([
      {
        $match: {
          status: { $in: ["active", "pharmtech", "staff"] },
        },
      },
      //   {
      //     $group: {
      //       _id: "$role",
      //       count: { $sum: 1 },
      //     },
      //   },
    ]);

    const formattedCounts = patientsCount.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalPatients = await Patient.countDocuments({
      status: { $in: ["active", "deleted"] },
    });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthPatients = await Patient.countDocuments({
      status: { $in: ["active", "deleted"] },
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      patients,
      patientsCounts: formattedCounts,
      totalPatients,
      lastMonthPatients,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. get patient by ID
export const getPatientByHospitalNumber = async (req, res) => {
  try {
    const { hospitalNumber } = req.params;

    if (!hospitalNumber) {
      return res.status(400).json({
        success: false,
        message: "Hospital number is required",
      });
    }

    const patient = await Patient.findOne({
      hospitalNumber: hospitalNumber.trim(),
      status: "active",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `No active patient found with hospital number ${hospitalNumber}`,
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update a user
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updates = {};

    // Only update fields that were actually sent
    const allowedFields = [
      "fullname",
      "username",
      "phoneNumber",
      "avatar",
      "isDeleted",
      "isAdmin",
      "status",
    ];

    for (const field of allowedFields) {
      if (
        req.body[field] !== undefined &&
        String(req.body[field]) !== String(existingUser[field] ?? "")
      ) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes detected",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        // runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};
