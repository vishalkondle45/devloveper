import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
interface MailData {
  from?: string;
  to: string;
  subject: string;
  html: string;
}
export const sendMail = (mailData: MailData) => {
  mailData.from = "kondles1@gmail.com";

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "kondles1@gmail.com",
      pass: process.env.EMAIL_CODE,
    },
    secure: true,
  });

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      return NextResponse.json(
        { error: "Unable to send an email!" },
        { status: 500 }
      );
    }
  });
};
