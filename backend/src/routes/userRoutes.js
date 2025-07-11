const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  updatePassword,
  getAllStores,
  submitOrUpdateRating
} = require('../controllers/userController');

// Update Password
router.put('/update-password', verifyToken, updatePassword);

// View All Stores (with search filters)
router.get('/stores', verifyToken, getAllStores);

// Submit or Update Rating
router.post('/rate-store', verifyToken, submitOrUpdateRating);

module.exports = router;
