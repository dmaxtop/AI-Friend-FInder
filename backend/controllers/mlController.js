// backend/controllers/mlController.js (Machine Learning Controller)
const User = require('../models/User');
const CompatibilityScore = require('../models/CompatibilityScore');
const MLResult = require('../models/MLResult');
const mlService = require('../services/mlService');
const { v4: uuidv4 } = require('uuid');

class MLController {
  
  // ✅ Process individual user's ML features
  static async processUserProfile(req, res) {
    try {
      const { userId } = req.params;
      
      console.log(`🤖 Starting ML processing for user: ${userId}`);
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Create ML processing record
      const mlResult = new MLResult({
        userId: user._id,
        processType: 'personality_analysis',
        status: 'processing'
      });
      await mlResult.save();

      // ✅ Process personality analysis
      const personalityResults = await mlService.analyzePersonality({
        bio: user.bio,
        interests: user.interests,
        age: user.age,
        occupation: user.occupation,
        education: user.education
      });

      // ✅ Process interest categorization
      const interestResults = await mlService.categorizeInterests(user.interests);

      // ✅ Update user with ML results
      const updatedUser = await User.findByIdAndUpdate(userId, {
        personalityVector: personalityResults.personalityVector,
        mlFeatures: {
          interestCategories: interestResults.categories,
          locationEmbedding: await mlService.getLocationEmbedding(user.location),
          ageGroup: mlService.getAgeGroup(user.age),
          educationLevel: mlService.getEducationLevel(user.education),
          socialScore: personalityResults.socialScore,
          lastUpdated: new Date()
        },
        'mlProcessingStatus.personalityAnalyzed': true,
        'mlProcessingStatus.lastMLUpdate': new Date(),
        'mlProcessingStatus.needsReprocessing': false
      }, { new: true });

      // ✅ Update ML result record
      await MLResult.findByIdAndUpdate(mlResult._id, {
        status: 'completed',
        rawResults: {
          inputFeatures: {
            bio: user.bio,
            interests: user.interests,
            age: user.age
          },
          modelOutput: personalityResults,
          processedOutput: interestResults,
          metadata: {
            modelName: 'personality-analyzer-v2',
            modelVersion: '2.1.0',
            processingTime: Date.now() - mlResult.createdAt.getTime(),
            accuracy: personalityResults.confidence || 0.85
          }
        }
      });

      console.log(`✅ ML processing completed for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'ML processing completed successfully',
        data: {
          userId: user._id,
          personalityVector: updatedUser.personalityVector,
          mlFeatures: updatedUser.mlFeatures
        }
      });

    } catch (error) {
      console.error('❌ ML processing error:', error);
      res.status(500).json({
        success: false,
        message: 'ML processing failed',
        error: error.message
      });
    }
  }

  // ✅ Generate compatibility scores for user pairs
  static async generateCompatibilityScores(req, res) {
    try {
      const { userId } = req.params;
      const { targetUserIds } = req.body;

      console.log(`🔄 Generating compatibility scores for user ${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const batchId = uuidv4();
      const compatibilityResults = [];

      // ✅ Process each target user
      for (const targetId of targetUserIds) {
        const targetUser = await User.findById(targetId);
        if (!targetUser) continue;

        // ✅ Calculate compatibility using ML service
        const compatibility = await mlService.calculateCompatibility(user, targetUser);

        // ✅ Check if compatibility score already exists
        let compatibilityScore = await CompatibilityScore.findOne({
          $or: [
            { user1: userId, user2: targetId },
            { user1: targetId, user2: userId }
          ]
        });

        if (compatibilityScore) {
          // Update existing score
          compatibilityScore = await CompatibilityScore.findByIdAndUpdate(
            compatibilityScore._id,
            {
              overallCompatibility: compatibility.overallScore,
              compatibilityBreakdown: compatibility.breakdown,
              mlModelInfo: compatibility.modelInfo,
              lastUpdated: new Date(),
              needsRecalculation: false
            },
            { new: true }
          );
        } else {
          // Create new compatibility score
          compatibilityScore = new CompatibilityScore({
            user1: userId,
            user2: targetId,
            overallCompatibility: compatibility.overallScore,
            compatibilityBreakdown: compatibility.breakdown,
            mlModelInfo: compatibility.modelInfo,
            relationshipStatus: 'potential'
          });
          await compatibilityScore.save();
        }

        compatibilityResults.push({
          targetUserId: targetId,
          compatibilityScore: compatibility.overallScore,
          breakdown: compatibility.breakdown
        });
      }

      // ✅ Log batch processing result
      const mlBatchResult = new MLResult({
        userId: user._id,
        processType: 'compatibility_batch',
        status: 'completed',
        rawResults: {
          inputFeatures: { userId, targetUserIds },
          processedOutput: compatibilityResults,
          metadata: {
            modelName: 'compatibility-engine-v1',
            modelVersion: '1.2.0',
            processingTime: Date.now()
          }
        },
        batchInfo: {
          batchId,
          totalUsers: targetUserIds.length,
          processedUsers: compatibilityResults.length
        }
      });
      await mlBatchResult.save();

      res.status(200).json({
        success: true,
        message: 'Compatibility scores generated successfully',
        data: {
          batchId,
          processedCount: compatibilityResults.length,
          results: compatibilityResults
        }
      });

    } catch (error) {
      console.error('❌ Compatibility generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Compatibility generation failed',
        error: error.message
      });
    }
  }

  // ✅ Get ML-powered recommendations
  static async getRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10, minCompatibility = 60 } = req.query;

      console.log(`🎯 Getting ML recommendations for user: ${userId}`);

      // ✅ Find top compatibility scores for user
      const recommendations = await CompatibilityScore.find({
        $or: [{ user1: userId }, { user2: userId }],
        overallCompatibility: { $gte: minCompatibility },
        relationshipStatus: { $in: ['potential', 'matched'] }
      })
      .populate('user1', 'firstName lastName age location profileImage interests')
      .populate('user2', 'firstName lastName age location profileImage interests')
      .sort({ overallCompatibility: -1 })
      .limit(parseInt(limit));

      // ✅ Format recommendations
      const formattedRecommendations = recommendations.map(score => {
        const recommendedUser = score.user1._id.toString() === userId 
          ? score.user2 
          : score.user1;

        return {
          id: recommendedUser._id,
          firstName: recommendedUser.firstName,
          lastName: recommendedUser.lastName,
          age: recommendedUser.age,
          location: recommendedUser.location,
          profileImage: recommendedUser.profileImage,
          interests: recommendedUser.interests,
          compatibilityScore: score.overallCompatibility,
          personalityMatch: score.compatibilityBreakdown.personalityMatch.score,
          interestSimilarity: score.compatibilityBreakdown.interestSimilarity.score,
          commonInterests: score.compatibilityBreakdown.interestSimilarity.commonInterests,
          lastUpdated: score.lastUpdated
        };
      });

      res.status(200).json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: {
          recommendations: formattedRecommendations,
          totalCount: formattedRecommendations.length,
          filters: {
            minCompatibility,
            limit
          }
        }
      });

    } catch (error) {
      console.error('❌ Recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations',
        error: error.message
      });
    }
  }

  // ✅ Bulk process all users (for initial setup)
  static async bulkProcessAllUsers(req, res) {
    try {
      console.log('🔄 Starting bulk ML processing for all users');

      // Get all users that need processing
      const users = await User.find({
        'mlProcessingStatus.needsReprocessing': true,
        isActive: true
      }).select('_id firstName lastName');

      const batchId = uuidv4();
      let processedCount = 0;
      const errors = [];

      res.status(202).json({
        success: true,
        message: 'Bulk processing started',
        batchId,
        totalUsers: users.length
      });

      // ✅ Process users in batches to avoid overwhelming the system
      const batchSize = 10;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (user) => {
          try {
            // Process individual user
            await this.processUserProfileInternal(user._id);
            processedCount++;
            console.log(`✅ Processed user ${processedCount}/${users.length}: ${user.firstName} ${user.lastName}`);
          } catch (error) {
            console.error(`❌ Failed to process user ${user._id}:`, error);
            errors.push({
              userId: user._id,
              error: error.message
            });
          }
        });

        await Promise.all(batchPromises);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`🎉 Bulk processing completed: ${processedCount}/${users.length} users processed`);

    } catch (error) {
      console.error('❌ Bulk processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Bulk processing failed',
        error: error.message
      });
    }
  }

  // ✅ Internal method for processing single user (used by bulk process)
  static async processUserProfileInternal(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error(`User ${userId} not found`);

    // Process ML features
    const personalityResults = await mlService.analyzePersonality({
      bio: user.bio,
      interests: user.interests,
      age: user.age,
      occupation: user.occupation,
      education: user.education
    });

    const interestResults = await mlService.categorizeInterests(user.interests);

    // Update user
    await User.findByIdAndUpdate(userId, {
      personalityVector: personalityResults.personalityVector,
      mlFeatures: {
        interestCategories: interestResults.categories,
        locationEmbedding: await mlService.getLocationEmbedding(user.location),
        ageGroup: mlService.getAgeGroup(user.age),
        educationLevel: mlService.getEducationLevel(user.education),
        socialScore: personalityResults.socialScore,
        lastUpdated: new Date()
      },
      'mlProcessingStatus.personalityAnalyzed': true,
      'mlProcessingStatus.lastMLUpdate': new Date(),
      'mlProcessingStatus.needsReprocessing': false
    });

    return true;
  }
}

module.exports = MLController;
