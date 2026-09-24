const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT Bearer Token in HTTP Authorization Header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_cybervault_jwt_key_2026_ie3132'
      );

      // Get user from database excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'User account not found' });
      }

      next();
    } catch (error) {
      console.error(`[-] Auth Token verification failed: ${error.message}`);
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token provided' });
  }
};

/**
 * Admin Middleware - Restricts endpoint access to users with 'admin' role
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { protect, admin };
