const User = require('../models/User');
//const Store = require('../models/Store');
//const Rating = require('../models/Rating');
const bcrypt = require('bcryptjs');
const { userSchema, storeSchema } = require('../utils/validators'); // Joi validators
const logger = require('../utils/logger'); // Winston logger
const { Store, Rating } = require("../models");

// ✅ Add New User (Admin or Normal User)
exports.addUser = async (req, res) => {
  try {
    // Validate request body
    const { error } = userSchema.validate(req.body);
    if (error) {
      logger.warn(`Add User Validation Failed: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, address, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn(`Add User Failed: User with email ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role,
    });

    logger.info(`Admin ${req.user.id} created user ${email} with role ${role}`);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    logger.error(`Add User Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Add New Store
exports.addStore = async (req, res) => {
  try {
    // Validate request body
    const { error } = storeSchema.validate(req.body);
    if (error) {
      logger.warn(`Add Store Validation Failed: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, address, owner_id } = req.body;

    // Check if owner exists and has 'owner' role
    const owner = await User.findByPk(owner_id);
    if (!owner || owner.role !== 'owner') {
      logger.warn(`Add Store Failed: Owner with ID ${owner_id} not found or not a store owner`);
      return res.status(400).json({ message: 'Owner not found or not a store owner' });
    }

    // Create store
    const store = await Store.create({
      name,
      email,
      address,
      owner_id,
    });

    logger.info(`Admin ${req.user.id} created store ${name} assigned to owner ${owner_id}`);
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (err) {
    logger.error(`Add Store Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Dashboard Summary
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    logger.info(`Admin ${req.user.id} accessed dashboard summary`);
    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    logger.error(`Dashboard Error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ View Users with Pagination & Sorting
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

    const whereClause = {};
    if (name) whereClause.name = name;
    if (email) whereClause.email = email;
    if (address) whereClause.address = address;
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "address", "role"],
      order: [[sortBy, order]], // ✅ Sorting
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ View Stores with Pagination & Sorting
exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

    const whereClause = {};
    if (name) whereClause.name = name;
    if (email) whereClause.email = email;
    if (address) whereClause.address = address;

    const stores = await Store.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "address", "owner_id"],
      order: [[sortBy, order]],
    });

    // Compute average ratings
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const avgRating = await Rating.sum("rating", {
          where: { store_id: store.id },
        });
        const ratingCount = await Rating.count({
          where: { store_id: store.id },
        });
        return {
          ...store.dataValues,
          averageRating: ratingCount ? (avgRating / ratingCount).toFixed(1) : "N/A",
        };
      })
    );

    res.json(storesWithRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

