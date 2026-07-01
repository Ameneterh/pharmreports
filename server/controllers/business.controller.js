import Business from "../models/business.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendHandlerActivationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendTemporaryHandlerCredentials,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// create new business
export const addBusiness = async (req, res) => {
  const {
    business_name,
    business_email,
    business_password,
    business_phone,
    business_address,
    banker,
    account_name,
    account_number,
  } = req.body;

  try {
    // check content from req.body
    if (
      !business_name ||
      !business_email ||
      !business_password ||
      !business_phone ||
      !business_address
    ) {
      throw new Error("All fields are required!");
    }

    // check if user already exists
    const businessAlreadyExists = await Business.findOne({ business_email });
    if (businessAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Business Already Exists!" });
    }

    // hash password and generate verification token
    const hashedPassword = bcryptjs.hashSync(business_password, 10);

    // generate verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // save new business
    const business = new Business({
      business_name,
      business_email,
      business_password: hashedPassword,
      business_phone,
      business_address,
      banker,
      account_name,
      account_number,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await business.save();

    await sendVerificationEmail(business.business_email, verificationToken);

    res.status(201).json({
      success: true,
      message: "New Business Added Successfully",
      business: { ...business._doc, business_password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// update a user
export const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    const existingBusiness =
      await Business.findById(businessId).populate("owner");

    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const updates = {};

    // Only update fields that were actually sent
    const allowedFields = [
      "business_name",
      "business_email",
      "business_phone",
      "business_address",
      "banker",
      "account_name",
      "account_number",
      "website",
      "status",
      "plan",
    ];

    for (const field of allowedFields) {
      if (
        req.body[field] !== undefined &&
        String(req.body[field]) !== String(existingBusiness[field] ?? "")
      ) {
        updates[field] = req.body[field];
      }
    }

    // Avatar plan restriction
    // if (updates.avatar) {
    //   const business = existingUser.business;

    //   if (business?.plan?.toLowerCase() === "trial") {
    //     return res.status(403).json({
    //       success: false,
    //       message:
    //         "Avatar updates are available only on Basic and Premium plans. Upgrade your subscription to update avatar.",
    //     });
    //   }
    // }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes detected",
      });
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $set: updates },
      {
        new: true,
        // runValidators: true,
      },
    ).populate("owner");

    return res.status(200).json({
      success: true,
      message: "Business updated successfully",
      user: updatedBusiness,
    });
  } catch (error) {
    console.error("Update Business Error:", error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to update business",
    });
  }
};

// get all registered businesses
export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate("owner");

    const totalBusinesses = await Business.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const lastMonthBusinesses = await Business.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(201).json({
      success: true,
      message: "Businesses fetched successfully",
      businesses,
      totalBusinesses,
      lastMonthBusinesses,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
