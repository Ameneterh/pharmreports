import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendHandlerActivationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendTemporaryHandlerCredentials,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { log } from "console";

// add new user
export const confirmSubscription = async (req, res) => {
  console.log("controller reached");
  console.log(req.user.business);

  //   const { plan, status } = req.body;

  try {
    const businessId = req.user.business;

    const startDate = new Date();

    const expiryDate = new Date();

    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // await Business.findByIdAndUpdate(businessId, {
    //   "subscription.plan": plan,
    //   "subscription.status": status,
    //   "subscription.startedAt": startDate,
    //   "subscription.expiresAt": expiryDate,
    // });

    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "New Business and Owner Created Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
