import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import axios from 'axios';
import mongoose from 'mongoose';

const exchangeRateCache = {
  rates: {},
  timestamp: null,
};
const CACHE_DURATION = 60 * 60 * 1000;

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category } = req.body;

  const product = new Product({
    name,
    price,
    description,
    category,
    createdBy: req.user.id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate(
    "createdBy",
    "username email"
  );
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Product ID format");
  }
  const product = await Product.findById(req.params.id).populate(
    "createdBy",
    "username email"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Product ID format");
  }
  const { name, price, description, category } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Checks if user is the creator of product
  if (product.createdBy.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this product");
  }

  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.category = category || product.category;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Product ID format");
  }
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Checks if user is the creator of product
  if (product.createdBy.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this product");
  }

  await product.deleteOne(); // Use deleteOne() in Mongoose 6+
  res.json({ message: "Product removed" });
});

const getExchangeRates = async () => {
  const now = Date.now();
  if (
    exchangeRateCache.timestamp &&
    now - exchangeRateCache.timestamp < CACHE_DURATION
  ) {
    console.log("Using cached exchange rates");
    return exchangeRateCache.rates;
  }

  try {
    console.log("Fetching fresh exchange rates");
    const apiKey = process.env.CURRENCY_API_KEY;
    if (!apiKey) {
      console.error("Exchange Rate API Key not found in .env");
      return {};
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`
    );

    if (response.data && response.data.result === "success") {
      exchangeRateCache.rates = response.data.conversion_rates;
      exchangeRateCache.timestamp = now;
      return exchangeRateCache.rates;
    } else {
      console.error("Failed to fetch exchange rates:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error.message);
    return exchangeRateCache.rates || {};
  }
};

const getProductPriceInCurrency = asyncHandler(async (req, res) => {
  const { id, currency } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Product ID format");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const rates = await getExchangeRates();
  console.log(rates);
  const targetCurrency = currency.toUpperCase();

  const exchangeRate = rates[targetCurrency];

  if (!exchangeRate) {
    res.status(400);
    throw new Error(
      `Currency code '${targetCurrency}' not supported or invalid`
    );
  }

  const convertedPrice = (product.price * exchangeRate).toFixed(2);

  res.json({
    productName: product.name,
    basePrice: product.price,
    baseCurrency: "NGN",
    targetCurrency,
    exchangeRate,
    convertedPrice: parseFloat(convertedPrice),
  });
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductPriceInCurrency,
};
