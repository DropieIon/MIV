import nodemailer from "nodemailer";
// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: "officialmiv@outlook.com",
      pass: process.env.email_pass,
    },
  });
