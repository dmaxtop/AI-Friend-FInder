// backend/middleware/auth1.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth middleware
 * Normal mode: verifies JWT and loads user from DB
 * Debug mode (NODE_ENV=development): bypasses auth completely
 */
const auth = async (req, res, next) => {
  // DEBUG AUTH BYPASS - Remove when done debugging!
  /**
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Auth middleware bypassed in development mode - ALL requests are authorized');
    
    // Use a real user ID from your database
    req.user = {
      userId: '689e7eab5f5fb17150f731b1', // Real user ID from your DB
      email: '123@1234.com',              // Real email from your DB
      firstName: 'Debug',
      lastName: 'User',
      role: 'debug'
    };
    return next();
  }
  */

  // ORIGINAL AUTH LOGIC
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  // DEBUG AUTH BYPASS - Remove when done debugging!
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Optional auth bypassed in development mode');
    req.user = {
      userId: '689e7eab5f5fb17150f731b1', // Real user ID from your DB
      email: '123@1234.com',              // Real email from your DB
      firstName: 'Debug',
      lastName: 'User',
      role: 'debug'
    };
    return next();
  }

  // ORIGINAL OPTIONAL AUTH LOGIC
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    req.user = user ? {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user'
    } : null;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { auth, optionalAuth };
