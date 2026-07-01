import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getMessages,
  readMessage,
  sendMessage,
} from "../controllers/contact.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/get-messages", verifyToken, getMessages);
router.put("/read-message", verifyToken, readMessage);

export default router;
