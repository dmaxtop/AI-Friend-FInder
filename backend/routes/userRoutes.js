const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth1.js');
const upload = require('../middleware/upload');
const { handleMulterError } = upload;

const UserController = require('../controllers/userController');

// ✅ Function to clean empty string enum fields (moved to controller but kept here for reference)
const cleanEnumFields = (updateData) => {
  const enumFields = [
    'bodyType', 
    'wantsKids', 
    'petPreference', 
    'relationshipType',
    'smokingStatus',
    'drinkingStatus',
    'communicationStyle',
    'activityStatus'
  ];
  
  enumFields.forEach(field => {
    if (updateData[field] === '') {
      console.log(`🧹 DEBUG: Removing empty enum field: ${field}`);
      delete updateData[field]; // Remove empty string fields
    }
  });
};

// ✅ SPECIFIC ROUTES FIRST - Update user profile (using controller pattern)
router.put('/profile', auth, UserController.updateUserProfile);

// Upload user images
router.post(
  '/:userId/images',
  auth,
  upload.array('images', 5),
  (req, res, next) => next(),
  handleMulterError,
  UserController.uploadUserImages
);

// Delete user image
router.delete(
  '/:userId/images/:imageId',
  auth,
  UserController.deleteUserImage
);

// ✅ PARAMETERIZED ROUTES LAST - Get user profile
router.get('/:userId', optionalAuth, UserController.getUserProfile);

module.exports = router;
