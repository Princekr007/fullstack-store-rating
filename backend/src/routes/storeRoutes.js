const express = require('express');
const router = express.Router();
const { verifyToken, isStoreOwner } = require('../middleware/authMiddleware');

// Test Route
router.get('/test', verifyToken, isStoreOwner, (req, res) => {
  res.send(`Hello Store Owner ${req.user.id}, you are authorized ✅`);
});

module.exports = router;
