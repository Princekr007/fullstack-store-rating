const express = require('express');
const router = express.Router();
const { verifyToken, isStoreOwner } = require('../middleware/authMiddleware');
const {
  getStoreRatings,
  getAverageRating
} = require('../controllers/storeOwnerController');

// View Ratings for Store
router.get('/ratings', verifyToken, isStoreOwner, getStoreRatings);

// View Average Rating for Store
router.get('/average-rating', verifyToken, isStoreOwner, getAverageRating);

module.exports = router;
