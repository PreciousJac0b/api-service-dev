import Joi from "joi";

const handleValidationErrors = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: "Validation Error", errors });
  }
  next();
};

const handleParamValidationErrors = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: "Validation Error", errors });
  }
  next();
};

// Schema for creating/updating a product (body)
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().optional().allow(""), // Allow empty string
  category: Joi.string().min(3).max(50).required(),
});

// Schema for currency conversion parameters (params)
const currencyParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Product ID must be a valid MongoDB ObjectId",
    "string.length": "Product ID must be 24 characters long",
  }),
  currency: Joi.string().length(3).uppercase().required().messages({
    "string.length": "Currency code must be 3 characters long",
    "string.uppercase": "Currency code must be uppercase",
  }),
});

export const validateProduct = handleValidationErrors(productSchema);
export const validateCurrencyParams =
  handleParamValidationErrors(currencyParamsSchema);
