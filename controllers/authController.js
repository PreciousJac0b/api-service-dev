import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import Joi from 'joi';
import User from "../models/User.js";
import _ from 'lodash';
import generateToken from "../utils/generateToken.js";
import generateUser from "../utils/createUser.js";

const registerUser = asyncHandler(async (req, res) => {
  // const {username, email, password} = req.body;

  // let user = await User.findOne({ email: email });

  // if (user) {
  //   res.status(400);
  //   throw new Error("User already exists");
  // }
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // user = new User({ username, email, password: hashedPassword, role: req.body.role || "buyer" });
  // await user.save()

  let user = await generateUser(req.body);

  const token = generateToken(user._id, user.role); // JWT token to access protected routes.

  res.header('x-auth-token', token).status(201).send(_.pick(user, ["_id", "username", "email"]));
});


const loginUser = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400);
    throw new Error("Validation error");
  }
  // console.log("Request: ", req.body)

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // console.log("User: ", user)

  const passwordMatched = await user.matchPassword(password);
  if (user && (passwordMatched)) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, user.role),
    })
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }


})

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
}

export { registerUser, loginUser };