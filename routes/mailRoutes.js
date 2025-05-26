import express from 'express';
import { sendMail } from '../controllers/mailController.js';

const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Mailing Route
//  *   description: Need to send mails? Got ya!
//  */

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Mail:
//  *       type: object
//  *       required:
//  *         - mail
//  *         - subject
//  *         - text
//  *       properties:
//  *         subject:
//  *           type: string
//  *           description: Title of the mail
//  *           example: OFFER OF EMPLOYMENT
//  *         mail:
//  *           type: string
//  *           format: email
//  *           description: Recipient's email address
//  *           example: john.doe@example.com
//  *         text:
//  *           type: string
//  *           description: Text to be sent within mail body.
//  *           example: You are officially hired.
//  */


// /**
//  * @swagger
//  * /api/sendmail:
//  *   post:
//  *     summary: Authenticate user and get token
//  *     security: []
//  *     tags: [Mailing Route]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Mail'
//  *     responses:
//  *       200:
//  *         description: Feedback after successfully sending mail
//  *         content:
//  *           tetx/plain:
//  *             schema:
//  *               type: string
//  *               example: Mail successfully sent
//  *       401:
//  *         description: Invalid inputs
//  *       400:
//  *         description: Validation error
//  *       500:
//  *         description: Server error
//  */
router
.route("/")
.post(sendMail);

export default router;