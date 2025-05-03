import Joi from "joi";

const handleValidationErrors = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: "Validation Error", errors });
  }
  next();
};


const profileUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(), 
}).min(1); 

export const validateProfileUpdate =
  handleValidationErrors(profileUpdateSchema);
