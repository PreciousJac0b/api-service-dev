import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { v4 as uuidv4 } from 'uuid';
import { sendverificationMail } from './verificationMail.js';


async function generateUser(req, res, body, fromAdmin) {
  const { username, email, password, role } = body;
  // if ((req.user.role === "admin" || "buyer" && role === "admin" || "superadmin") || role === "superadmin") {
  //   res.status(400);
  //   throw new Error("User not authorized to create users");
  // }
  let user = await User.findOne({ email: email });
  if (user) {
      res.status(400);
      throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const uniqueString = uuidv4() + req.id;
  const hashedUniqueString = await bcrypt.hash(uniqueString, salt);

  user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || 'buyer',
    isVerified: false,
    verificationToken: hashedUniqueString,
    tokenExpires: Date.now() + 3600000,
  });

  const createdUser = await user.save();
  
  // const link = `${process.env.BASE_URL}/api/auth/verify?token=${hashedUniqueString}`;
  // let message = `<h1>Email Verification</h1><p>Click the link to verify:</p><a href="${link}">${link}</a>`;
  // if (fromAdmin) {
  //   message = `<h1>You were created by a superadmin and assigned the admin role!</h1><p>Click the link to verify:</p><a href="${link}">${link}</a><p></p><p>Only accept if you made this request. Ignore if you think we made a mistake.</p>`;
  // }

  const verificationContent = {
    email, 
    hashedUniqueString,
    fromAdmin
  }

  // const mailContent = {
  //   mail: email,
  //   subject: "Verify Email Address",
  //   html: message,
  // }
  // await sendMailService(req, res, mailContent);
  await sendverificationMail(req, res, verificationContent);
  return createdUser;
}

export default generateUser; 