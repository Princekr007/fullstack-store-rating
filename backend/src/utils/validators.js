const Joi = require('joi');

// ✅ User Schema for Admin Add User
exports.userSchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one special character',
    }),
  role: Joi.string().valid('admin', 'user', 'owner').required(),
});

// ✅ Store Schema for Admin Add Store
exports.storeSchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  owner_id: Joi.number().integer().required(),
});

// ✅ Update Password Schema for Normal Users
exports.updatePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must include at least one uppercase letter and one special character',
    }),
});

// ✅ Rating Schema for Submit/Update Rating
exports.ratingSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});
