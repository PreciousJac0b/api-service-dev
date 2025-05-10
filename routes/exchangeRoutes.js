import express from 'express';
import getHistory from '../controllers/exchangeController.js'
import { protect } from '../middleware/auth.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: History
 *   description: User profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConversionLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Conversion ID
 *           example: 60d0fe4f5311236168a109ca
 *         userId:
 *           type: string
 *           description: User converting the currency ID
 *           example: 68162cd05a486ef5v3a6146f
 *         productId:
 *           type: string
 *           description: The product whose currency was converted ID
 *           example: 681654244369b02765df3097
 *         currency:
 *           type: string
 *           description: Currency to be converted to
 *           enum:
 *            - EUR
 *            - USD
 *            - GBP
 *           example: EUR
 *         convertedPrice:
 *           type: integer
 *           description: Price of product
 *           example: 160000
 *         exchangeRate:
 *           type: integer
 *           description: Rate from base currency to currency specified
 *           example: 160000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when conversion was made.
 */

/**
 * @swagger
 * /api/exchange/history/:
 *   get:
 *     summary: Get product price converted to a specific currency
 *     tags: [History]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 3
 *         description: Specifies the page number
 *       - name: limit
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 10
 *         description: Specifies the number of conversions to be displayed per page.
 *     responses:
 *       200:
 *           description: Successfully retrieved history
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversionLog'
 *       400:
 *         description: Invalid currency code or validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error or currency conversion service error
 */
router.route("/history").get(getHistory);

export default router;