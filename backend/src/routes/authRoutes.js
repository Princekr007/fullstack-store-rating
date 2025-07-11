const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Test Route
router.get('/test', (req, res) => {
  res.send('Auth API is working ✅');
});

// Signup
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// ✅ Update Password
router.post('/update-password', verifyToken, authController.updatePassword);

module.exports = router;
