import dotenv from "dotenv";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  HANDLER_VERIFICATION_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  TEMPORARY_HANDLER_CREDENTIALS,
} from "./emailTemplates.js";
import transporter from "../services/email.service.js";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",

      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(`Error sending verification`, error);
    throw new Error(`Error sending Verification Email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, fullname) => {
  try {
    // const response = await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   template_uuid: "977525a2-4a2a-4905-b5ba-0e5ff179353c",
    //   template_variables: {
    //     company_info_name: "Invoicer App",
    //     name: name,
    //   },
    // });
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Schinase InvoiceCore",

      html: WELCOME_EMAIL_TEMPLATE.replace("{fullname}", fullname),
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

// export const sendHandlerActivatedEmail = async (email, name) => {
//   const recipient = [{ email }];

//   try {
//     const response = await mailtrapClient.send({
//       from: sender,
//       to: recipient,
//       template_uuid: "4e0a7e54-6453-4a4d-bae3-e5148ddf6501",
//       template_variables: {
//         company_info_name: "Invoicer App",
//         name: name,
//       },
//     });
//     console.log("User Activated", response);
//   } catch (error) {
//     console.log("Error sending handler activation email", error);
//     throw new Error(`Error sending handler activation email: ${error}`);
//   }
// };

export const sendHandlerActivationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Handler Activation on Schinase InvoiceCore",

      html: HANDLER_VERIFICATION_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(`Error sending verification`, error);
    throw new Error(`Error sending Verification Email: ${error}`);
  }
};

export const sendTemporaryHandlerCredentials = async ({
  email,
  password,
  fullname,
  business_name,
  owner,
}) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Schinase InvoiceCore",

      html: TEMPORARY_HANDLER_CREDENTIALS.replace(
        "{temporaryPassword}",
        password,
      )
        .replace("{fullname}", fullname)
        .replace("{business_name}", business_name)
        .replace("{owner}", owner),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(`Error sending verification`, error);
    throw new Error(`Error sending Verification Email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",

      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
