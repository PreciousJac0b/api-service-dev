import express from "express";
import protect from "../middleware/auth.js";
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

router
  .route("/")
  .post(protect, validateProduct, createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, validateProduct, updateProduct)
  .delete(protect, deleteProduct);

router
  .route("/:id/price-in/:currency")
  .get(validateCurrencyParams, getProductPriceInCurrency);

export default router;
