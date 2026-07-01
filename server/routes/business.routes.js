import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  addBusiness,
  updateBusiness,
  getBusinesses,
} from "../controllers/business.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/add-new-business", addBusiness);
router.put("/update-business/:businessId", updateBusiness);
router.get("/get-businesses", getBusinesses);

export default router;
