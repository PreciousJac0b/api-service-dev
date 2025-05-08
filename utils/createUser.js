import bcrypt from 'bcrypt';
import User from "../models/User.js";


async function generateUser(body) {
  const { username, email, password, role } = body;
  let user = await User.findOne({ email: email });
  if (user) {
      res.status(400);
      throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || 'buyer',
  });

  const createdUser = await user.save();
  return createdUser;
}

export default generateUser; 