import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendMailService } from '../services/mailService.js';

async function sendverificationMail(req, res, verificationContent) {
  // const uniqueString = uuidv4() + req.id;
  // const hashedUniqueString = await bcrypt.hash(uniqueString, salt);

  const link = `${process.env.BASE_URL}/api/auth/verify?token=${verificationContent.hashedUniqueString}`;
  let message = `<h1>Email Verification</h1><p>Click the link to verify:</p><a href="${link}">${link}</a>`;
  if (verificationContent.fromAdmin) {
    message = `<h1>You were created by a superadmin and assigned the admin role!</h1><p>Click the link to verify:</p><a href="${link}">${link}</a><p></p><p>Only accept if you made this request. Ignore if you think we made a mistake.</p>`;
  }

  const mailContent = {
    mail: verificationContent.email,
    subject: "Verify Email Address",
    html: message,
  }
  await sendMailService(req, res, mailContent);
}

export { sendverificationMail };