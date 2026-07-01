import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { confirmSubscription } from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/confirm-subscription", confirmSubscription);

export default router;
