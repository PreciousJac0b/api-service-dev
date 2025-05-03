import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401);
    throw new Error('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      res.status(400);
      throw new Error('Invalid token: No user ID found.');
    }
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(400);
    throw new Error('Invalid token');
  }
};

export default protect;