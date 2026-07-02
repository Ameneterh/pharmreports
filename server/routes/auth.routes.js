import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  login,
  logout,
  resetPassword,
  CheckAuth,
  addNewUser,
  getUsers,
  addUser,
  updateUser,
  updatePassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, CheckAuth);
router.post("/add-user", addUser);
router.post("/user-login", login);

router.post("/add-new-user", addNewUser);
router.put("/update-user/:userId", verifyToken, updateUser);
router.put("/update-password/:userId", verifyToken, updatePassword);

router.post("/logout", logout);

router.get("/get-users", getUsers);

router.post("/reset-password", resetPassword);

export default router;
