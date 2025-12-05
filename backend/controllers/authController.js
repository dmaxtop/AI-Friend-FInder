// backend/controllers/authController.js (Updated with detailed validation)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      console.log('Registration attempt:', { email: req.body.email });
      
      const { firstName, lastName, email, password, age, location } = req.body;

      // Detailed validation
      const errors = {};
      if (!firstName?.trim()) errors.firstName = 'First name is required';
      if (!lastName?.trim()) errors.lastName = 'Last name is required';
      if (!email?.trim()) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
      if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (!age) errors.age = 'Age is required';
      if (age && (isNaN(age) || age < 18)) errors.age = 'You must be at least 18 years old and provide a valid number';
      if (!location?.trim()) errors.location = 'Location is required';

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors  // Return specific errors for frontend to display
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        age: parseInt(age),
        location: location.trim()
      });

      const savedUser = await newUser.save();
      console.log('User created successfully:', savedUser._id);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: savedUser._id,
          email: savedUser.email 
        },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '7d' }
      );

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
          user: {
            ...savedUser.toObject(),  // ✅ Complete user object
            id: savedUser._id,        // ✅ Add id field
            password: undefined       // ✅ Remove password
          }
        });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific MongoDB errors
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Login user (unchanged, but added logging for consistency)
  static async login(req, res) {
    try {
      console.log('Login attempt:', { email: req.body.email });
      
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email 
        },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '7d' }
      );

      console.log('Login successful for user:', user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          ...user.toObject(),  // ✅ Get complete user object
          id: user._id,        // ✅ Add id field for frontend compatibility
          password: undefined  // ✅ Remove password for security
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get current user (assuming auth middleware is used in routes)
  static async getCurrentUser(req, res) {
    try {
      // This would require auth middleware to set req.user
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get current user'
      });
    }
  }
}

module.exports = AuthController;
