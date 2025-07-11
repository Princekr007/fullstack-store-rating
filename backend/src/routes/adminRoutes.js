const express = require('express');
const router = express.Router();
const {
  addUser,
  addStore,
  dashboard,
  getUsers,
  getStores,
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Test Route
router.get('/test', verifyToken, isAdmin, (req, res) => {
  res.send(`Hello Admin ${req.user.id}, you are authorized ✅`);
});

// Add User
router.post('/add-user', verifyToken, isAdmin, addUser);

// Add Store
router.post('/add-store', verifyToken, isAdmin, addStore);

// Dashboard Summary
router.get('/dashboard', verifyToken, isAdmin, dashboard);

// Get Users with Filters
router.get('/users', verifyToken, isAdmin, getUsers);

// Get Stores with Filters
router.get('/stores', verifyToken, isAdmin, getStores);

module.exports = router;
