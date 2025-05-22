import User from "../models/User.js";
import {UserVerification} from "../models/UserVerification.js";
import generateToken from "../utils/generateToken.js";
import generateUser from "../utils/createUser.js";
import { validateLogin } from "../validators/userValidator.js";
import _ from 'lodash';
import { sendMailService } from "./mailService.js";
import { v4 as uuidv4 } from 'uuid';


async function loginUserService(req, res, body) {
  const { error } = validateLogin(body);
  if (error) {
    res.status(400);
    throw new Error("Validation error");
  }
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const passwordMatched = await user.matchPassword(password);
  if (!passwordMatched) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id, user.role)
  }
}

async function registerUserService(req, res, body) {
  let user = await generateUser(req, res, body, false);

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: _.pick(user, ["_id", "username", "email"])
  };
}


// Not in use
async function sendVerificationMail(req, res, mailParam) {
  const url = "http://localhost:5000/"

  const uniqueString = uuidv4() + req.id;

  const subject = `Greensol Dev: Confirm Email Address!`
  const html = `<p>Hi ${mailParam.name},\nYou have sucessfully registered on the greensol api-dev website\nJust a few more steps to confirm your mail address. This link expires in 6 hours.</p> <p> <a href=${currenturl + "user/verify/" + _id + "/" + uniqueString}></a> to proceed </p>`

  const salt = await bcrypt.genSalt(10);
  const hashedUniqueString = await bcrypt.hash(uniqueString, salt);

  const newVerification = new UserVerification({
    userId: req.id,
    uniqueString: hashedUniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000,
  })

  const createdVerification = await newVerification.save();
  if (!createdVerification) {
    res.json(400);
    throw new Error("Error with verification mail.");
  }
  const mailContent = {
    subject: subject,
    html: html,
    mail: mailParam.email,
  }
  await sendMailService(req, res, mailContent);
}

export { loginUserService, registerUserService, sendVerificationMail };