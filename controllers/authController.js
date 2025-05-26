import asyncHandler from "express-async-handler";
import { loginUserService, registerUserService } from "../services/authService.js";
import User from "../models/User.js";
import { HttpStatusCode } from "axios";

const registerUser = asyncHandler(async (req, res) => {

  const { user } = await registerUserService(req, res, req.body);

  res.status(HttpStatusCode.Created).json({
    message: "Registration successful. Verification email sent.",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    }
  });
});


const loginUser = asyncHandler(async (req, res) => {
  const { _id, username, email, token } = await loginUserService(req, res, req.body);

  res.json({
    message: "Login Successful",
    user: {
      _id,
      username,
      email,
      token,
    }
  });
})

const getLogin = asyncHandler(async (req, res) => {
  res.send("Go ahead and log in")
})


const verifyUser = asyncHandler(async (req, res) => {
  let { token } = req.query;

  const user = await User.findOne({ verificationToken: token, tokenExpires: { $gt: Date.now() } });

  if (!user) {
    res.status(400).send("Invalid or expired token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.tokenExpires = undefined;


  await user.save();

  res.redirect('/api/auth/login?message=Email+verified+successfully');
});

export { registerUser, loginUser, verifyUser, getLogin };