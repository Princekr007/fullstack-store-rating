const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');
const logger = require('../utils/logger'); // Winston

// ✅ Get Ratings for Store Owner's Store
exports.getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find store owned by this user
    const store = await Store.findOne({ where: { owner_id: ownerId } });

    if (!store) {
      logger.warn(`Store Owner ${ownerId} tried to access ratings but store not found`);
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
    });

    logger.info(`Store Owner ${ownerId} viewed ratings for store ${store.id}`);
    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
      },
      ratings,
    });
  } catch (err) {
    logger.error(`Store Owner ${req.user.id} Get Ratings Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Average Rating for Store
exports.getAverageRating = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { owner_id: ownerId } });
    if (!store) {
      logger.warn(`Store Owner ${ownerId} tried to access average rating but store not found`);
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
    });

    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0;

    logger.info(`Store Owner ${ownerId} viewed average rating for store ${store.id}`);
    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
      },
      averageRating: average,
      totalRatings,
    });
  } catch (err) {
    logger.error(`Store Owner ${req.user.id} Get Average Rating Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
