import express from "express";
import  { protect, authorizedRoles } from "../middleware/auth.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductPriceInCurrency,
} from "../controllers/productController.js";
import { validateProduct, validateCurrencyParams } from "../validators/productValidation.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *           example: 60d0fe4f5311236168a109cb
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: Laptop Pro
 *         description:
 *           type: string
 *           description: Description of the product
 *           example: High-performance laptop for professionals
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product in USD
 *           example: 1299.99
 *         category:
 *           type: string
 *           description: Category of the product
 *           example: Electronics
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of product creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last product update
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: Laptop Pro
 *         description:
 *           type: string
 *           description: Description of the product
 *           example: High-performance laptop for professionals
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product in USD
 *           example: 1299.99
 *         category:
 *           type: string
 *           description: Category of the product
 *           example: Electronics
 *     ProductPriceInCurrency:
 *        type: object
 *        properties:
 *          originalPriceUSD:
 *            type: number
 *            format: float
 *            description: Original price in USD
 *            example: 1299.99
 *          currency:
 *            type: string
 *            description: Target currency code
 *            example: EUR
 *          convertedPrice:
 *            type: number
 *            format: float
 *            description: Price converted to the target currency
 *            example: 1105.50
 *          exchangeRate:
 *             type: number
 *             format: float
 *             description: Exchange rate used for conversion (USD to Target Currency)
 *             example: 0.85
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCIXhwIjoxNzQ5NDczMDgwfQ.wsfdeUp9bQ8PQ5YFZkAkqBMxSkjTGem9RHRP41ia1Ow"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       500:
 *         description: Server error
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Products]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Specifies the page number
 *       - name: limit
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 10
 *         description: Specifies the number of conversions to be displayed per page.
 *       - name: priceMin
 *         in: query
 *         schema:
 *           type: integer
 *           example: 100
 *         description: Minimum price of product to be retrieved
 *       - name: priceMax
 *         in: query
 *         schema:
 *           type: integer
 *           example: 200000
 *         description: Maximum price of product to be retrieved
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *           example: TV appliances
 *         description: Maximum price of product to be retrieved
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *           example: Search Anything
 *         description: Keyword search in name and description
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum:
 *            - price
 *            - name
 *           example: price
 *         description: Keyword search in name and description
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .post(protect, authorizedRoles('admin', 'seller'), validateProduct, createProduct)
  .get(getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product removed
 *       401:
 *         description: Unauthorized - No token provided or token is invalid
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */  
router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorizedRoles('admin', 'superadmin', 'seller'), validateProduct, updateProduct)
  .delete(protect, authorizedRoles('admin', 'seller'), deleteProduct);

/**
 * @swagger
 * /api/products/{id}/price-in/{currency}:
 *   get:
 *     summary: Get product price converted to a specific currency
 *     tags: [Products]
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCIXhwIjoxNzQ5NDczMDgwfQ.wsfdeUp9bQ8PQ5YFZkAkqBMxSkjTGem9RHRP41ia1Ow"
 *         description: Custom authentication token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *           example: EUR
 *         description: The target currency code (e.g., EUR, GBP)
 *     responses:
 *       200:
 *         description: Converted product price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPriceInCurrency'
 *       400:
 *         description: Invalid currency code or validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error or currency conversion service error
 */
router
  .route("/:id/price-in/:currency")
  .get(protect, getProductPriceInCurrency);

export default router;
