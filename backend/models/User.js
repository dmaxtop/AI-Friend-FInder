// backend/models/User.js (Complete Enhanced Model with All Required Fields)
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: String,
  size: Number,
  mimetype: String,
  uploadedAt: { type: Date, default: Date.now },
  isCoverPhoto: { type: Boolean, default: false },
  isPrimary: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // Profile Information
  age: {
    type: Number,
    min: [13, 'Must be at least 13 years old'],
    max: [120, 'Age cannot exceed 120']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  occupation: { type: String, trim: true, maxlength: [100, 'Occupation cannot exceed 100 characters'] },
  education: { type: String, trim: true, maxlength: [200, 'Education cannot exceed 200 characters'] },
  bio: { type: String, trim: true, maxlength: [500, 'Bio cannot exceed 500 characters'] },
  interests: [{ type: String, trim: true, maxlength: [50, 'Interest cannot exceed 50 characters'] }],

  // Physical & Lifestyle Information
  height: {
    type: Number,
    min: [100, 'Height must be at least 100cm'],
    max: [250, 'Height cannot exceed 250cm']
  },
  bodyType: {
    type: String,
    enum: ['slim', 'athletic', 'average', 'curvy', 'plus-size'],
    trim: true
  },
  smokingStatus: {
    type: String,
    enum: ['never', 'socially', 'regularly', 'trying-to-quit'],
    default: 'never'
  },
  drinkingStatus: {
    type: String,
    enum: ['never', 'socially', 'regularly', 'occasionally'],
    default: 'socially'
  },

  // Family & Relationship
  hasKids: { type: Boolean, default: false },
  wantsKids: {
    type: String,
    enum: ['yes', 'no', 'maybe', 'someday'],
    trim: true
  },
  hasPets: { type: Boolean, default: false },
  petPreference: {
    type: String,
    enum: ['love-pets', 'allergic', 'no-preference', 'no-pets'],
    trim: true
  },
  relationshipType: {
    type: String,
    enum: ['casual', 'serious', 'marriage', 'friendship', 'open'],
    trim: true
  },

  // Additional Arrays
  languages: [{ 
    type: String, 
    trim: true, 
    maxlength: [30, 'Language name cannot exceed 30 characters'] 
  }],
  lookingFor: [{
    type: String,
    trim: true,
    maxlength: [50, 'Looking for item cannot exceed 50 characters']
  }],
  dealBreakers: [{
    type: String,
    trim: true,
    maxlength: [100, 'Deal breaker cannot exceed 100 characters']
  }],
  hobbies: [{
    type: String,
    trim: true,
    maxlength: [50, 'Hobby cannot exceed 50 characters']
  }],

// ✅ CORRECT - This validates ARRAY length (max 4 items) AND string length (max 80 chars each)
thingsILove: {
  type: [String],
  trim: true,
  validate: {
    validator: function(arr) {
      // Check array length (max 4 items)
      if (arr.length > 4) return false;
      
      // Check each string length (max 80 chars)
      return arr.every(item => item.length <= 80);
    },
    message: 'You can only add up to 4 things you love, and each must be under 80 characters'
  }
},

notMyThing: {
  type: [String], 
  trim: true,
  validate: {
    validator: function(arr) {
      // Check array length (max 4 items)
      if (arr.length > 4) return false;
      
      // Check each string length (max 80 chars)  
      return arr.every(item => item.length <= 80);
    },
    message: 'You can only add up to 4 things in not my thing, and each must be under 80 characters'
  }
},

  // ✅ NEW: Communication Style
  communicationStyle: {
    type: String,
    enum: ['direct', 'diplomatic', 'casual', 'formal', 'humorous', 'deep-thinker', 'good-listener', 'storyteller'],
    trim: true
  },

  // ✅ NEW: Work-Life Balance (0 to 1 slider)
  workLifeBalance: {
    type: Number,
    min: [0, 'Work-life balance must be between 0 and 1'],
    max: [1, 'Work-life balance must be between 0 and 1'],
    default: 0.5
  },

  // ✅ NEW: Social Engagement Preference (0 to 10 slider)
  socialEngagementPreference: {
    type: Number,
    min: [0, 'Social engagement preference must be between 0 and 10'],
    max: [10, 'Social engagement preference must be between 0 and 10'],
    default: 5
  },

  // Image Storage
  profileImages: [imageSchema],
  primaryProfileImage: String,
  coverPhoto: String,

  // ✅ ENHANCED: Direct Matched Friends Storage
  matchedFriends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    matchedAt: {
      type: Date,
      default: Date.now
    },
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    matchType: {
      type: String,
      enum: ['mutual_like', 'ai_suggested', 'event_based', 'interest_based'],
      default: 'mutual_like'
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'unmatched'],
      default: 'active'
    },
    conversationStarted: {
      type: Boolean,
      default: false
    },
    lastInteraction: {
      type: Date,
      default: Date.now
    }
  }],

  // ✅ ENHANCED: Friend Requests and Social Features
  friendRequests: {
    sent: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sentAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }],
    received: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      receivedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }]
  },

  // ✅ ENHANCED: User Interactions and Swipe History
  swipeHistory: [{
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['like', 'pass', 'super_like'], required: true },
    swipedAt: { type: Date, default: Date.now },
    compatibilityScore: Number
  }],

  // ✅ ENHANCED: Social Stats
  socialStats: {
    totalMatches: { type: Number, default: 0 },
    activeMatches: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalPasses: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },

  // ✅ NEW: Recent Matches Array (was missing in your model)
  recentMatches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // ✅ NEW: Writing Vector for AI Text Analysis (from aiMatchingService requirements)
  writingVector: [{
    type: Number
  }],

  // ✅ NEW: Daily Limits and Restrictions
  dailyLimits: {
    swipesUsed: { type: Number, default: 0 },
    lastSwipeReset: { type: Date, default: Date.now },
    maxDailySwipes: { type: Number, default: 100 },
    likesUsed: { type: Number, default: 0 },
    maxDailyLikes: { type: Number, default: 50 }
  },

  // ✅ NEW: Notification Preferences
  notificationSettings: {
    newMatches: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    profileViews: { type: Boolean, default: true },
    friendRequests: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  profileVisibility: {
  type: String,
  enum: ['public', 'friends', 'private'],
  default: 'public'
  },
  // ✅ NEW: Privacy Settings
  privacySettings: {
    profileVisibility: { 
      type: String, 
      enum: ['public', 'friends', 'private'], 
      default: 'public' 
    },
    showOnlineStatus: { type: Boolean, default: true },
    allowMessageRequests: { type: Boolean, default: true },
    showLastSeen: { type: Boolean, default: true },
    discoverableByEmail: { type: Boolean, default: false },
    discoverableByPhone: { type: Boolean, default: false }
  },

  // ✅ NEW: Block and Report Lists
  blockedUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blockedAt: { type: Date, default: Date.now },
    reason: { type: String, maxlength: 200 }
  }],

  reportedUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedAt: { type: Date, default: Date.now },
    reason: { type: String, enum: ['spam', 'harassment', 'inappropriate', 'fake'], required: true },
    description: { type: String, maxlength: 500 }
  }],

  // ✅ NEW: Subscription and Premium Features
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false },
    autoRenewal: { type: Boolean, default: false }
  },

  // ✅ NEW: Device and Session Information
  devices: [{
    deviceId: String,
    deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
    platform: String,
    lastUsed: { type: Date, default: Date.now },
    pushToken: String,
    isActive: { type: Boolean, default: true }
  }],

  // ML-Related Data
  personalityVector: {
    openness: { type: Number, min: 0, max: 10, default: 5 },
    conscientiousness: { type: Number, min: 0, max: 10, default: 5 },
    extraversion: { type: Number, min: 0, max: 10, default: 5 },
    agreeableness: { type: Number, min: 0, max: 10, default: 5 },
    neuroticism: { type: Number, min: 0, max: 10, default: 5 }
  },

  mlFeatures: {
    interestCategories: [String],
    locationEmbedding: [Number],
    ageGroup: String,
    educationLevel: Number,
    socialScore: Number,
    lastUpdated: { type: Date, default: Date.now }
  },

  // Events
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  activityStatus: {
    type: String,
    enum: ['online', 'busy', 'away', 'invisible', 'offline'],
    default: 'online'
  },

  // ✅ NEW: Account Security
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    backupCodes: [String],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    passwordChangedAt: Date,
    emailVerifiedAt: Date
  },

  // ✅ NEW: Profile Completion and Onboarding
  onboarding: {
    profileCompleted: { type: Boolean, default: false },
    tutorialCompleted: { type: Boolean, default: false },
    preferencesSet: { type: Boolean, default: false },
    firstLoginAt: Date,
    completedSteps: [{ 
      step: String, 
      completedAt: Date 
    }]
  },

  // ML Processing Status
  mlProcessingStatus: {
    personalityAnalyzed: { type: Boolean, default: false },
    compatibilityComputed: { type: Boolean, default: false },
    lastMLUpdate: Date,
    needsReprocessing: { type: Boolean, default: true }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Virtual fields for matched friends
userSchema.virtual('activeMatchedFriendsCount').get(function() {
  return this.matchedFriends.filter(match => match.status === 'active').length;
});

userSchema.virtual('recentMatchesVirtual').get(function() {
  return this.matchedFriends
    .filter(match => match.status === 'active')
    .sort((a, b) => b.matchedAt - a.matchedAt)
    .slice(0, 10);
});

// ✅ NEW: Additional Virtual Fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('profileCompletionPercentage').get(function() {
  let completedFields = 0;
  const totalFields = 12; // Updated total fields count
  
  if (this.age) completedFields++;
  if (this.location) completedFields++;
  if (this.occupation) completedFields++;
  if (this.bio) completedFields++;
  if (this.interests && this.interests.length > 0) completedFields++;
  if (this.profileImages && this.profileImages.length > 0) completedFields++;
  if (this.education) completedFields++;
  if (this.primaryProfileImage) completedFields++;
  if (this.thingsILove && this.thingsILove.length > 0) completedFields++;
  if (this.communicationStyle) completedFields++;
  if (this.workLifeBalance !== undefined) completedFields++;
  if (this.socialEngagementPreference !== undefined) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
});

userSchema.virtual('isOnline').get(function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastSeen > fiveMinutesAgo;
});

// ✅ NEW: Work-Life Balance Description Virtual
userSchema.virtual('workLifeBalanceLabel').get(function() {
  if (this.workLifeBalance === undefined) return 'Not specified';
  if (this.workLifeBalance <= 0.2) return 'Work-focused';
  if (this.workLifeBalance <= 0.4) return 'Work-leaning';
  if (this.workLifeBalance <= 0.6) return 'Balanced';
  if (this.workLifeBalance <= 0.8) return 'Life-leaning';
  return 'Life-focused';
});

// ✅ NEW: Social Engagement Description Virtual
userSchema.virtual('socialEngagementLabel').get(function() {
  if (this.socialEngagementPreference === undefined) return 'Not specified';
  if (this.socialEngagementPreference <= 2) return 'Very introverted';
  if (this.socialEngagementPreference <= 4) return 'Introverted';
  if (this.socialEngagementPreference <= 6) return 'Balanced';
  if (this.socialEngagementPreference <= 8) return 'Extroverted';
  return 'Very extroverted';
});

// ✅ Enhanced Indexes for efficient matching queries
userSchema.index({ 'matchedFriends.user': 1 });
userSchema.index({ 'matchedFriends.matchedAt': -1 });
userSchema.index({ 'swipeHistory.targetUser': 1 });
userSchema.index({ 'socialStats.totalMatches': -1 });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ location: 1, age: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ 'subscription.plan': 1, 'subscription.isActive': 1 });
userSchema.index({ workLifeBalance: 1 });
userSchema.index({ socialEngagementPreference: 1 });
userSchema.index({ communicationStyle: 1 });

// ✅ NEW: Middleware for automatic field updates
userSchema.pre('save', function(next) {
  // Update lastSeen on any modification
  this.lastSeen = new Date();
  
  // Reset daily limits if a day has passed
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (this.dailyLimits && this.dailyLimits.lastSwipeReset < oneDayAgo) {
    this.dailyLimits.swipesUsed = 0;
    this.dailyLimits.likesUsed = 0;
    this.dailyLimits.lastSwipeReset = new Date();
  }
  
  // Update profile completion status
  if (this.onboarding) {
    this.onboarding.profileCompleted = this.profileCompletionPercentage >= 80;
  }
  
  next();
});

// ✅ NEW: Instance Methods
userSchema.methods.hasSwipedOn = function(targetUserId) {
  return this.swipeHistory.some(swipe => 
    swipe.targetUser.toString() === targetUserId.toString()
  );
};

userSchema.methods.isMatchedWith = function(targetUserId) {
  return this.matchedFriends.some(match => 
    match.user.toString() === targetUserId.toString() && 
    match.status === 'active'
  );
};

userSchema.methods.canSwipeToday = function() {
  return this.dailyLimits.swipesUsed < this.dailyLimits.maxDailySwipes;
};

userSchema.methods.hasBlockedUser = function(targetUserId) {
  return this.blockedUsers.some(blocked => 
    blocked.user.toString() === targetUserId.toString()
  );
};

// ✅ NEW: Method to add things I love with validation
userSchema.methods.addThingILove = function(item) {
  if (this.thingsILove.length >= 4) {
    throw new Error('Cannot add more than 4 things you love');
  }
  this.thingsILove.push(item);
};

// ✅ NEW: Method to add not my thing with validation
userSchema.methods.addNotMyThing = function(item) {
  if (this.notMyThing.length >= 4) {
    throw new Error('Cannot add more than 4 things that are not your thing');
  }
  this.notMyThing.push(item);
};

module.exports = mongoose.model('User', userSchema);
