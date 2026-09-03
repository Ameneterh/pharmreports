import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  sendUpdate,
  getUpdates,
  markUpdateRead,
  markAllRead,
} from "../controllers/update.controller.js";

const router = express.Router();

router.post("/send-update", verifyToken, sendUpdate);
router.get("/get-updates", verifyToken, getUpdates);
router.put("/read/:id", verifyToken, markUpdateRead);
router.put("/read-all", verifyToken, markAllRead);

export default router;
