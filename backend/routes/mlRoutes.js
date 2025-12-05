// backend/routes/mlRoutes.js (ML Processing API Routes)
const express = require('express');
const router = express.Router();
const MLController = require('../controllers/mlController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// ✅ Rate limiting for ML operations
const mlRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 ML requests per windowMs
  message: 'Too many ML processing requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Process individual user's ML profile
router.post('/process-user/:userId', auth, mlRateLimit, MLController.processUserProfile);

// ✅ Generate compatibility scores
router.post('/compatibility/:userId', auth, mlRateLimit, MLController.generateCompatibilityScores);

// ✅ Get ML-powered recommendations
router.get('/recommendations/:userId', auth, MLController.getRecommendations);

// ✅ Bulk process all users (admin only)
router.post('/bulk-process', auth, async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}, MLController.bulkProcessAllUsers);

// ✅ Get ML processing status for user
router.get('/status/:userId', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const MLResult = require('../models/MLResult');
    
    const user = await User.findById(req.params.userId)
      .select('mlProcessingStatus mlFeatures personalityVector');
    
    const recentMLResults = await MLResult.find({
      userId: req.params.userId
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('processType status createdAt error performanceMetrics');

    res.json({
      success: true,
      data: {
        user: user,
        recentProcessing: recentMLResults
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get ML status',
      error: error.message
    });
  }
});

// ✅ Clear and regenerate all ML data for user
router.delete('/clear-user/:userId', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const CompatibilityScore = require('../models/CompatibilityScore');
    const MLResult = require('../models/MLResult');

    const userId = req.params.userId;

    // ✅ Clear user ML data
    await User.findByIdAndUpdate(userId, {
      personalityVector: {
        openness: 5,
        conscientiousness: 5,
        extraversion: 5,
        agreeableness: 5,
        neuroticism: 5
      },
      mlFeatures: {
        interestCategories: [],
        locationEmbedding: [0, 0],
        ageGroup: 'unknown',
        educationLevel: 5,
        socialScore: 5,
        lastUpdated: new Date()
      },
      'mlProcessingStatus.personalityAnalyzed': false,
      'mlProcessingStatus.compatibilityComputed': false,
      'mlProcessingStatus.needsReprocessing': true
    });

    // ✅ Clear compatibility scores
    await CompatibilityScore.deleteMany({
      $or: [{ user1: userId }, { user2: userId }]
    });

    // ✅ Clear ML results
    await MLResult.deleteMany({ userId: userId });

    res.json({
      success: true,
      message: 'ML data cleared successfully',
      userId: userId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear ML data',
      error: error.message
    });
  }
});

module.exports = router;
