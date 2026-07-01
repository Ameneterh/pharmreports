import mongoose from "mongoose";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import dotenv from "dotenv";

dotenv.config();

const removeField = async () => {
  // const startDate = new Date();

  // const expiryDate = new Date();

  // expiryDate.setMonth(expiryDate.getMonth() + 1);

  try {
    await mongoose.connect(
      "mongodb+srv://amshpharmacy_db_user:taFX76pbJq7T8tzD@cluster0.neyjvtk.mongodb.net/?appName=AMSHRxReports",
    );

    console.log("Database connected");

    const result = await User.updateMany(
      {},
      {
        $set: {
          isDeleted: false,
        },
      },
    );

    console.log("Updated documents:", result.modifiedCount);

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

removeField();
