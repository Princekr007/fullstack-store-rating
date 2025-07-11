const bcrypt = require('bcryptjs');
const User = require('../models/User');
//const Store = require('../models/Store');
//const Rating = require('../models/Rating');
const { updatePasswordSchema, ratingSchema } = require('../utils/validators'); // Joi
const logger = require('../utils/logger'); // Winston
const { Store, Rating } = require("../models");

// ✅ Update User Password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      logger.warn(`User ${userId} Password Update Failed: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { newPassword } = req.body;

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashedPassword }, { where: { id: userId } });

    logger.info(`User ${userId} updated their password`);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    logger.error(`User ${req.user.id} Password Update Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Stores with Search + Ratings
exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const whereClause = {};
    if (name) whereClause.name = name;
    if (address) whereClause.address = address;

    // Fetch stores
    const stores = await Store.findAll({
      where: whereClause,
      attributes: ["id", "name", "address"],
    });

    // Add averageRating and userRating for each store
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        // Calculate average rating
        const avgRating = await Rating.sum("rating", {
          where: { store_id: store.id },
        });
        const ratingCount = await Rating.count({
          where: { store_id: store.id },
        });

        // Get current user's rating for this store
        const userRatingEntry = await Rating.findOne({
          where: { user_id: req.user.id, store_id: store.id },
        });

        return {
          ...store.dataValues,
          averageRating: ratingCount ? (avgRating / ratingCount).toFixed(1) : "N/A",
          userRating: userRatingEntry ? userRatingEntry.rating : null,
        };
      })
    );

    logger.info(`User ${req.user.id} viewed store list`);
    res.json(storesWithRatings);
  } catch (err) {
    logger.error(`User ${req.user.id} Get Stores Error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Submit or Update Rating
exports.submitOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request
    const { error } = ratingSchema.validate(req.body);
    if (error) {
      logger.warn(`User ${userId} Rating Submission Failed: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { store_id, rating } = req.body;

    // Check if user already rated this store
    let existingRating = await Rating.findOne({
      where: { user_id: userId, store_id },
    });

    if (existingRating) {
      // Update rating
      existingRating.rating = rating;
      await existingRating.save();

      logger.info(`User ${userId} updated rating for store ${store_id}`);
      return res.json({ message: 'Rating updated successfully', rating: existingRating });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        user_id: userId,
        store_id,
        rating,
      });

      logger.info(`User ${userId} submitted new rating for store ${store_id}`);
      return res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
    }
  } catch (err) {
    logger.error(`User ${req.user.id} Rating Submission Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
