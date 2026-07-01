import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  addClient,
  getClients,
  getOneClient,
} from "../controllers/client.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/add-client", addClient);
router.get("/get-clients", getClients);
router.get("/get-client/:clientId", getOneClient);

export default router;
