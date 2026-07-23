import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getReports,
  sendComment,
  sendReport,
  getWeeklySummary,
  getReportFieldsSummary,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/send-report", sendReport);
router.put("/send-comment", sendComment);
router.get("/get-reports", getReports);
router.get("/report-fields", getReportFieldsSummary);
// router.get("/generate-report", getWeeklySummary);
router.get("/summary", getWeeklySummary);

export default router;
