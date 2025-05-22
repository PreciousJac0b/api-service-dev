import asyncHandler from "express-async-handler";
import { loginUserService, registerUserService } from "../services/authService.js";
import { sendVerificationMail } from "../services/authService.js";
import User from "../models/User.js";

const registerUser = asyncHandler(async (req, res) => {

  const {token, user} = await registerUserService(req, res, req.body);

  const mailContent = {
    name: req.body.username,
    email: req.body.email
  }
  
  await sendVerificationMail(req, res, mailContent);

  res.header('x-auth-token', token).status(201).send(user);
});


const loginUser = asyncHandler(async (req, res) => {
  const data = await loginUserService(req, res, req.body);

  res.json(data);
})


const verifyUser = asyncHandler(async (req, res) => {
  let { token } = req.query;

  console.log("Token: token")

  const user =  await User.findOne({ verificationToken: token, tokenExpires: { $gt: Date.now() } });
  console.log("User: ", user)

  if (!user) {
    res.status(400).send("Invalid or expired token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.tokenExpires = undefined;


  await user.save();
  

  res.send("Email successfully verified!");
  // if (verification.length <= 0) {
  //   const message = "An error occurred while checking for existing user verification method";
  //   res.redirect(`/api/auth/verified/error=true&message=${message}`);
  // }
});

export { registerUser, loginUser, verifyUser };