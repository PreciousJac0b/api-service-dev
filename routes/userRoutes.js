import express from "express";
import { authorizedRoles, protect } from "../middleware/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  createUser,
  createAdminUser,
  getUsers,
  deleteUsers,
} from "../controllers/userController.js";
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
 *         role:
 *           type: string
 *           description: Role of the user
 *           enum:
 *            - admin
 *            - seller
 *            - buyer
 *           example: admin
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
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's chosen username
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *           example: password123
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - XAuthToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *           example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *   delete:
 *     summary: Delete a user by ID or delete all users
 *     tags: [Users]
 *     security:
 *       - XAuthToken: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: query
 *         name: isverified
 *         schema:
 *           type: string
 *           example: true
 *         description: The criteria for many deletion from database. Criteria here is the isVerified property.
 *       - in: query
 *         name: all
 *         schema:
 *           type: string
 *         description: Type true if you want to delete all, false otherwise
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User removed
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(protect, authorizedRoles("admin", "superadmin"), getUsers)
  .delete(protect, authorizedRoles("admin", "superadmin"), deleteUsers)

  
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
 *       - in: query
 *         name: id
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

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - XAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUser'
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.route("/create").post(protect, authorizedRoles('admin', "superadmin"), createUser);


/**
 * @swagger
 * /api/users/createadmin:
 *   post:
 *     summary: Create admin users
 *     tags: [Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUser'
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.route("/createadmin").post(protect, authorizedRoles('superadmin'), createAdminUser);


export default router;
