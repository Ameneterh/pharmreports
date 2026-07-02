import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendHandlerActivationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendTemporaryHandlerCredentials,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// add new user
export const addUser = async (req, res) => {
  const { fullname, username, phoneNumber, password, role } = req.body;

  try {
    // check content from req.body
    if (!fullname || !username || !phoneNumber || !password || !role) {
      throw new Error("All fields are required!");
    }

    // check if user already exists
    const userAlreadyExists = await User.findOne({ username }).collation({
      locale: "en",
      strength: 2,
    });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // hash password and generate verification token
    const hashedPassword = await bcryptjs.hash(password, 10);

    // save new user
    const user = await User.create({
      fullname,
      username,
      usernameLower: username.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await user.save();

    // generate cookie with jwt
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "New User Created Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });
    }

    throw error;
    // res.status(400).json({ success: false, message: error.message });
  }
};

// add handler
export const addNewUser = async (req, res) => {
  const { fullname, username, phoneNumber, role, rank, createdBy } = req.body;

  try {
    // check content from req.body
    if (!fullname || !username || !phoneNumber || !role || !rank) {
      throw new Error("All fields are required!");
    }

    // check if user already exists
    const userAlreadyExists = await User.findOne({ username }).collation({
      locale: "en",
      strength: 2,
    });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // generate temporary password
    const tempPassword = "Today12345";

    // hash password and generate verification token
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);

    // save new user
    const user = await User.create({
      fullname,
      username,
      usernameLower: username.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      role,
      rank,
      createdBy,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "New User Added Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });
    }

    throw error;
    // res.status(400).json({ success: false, message: error.message });
  }
};

// update a user
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updates = {};

    // Only update fields that were actually sent
    const allowedFields = [
      "fullname",
      "username",
      "phoneNumber",
      "avatar",
      "isDeleted",
      "isAdmin",
      "status",
    ];

    for (const field of allowedFields) {
      if (
        req.body[field] !== undefined &&
        String(req.body[field]) !== String(existingUser[field] ?? "")
      ) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes detected",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        // runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// update user password
export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, password } = req.body;

    // check user exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if old password supplied matches password on record
    const isValidPassword = bcryptjs.compareSync(
      oldPassword,
      existingUser.password,
    );

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const isSamePassword = bcryptjs.compareSync(
      password,
      existingUser.password,
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const updates = {
      password: hashedPassword,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "User password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Password Error:", error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to update user password",
    });
  }
};

// user login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      usernameLower: username.toLowerCase(),
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Credentials!" });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Credentials!!",
      });
    }

    if (user.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Your account is no longer active. Contact the Dept Office",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error in login", error);
    console.log("Backend message:", error.response?.data);
    res.status(400).json({ success: false, message: error.message });
  }
};

// user logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User Logged Out Successfully" });
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User "${username}" does not exist`,
      });
    }

    // update password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// check authentication
export const CheckAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

// general users actions
// 1. get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["pharmacist", "pharmtech", "staff"] },
    }).populate("createdBy");

    const userCounts = await User.aggregate([
      {
        $match: {
          role: { $in: ["pharmacist", "pharmtech", "staff"] },
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedCounts = userCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalUsers = await User.countDocuments({
      role: { $in: ["pharmacist", "pharmtech", "staff"] },
    });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthUsers = await User.countDocuments({
      role: { $in: ["pharmacist", "pharmtech", "staff"] },
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      userCounts: formattedCounts,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
