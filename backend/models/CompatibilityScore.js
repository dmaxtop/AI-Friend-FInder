// backend/models/CompatibilityScore.js (ML Results Storage)
const mongoose = require('mongoose');

const compatibilityScoreSchema = new mongoose.Schema({
  // User Pair
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ✅ ML-Generated Scores
  overallCompatibility: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },

  // ✅ Detailed Compatibility Breakdown
  compatibilityBreakdown: {
    personalityMatch: {
      score: { type: Number, min: 0, max: 100 },
      details: {
        openness: Number,
        conscientiousness: Number,
        extraversion: Number,
        agreeableness: Number,
        neuroticism: Number
      }
    },
    interestSimilarity: {
      score: { type: Number, min: 0, max: 100 },
      commonInterests: [String],
      interestOverlap: Number // Percentage
    },
    demographicCompatibility: {
      ageCompatibility: Number,
      locationCompatibility: Number,
      educationCompatibility: Number,
      occupationCompatibility: Number
    },
    socialCompatibility: {
      communicationStyle: Number,
      socialEnergyMatch: Number,
      lifestyleAlignment: Number
    }
  },

  // ✅ ML Model Information
  mlModelInfo: {
    modelVersion: { type: String, required: true },
    algorithmUsed: { type: String, required: true }, // 'cosine_similarity', 'neural_network', etc.
    confidenceScore: { type: Number, min: 0, max: 1 },
    processingTime: Number, // milliseconds
    featuresUsed: [String]
  },

  // ✅ Relationship Status
  relationshipStatus: {
    type: String,
    enum: ['potential', 'matched', 'rejected', 'blocked'],
    default: 'potential'
  },

  // ✅ Interaction History
  interactionHistory: [{
    action: {
      type: String,
      enum: ['viewed', 'liked', 'passed', 'matched', 'unmatched']
    },
    timestamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  // ✅ Real-time Updates
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  needsRecalculation: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// ✅ Compound Indexes for efficient querying
compatibilityScoreSchema.index({ user1: 1, user2: 1 }, { unique: true });
compatibilityScoreSchema.index({ user1: 1, overallCompatibility: -1 });
compatibilityScoreSchema.index({ user2: 1, overallCompatibility: -1 });
compatibilityScoreSchema.index({ relationshipStatus: 1, overallCompatibility: -1 });
compatibilityScoreSchema.index({ lastUpdated: 1 });
compatibilityScoreSchema.index({ needsRecalculation: 1 });

module.exports = mongoose.model('CompatibilityScore', compatibilityScoreSchema);
