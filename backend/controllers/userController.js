// backend/controllers/userController.js (Enhanced with profile update functionality)
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

class UserController {
  
  // ✅ Upload user images
  static async uploadUserImages(req, res) {
    try {
      const { userId } = req.params;
      const { imageType } = req.body; // 'profile' or 'cover'
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }

      const uploadedImages = [];

      for (const file of req.files) {
        const imageData = {
          url: `/uploads/users/${userId}/${file.filename}`,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          uploadedAt: new Date(),
          isCoverPhoto: imageType === 'cover',
          isPrimary: imageType === 'profile' && user.profileImages.filter(img => !img.isCoverPhoto).length === 0,
          isPublic: true
        };

        user.profileImages.push(imageData);
        uploadedImages.push(imageData);
      }

      // ✅ Update primary image references
      if (imageType === 'cover') {
        const coverImg = user.profileImages.find(img => img.isCoverPhoto);
        user.coverPhoto = coverImg ? coverImg.url : null;
      } else if (imageType === 'profile') {
        const primaryImg = user.profileImages.find(img => img.isPrimary && !img.isCoverPhoto);
        user.primaryProfileImage = primaryImg ? primaryImg.url : null;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          uploadedImages,
          totalImages: user.profileImages.length
        }
      });

    } catch (error) {
      console.error('❌ Image upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message
      });
    }
  }

  // ✅ Get user profile with images
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId)
        .select('-password')
        .populate('joinedEvents', 'title date location coverPhoto');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            ...user.toObject(),
            primaryImage: user.primaryImage,
            coverImage: user.coverImage,
            allProfileImages: user.allProfileImages
          }
        }
      });

    } catch (error) {
      console.error('❌ Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: error.message
      });
    }
  }

  // ✅ Delete user image
  static async deleteUserImage(req, res) {
    try {
      const { userId, imageId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const imageIndex = user.profileImages.findIndex(img => img._id.toString() === imageId);
      if (imageIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      const imageToDelete = user.profileImages[imageIndex];
      
      // ✅ Delete physical file
      try {
        const filePath = path.join(__dirname, '../uploads', imageToDelete.url.replace('/uploads/', ''));
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn('⚠️  Could not delete physical file:', fileError.message);
      }

      // ✅ Remove from array
      user.profileImages.splice(imageIndex, 1);
      
      // ✅ Update primary references if necessary
      if (imageToDelete.isCoverPhoto) {
        user.coverPhoto = null;
      } else if (imageToDelete.isPrimary) {
        user.primaryProfileImage = null;
        // Set new primary if other profile images exist
        const newPrimary = user.profileImages.find(img => !img.isCoverPhoto);
        if (newPrimary) {
          newPrimary.isPrimary = true;
          user.primaryProfileImage = newPrimary.url;
        }
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: {
          deletedImageId: imageId,
          remainingImages: user.profileImages.length
        }
      });

    } catch (error) {
      console.error('❌ Delete image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }
  }

  // ✅ NEW: Update user profile
  static async updateUserProfile(req, res) {
    try {
      console.log('🔍 DEBUG: UserController.updateUserProfile called');
      console.log('🔍 DEBUG: req.user object:', req.user);
      console.log('🔍 DEBUG: req.user keys:', Object.keys(req.user || {}));
      
      // Try different possible user ID fields
      const userId = req.user._id || req.user.userId || req.user.id || req.user.user?._id;
      console.log('🔍 DEBUG: Extracted userId:', userId);
      console.log('🔍 DEBUG: userId type:', typeof userId);
      
      if (!userId) {
        console.log('❌ DEBUG: No userId found in req.user');
        return res.status(400).json({
          success: false,
          message: 'User ID not found in request'
        });
      }
      
      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        location: req.body.location,
        occupation: req.body.occupation,
        education: req.body.education,
        bio: req.body.bio,
        height: req.body.height,
        bodyType: req.body.bodyType,
        smokingStatus: req.body.smokingStatus,
        drinkingStatus: req.body.drinkingStatus,
        hasKids: req.body.hasKids,
        wantsKids: req.body.wantsKids,
        hasPets: req.body.hasPets,
        petPreference: req.body.petPreference,
        languages: req.body.languages,
        relationshipType: req.body.relationshipType,
        lookingFor: req.body.lookingFor,
        dealBreakers: req.body.dealBreakers,
        interests: req.body.interests,
        hobbies: req.body.hobbies,
        activityStatus: req.body.activityStatus,
        profileVisibility: req.body.profileVisibility,
        notificationSettings: req.body.notificationSettings,
        privacySettings: req.body.privacySettings,
        security: req.body.security,
        // ✅ Add new fields from updated User model
        thingsILove: req.body.thingsILove,
        notMyThing: req.body.notMyThing,
        communicationStyle: req.body.communicationStyle,
        workLifeBalance: req.body.workLifeBalance,
        socialEngagementPreference: req.body.socialEngagementPreference,
        updatedAt: new Date()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // ✅ CRITICAL FIX: Clean empty strings from enum fields BEFORE validation
      const enumFields = [
        'bodyType', 'wantsKids', 'petPreference', 'relationshipType',
        'smokingStatus', 'drinkingStatus', 'communicationStyle', 'activityStatus'
      ];

      enumFields.forEach(field => {
        if (updateData[field] === '') {
          console.log(`🧹 DEBUG: Removing empty enum field: ${field}`);
          delete updateData[field];
        }
      });

      console.log('🔍 DEBUG: Searching for user with ID:', userId);
      console.log('🔍 DEBUG: Update data keys after cleaning:', Object.keys(updateData));
      
      // Check if user exists before updating
      const existingUser = await User.findById(userId);
      console.log('🔍 DEBUG: User exists in DB:', !!existingUser);
      if (existingUser) {
        console.log('🔍 DEBUG: Found user email:', existingUser.email);
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        console.log('❌ DEBUG: User not found in DB for userId:', userId);
        
        // Additional debug: Check if any users exist and show some sample IDs
        const userCount = await User.countDocuments();
        console.log('📊 DEBUG: Total users in database:', userCount);
        
        if (userCount > 0) {
          const sampleUsers = await User.find({}).limit(3).select('_id email');
          console.log('📊 DEBUG: Sample user IDs in DB:', sampleUsers.map(u => ({ id: u._id, email: u.email })));
        }
        
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ DEBUG: User updated successfully, user ID:', user._id);
      res.json({
        success: true,
        user: user
      });

    } catch (error) {
      console.error('❌ Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
