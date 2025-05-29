import asyncHandler from "express-async-handler";
import { loginUserService, registerUserService } from "../services/authService.js";
import User from "../models/User.js";
import { HttpStatusCode } from "axios";

const registerUser = asyncHandler(async (req, res) => {

  const { user } = await registerUserService(req, res, req.body);

  res.status(HttpStatusCode.Created).json({
    message: "Registration successful. Verification email sent."
    // user: {
    //   _id: user._id,
    //   username: user.username,
    //   email: user.email,
    // }
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
  const { token } = req.query;
  const { email } = req.body;

  let user;

  if (token) {
    user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    await markUserVerified(user);
    return res.redirect('/api/auth/login?message=Email+verified+successfully');
  }

  if (email) {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `User with email ${email} not found` });
    }

    await markUserVerified(user);
    return res.status(200).json({
      success: true,
      message: `Successfully verified user with email ${email}`,
    });
  };

  return res.status(400).json({ message: "Please provide either a token or an email" });
});

async function markUserVerified(user) {
  user.isVerified = true;
  user.verificationToken = undefined;
  user.tokenExpires = undefined;
  await user.save();
}

export { registerUser, loginUser, verifyUser, getLogin };