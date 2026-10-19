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
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.post(
  "/send-report",
  verifyToken,
  authorize("reports:create"),
  sendReport,
);
router.put("/send-comment", authorize("comments:view"), sendComment);
router.get("/get-reports", verifyToken, authorize("reports:view"), getReports);
router.get("/report-fields", getReportFieldsSummary);
// router.get("/generate-report", getWeeklySummary);
router.get("/summary", getWeeklySummary);

export default router;
