import asyncHandler from 'express-async-handler';
import { sendMailService } from '../services/mailService.js';

const sendMail = asyncHandler(async (req, res) => {
  const { mail, subject, text } = req.body;
  const mailContent = {
    mail,
    subject,
    text,
  }
  return sendMailService(req, res, mailContent);
})


export {sendMail};