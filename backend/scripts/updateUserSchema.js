// backend/scripts/updateUserSchema.js
const mongoose = require('mongoose');
const User = require('../models/User');

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await User.updateMany(
      {},
      {
        $set: {
          recentMatches: [],
          writingVector: [],
          dailyLimits: {
            swipesUsed: 0,
            lastSwipeReset: new Date(),
            maxDailySwipes: 100,
            likesUsed: 0,
            maxDailyLikes: 50
          },
          notificationSettings: {
            newMatches: true,
            messages: true,
            profileViews: true,
            friendRequests: true,
            events: true,
            marketing: false
          },
          privacySettings: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowMessageRequests: true,
            showLastSeen: true,
            discoverableByEmail: false,
            discoverableByPhone: false
          },
          blockedUsers: [],
          reportedUsers: [],
          subscription: {
            plan: 'free',
            isActive: false,
            autoRenewal: false
          },
          devices: [],
          security: {
            twoFactorEnabled: false,
            loginAttempts: 0
          },
          onboarding: {
            profileCompleted: false,
            tutorialCompleted: false,
            preferencesSet: false,
            completedSteps: []
          }
        }
      }
    );
    
    console.log('✅ All users updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
