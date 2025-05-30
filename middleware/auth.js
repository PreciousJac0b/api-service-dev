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

const authorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access Denied. You don't have the permission to access this resource."
      });
    }
    next();
}  
}

export { protect, authorizedRoles };