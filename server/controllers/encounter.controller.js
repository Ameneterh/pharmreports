import mongoose from "mongoose";
import Encounter from "../models/Encounter.js";
import Patient from "../models/Patient.js";
import Consultant from "../models/Consultant.js";

export const addEncounter = async (req, res) => {
  try {
    const {
      patient,
      encounterType,
      encounterDate,
      admissionDate,
      dischargeDate,
      hospital,
      ward,
      bed,
      consultant,
      height,
      heightUnit,
      weight,
      weightUnit,
      presentingComplaints,
      complaintDuration,
      familyHistoryNotes,
      socialHistoryNotes,
      pastMedicalHistoryNotes,
      complianceHistory,
      medicationAllergyNotes,
      herbalMedicineNotes,
      currentMedicationComplaints,
      objectiveNotes,
      assessmentSummary,
      status,
    } = req.body;

    // 1. Validate required fields
    if (!patient || !mongoose.isValidObjectId(patient)) {
      return res.status(400).json({
        success: false,
        message: "A valid patient ID is required.",
      });
    }

    if (!encounterType) {
      return res.status(400).json({
        success: false,
        message: "Encounter type is required.",
      });
    }

    // 2. Confirm that the patient exists
    const existingPatient = await Patient.findById(patient);

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // 3. Confirm that the authenticated user is available
    // The authentication middleware must populate req.user.
    const pharmacistId = req.user?._id || req.user?.id;

    if (!pharmacistId || !mongoose.isValidObjectId(pharmacistId)) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    // 4. Validate optional consultant reference
    if (consultant?.user) {
      if (!mongoose.isValidObjectId(consultant.user)) {
        return res.status(400).json({
          success: false,
          message: "Invalid consultant ID.",
        });
      }

      const existingConsultant = await Consultant.findById(consultant.user);

      if (!existingConsultant) {
        return res.status(404).json({
          success: false,
          message: "Consultant not found.",
        });
      }
    }

    // 5. Validate measurements
    if (height !== undefined && (!Number.isFinite(height) || height <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Height must be a positive number.",
      });
    }

    if (weight !== undefined && (!Number.isFinite(weight) || weight <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Weight must be a positive number.",
      });
    }

    // 6. Validate dates and their order
    const validDate = (value) =>
      value == null ||
      value === "" ||
      (!Number.isNaN(new Date(value).getTime()) &&
        new Date(value).getFullYear() >= 1900);

    if (
      !validDate(encounterDate) ||
      !validDate(admissionDate) ||
      !validDate(dischargeDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more dates are invalid.",
      });
    }

    if (
      admissionDate &&
      dischargeDate &&
      new Date(dischargeDate) < new Date(admissionDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discharge date cannot precede admission date.",
      });
    }

    // 7. Build the document using permitted fields only.
    // Do not accept pharmacist, createdBy, or updatedBy
    // directly from the request body.
    const encounter = await Encounter.create({
      patient,
      encounterType,
      encounterDate: encounterDate || new Date(),

      admissionDate: admissionDate || undefined,
      dischargeDate: dischargeDate || undefined,

      hospital,
      ward,
      bed,

      consultant: {
        name: consultant?.name,
        specialty: consultant?.specialty,
        user: consultant?.user || undefined,
      },

      height,
      heightUnit: heightUnit || "cm",
      weight,
      weightUnit: weightUnit || "kg",

      presentingComplaints,
      complaintDuration,
      familyHistoryNotes,
      socialHistoryNotes,
      pastMedicalHistoryNotes,
      complianceHistory,
      medicationAllergyNotes,
      herbalMedicineNotes,
      currentMedicationComplaints,

      objectiveNotes,
      assessmentSummary,

      status: status || "open",

      pharmacist: pharmacistId,
      createdBy: pharmacistId,
    });

    // 8. Return the saved document
    return res.status(201).json({
      success: true,
      message: "Encounter saved successfully.",
      encounter,
    });
  } catch (error) {
    console.error("Save encounter error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Encounter validation failed.",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "One or more IDs or values are invalid.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while saving the encounter.",
    });
  }
};

// Get all encounters belonging to a patient
export const getPatientEncounters = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID.",
      });
    }

    const patientExists = await Patient.exists({
      _id: patientId,
    });

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Add your tenant/clinic access-control filter here
    // before exposing patient clinical records.
    const encounters = await Encounter.find({
      patient: patientId,
    })
      .populate("patient")
      .populate("pharmacist", "name email")
      .populate("consultant.user")
      .sort({ encounterDate: -1 });

    return res.status(200).json({
      success: true,
      count: encounters.length,
      encounters,
    });
  } catch (error) {
    console.error("Fetch encounters error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patient encounters.",
    });
  }
};
