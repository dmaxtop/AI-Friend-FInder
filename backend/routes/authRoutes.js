// backend/routes/authRoutes.js (Express 5.x compatible)
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// ✅ These routes are correctly formatted for Express 5.x
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', AuthController.getCurrentUser);

// ✅ Example of correct parameter routing
router.get('/user/:userId', (req, res) => {
  res.json({ userId: req.params.userId });
});

// ✅ Example of correct wildcard routing (if needed)
router.get('/uploads/*filename', (req, res) => {
  res.json({ filename: req.params.filename });
});

module.exports = router;
