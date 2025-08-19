import "server-only";

import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
});

const cesTransporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export const sendEmail = async (
  email: string,
  name: string,
  description: string,
) => {
  try {
    const test = await cesTransporter.verify();

    if (test) {
      // Setup email data
      const mailOptions = {
        from: "Access Sentry <admin@apegpt.ai>", // Sender address
        replyTo: `"${name}" <${email}>`, // Reply-to address
        to: process.env.REQUEST_ACCESS_EMAIL, // List of receivers
        subject: `ApeGPT access request from ${name}`, // Subject line
        text: description, // Plain text body
        html: `
      <p>${description}</p>
      <p></p>
      <p></p>
      <p>${name}</p>
      <p>${email}</p>
      `,
      };

      console.log("Sending email");
      // Send mail with defined transport object
      try {
        const res = await cesTransporter.sendMail(mailOptions);
        console.log("res", res);
        if (!res?.messageId) {
          console.log(`Error occurred`);
          return false;
        }
        console.log("Message sent: %s", res.messageId);
        return true;
      } catch (err) {
        console.error("Error sending email", err);
        return false;
      }
    } else {
      console.error("Error verifying transporter");
      return false;
    }
  } catch (err) {
    console.error("Error verifying transporter", err);
    return false;
  }
};
