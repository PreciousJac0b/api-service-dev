import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import generateUser from "../utils/createUser.js";
import { getUsersService, deleteUsersService } from "../services/usersService.js";
import bcrypt from 'bcrypt';

const createUser = asyncHandler(async (req, res) => {
  const createdUser = await generateUser(req, res, req.body, false);
  res.status(201).json(createdUser);
});

const createAdminUser = asyncHandler(async (req, res) => {
  const createdUser = await generateUser(req, res, req.body, true);
  createdUser.role = "admin";
  await createdUser.save();
  res.status(201).json(createdUser);
});

const getUsers = asyncHandler(async (req, res) => {
  const { users, total } = await getUsersService(req, res);

  res.json({ total, data: users })
})

const deleteUsers = asyncHandler(async (req, res) => {
  return deleteUsersService(req, res);
})

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.currency = req.body.currency || user.currency;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    if (req.body.password) {
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
        currency: updatedUser.currency,
      });
    } else {
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        currency: updatedUser.currency,
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  getUserProfile,
  updateUserProfile,
  createUser,
  getUsers,
  deleteUsers,
  createAdminUser,
};
