import express from "express";
import protect from "../middleware/auth.js";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { validateProfileUpdate } from "../validators/userValidator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *           example: 60d0fe4f5311236168a109ca
 *         username:
 *           type: string
 *           description: User's username
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last profile update
 *     UserProfileUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: New username (optional)
 *           example: john_doe_updated
 *         email:
 *           type: string
 *           format: email
 *           description: New email address (optional)
 *           example: john.doe.updated@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: New password (optional, min 6 characters)
 *           example: newpassword123
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom authentication token
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid input data (validation error)
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdate, updateUserProfile); 


export default router;