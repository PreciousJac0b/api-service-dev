import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "30d",
  });
};

export default generateToken;