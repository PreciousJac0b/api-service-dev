import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (id, role) => {
  const userRole = role || 'buyer';
  return jwt.sign({ id, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;