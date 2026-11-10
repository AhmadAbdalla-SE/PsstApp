import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadException } from "../../exceptions/error.exception.js";
import { EmailSubjectEnum } from "../../enum/email.enum.js";

export const UserEmailKey = ({email, subject})=>{
    return `User::${email}::${subject}::OTP`
}
export const UserEmailTrialsKey = ({email, subject})=>{
    return `${UserEmailKey({email, subject})}::Trials`
}
export const UserEmailKeyLogin = ({email})=>{
    return `User::${email}::Attempts::Login`
}


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments=[],
}) => {
  try {
    if (!to?.length && !cc?.length && !bcc?.length) {
        throw BadException("Missing email recipients")
    }
    if (!html?.length && !text?.length && !attachments?.length){
        throw BadException("Missing email content")
    }
    const info = await transporter.sendMail({
      from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, // sender address
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
