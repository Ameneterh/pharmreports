// import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// export const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
