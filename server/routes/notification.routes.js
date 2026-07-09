import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  sendNotification,
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/send-notification", verifyToken, sendNotification);
router.get("/get-notifications", verifyToken, getNotifications);
router.put("/read/:id", verifyToken, markNotificationRead);
router.put("/read-all", verifyToken, markAllRead);

export default router;
