import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorize } from "../middlewares/authorize.js";
import {
  addPatient,
  getPatientByHospitalNumber,
  getPatients,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post(
  "/add-patient",
  verifyToken,
  authorize("patient:create"),
  addPatient,
);
router.get(
  "/get-patients",
  verifyToken,
  authorize("patient:view"),
  getPatients,
);
router.get(
  "/get-patient/:hospitalNumber",
  verifyToken,
  authorize("patient:view"),
  getPatientByHospitalNumber,
);
// router.put("/send-comment", authorize("comments:view"), sendComment);

export default router;
