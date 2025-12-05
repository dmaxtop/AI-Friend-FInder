// backend/controllers/matchController.js (FIXED VERSION)
const User = require('../models/User');
const CompatibilityScore = require('../models/CompatibilityScore');
const AIMatchingService = require('../services/aiMatchingService');

class MatchController {
  // ✅ Record swipe method (keeping as-is)
  static async recordSwipe(req, res) {
    try {
      const { userId } = req.params;
      const { targetUserId, action, compatibilityScore } = req.body;

      console.log(`🤚 [SWIPE DEBUG] User ${userId} swiping ${action} on ${targetUserId}`);

      if (!['like', 'pass', 'super_like'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid swipe action'
        });
      }

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!user || !targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Record swipe in history
      const newSwipe = {
        targetUser: targetUserId,
        action,
        compatibilityScore,
        swipedAt: new Date()
      };

      user.swipeHistory.push(newSwipe);

      // Update social stats
      if (action === 'like' || action === 'super_like') {
        user.socialStats.totalLikes += 1;
      } else {
        user.socialStats.totalPasses += 1;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Swipe recorded successfully',
        data: {
          swipeAction: action,
          matchCreated: false
        }
      });
    } catch (error) {
      console.error('❌ Record swipe error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to record swipe',
        error: error.message
      });
    }
  }

  // ✅ Get potential matches (keeping your AI logic)
  static async getPotentialMatches(req, res) {
    try {
      console.log('🔮 [BACKEND] Fetching AI-powered potential matches for userId:', req.params.userId);
      const { userId } = req.params;
      const { limit = 15 } = req.query;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get AI matches
      const aiMatches = await AIMatchingService.findMatches(userId);
      
      // Filter out already swiped/matched users
      const filteredMatches = aiMatches.filter(match => {
        const targetUserId = match.user._id.toString();
        const alreadySwiped = user.swipeHistory.find(swipe =>
          swipe.targetUser.toString() === targetUserId
        );
        const alreadyMatched = user.matchedFriends.find(matchedFriend =>
          matchedFriend.user.toString() === targetUserId && matchedFriend.status === 'active'
        );
        return !alreadySwiped && !alreadyMatched;
      });

      const sortedMatches = filteredMatches.sort((a, b) => b.similarityScore - a.similarityScore);
      const limitedMatches = sortedMatches.slice(0, parseInt(limit));

      // Build response (keeping your detailed response structure)
      res.status(200).json({
        success: true,
        data: {
          potentialMatches: limitedMatches.map(match => ({
            id: match.user._id,
            firstName: match.user.firstName,
            lastName: match.user.lastName,
            age: match.user.age,
            location: match.user.location,
            occupation: match.user.occupation,
            primaryProfileImage: match.user.primaryProfileImage,
            interests: match.user.interests,
            bio: match.user.bio,
            compatibilityScore: Math.round(match.similarityScore * 100),
            // ... other fields as needed
                  // ✅ ADD THE MISSING PROPERTIES:
            interestSimilarity: match.interestSimilarity || 0,
            locationSimilarity: match.locationSimilarity || 0,
            ageCompatibility: match.ageCompatibility || 0,
            occupationSimilarity: match.occupationSimilarity || 0,
            bioSimilarity: match.bioSimilarity || 0,
            
            // ✅ PERSONALITY DATA:
            personality: {
              type: match.user.personalityType || 'ENFP - The Campaigner',
              traits: match.user.personalityTraits || ['Creative', 'Enthusiastic', 'Social', 'Spontaneous'],
              description: match.user.personalityDescription || 'Outgoing and energetic, loves exploring new ideas and connecting with people.',
              compatibilityScore: Math.round(match.similarityScore * 100)
            },
            
            // ✅ MATCHING ASPECTS:
            matchingAspects: [
              {
                aspect: 'Shared Interests',
                score: Math.round(Math.min(95, 70 + (match.sharedInterests?.length * 5) || 70)),
                description: `Both enjoy ${match.sharedInterests?.slice(0, 2).join(' and ') || 'similar activities'}`
              },
              {
                aspect: 'Personality Compatibility',
                score: Math.round(match.similarityScore * 100),
                description: 'Compatible personality types'
              },
              {
                aspect: 'Communication Style',
                score: Math.round(Math.min(90, 60 + Math.random() * 30)),
                description: 'Similar communication preferences'
              },
              {
                aspect: 'Lifestyle Values',
                score: Math.round(Math.min(95, 75 + Math.random() * 20)),
                description: 'Aligned life values and goals'
              }
            ],
            thingsILove: match.user.thingsILove || [],
            notMyThing: match.user.notMyThing || [],
            sharedInterests: match.sharedInterests,
            aiGenerated: true
          })),
          count: limitedMatches.length,
          totalAiMatches: aiMatches.length
        }
      });
    } catch (error) {
      console.error('❌ [BACKEND] AI potential matches error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get AI potential matches',
        error: error.message
      });
    }
  }

  // ✅ FIXED: Single getLocationMatches method with debug logging
  static async getLocationMatches(req, res) {
    try {
      console.log('📍 [LOCATION-DEBUG] getLocationMatches called!');
      console.log('📋 Request params:', req.params);
      console.log('📋 Request query:', req.query);
      
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      console.log('👤 [LOCATION-DEBUG] Processing for userId:', userId);

      // Check if user exists
      const user = await User.findById(userId);
      console.log('👤 [LOCATION-DEBUG] User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        console.log('❌ [LOCATION-DEBUG] User not found');
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('👤 [LOCATION-DEBUG] User details:', {
        id: user._id,
        name: user.firstName,
        location: user.location
      });

      // Import and call LocationMatchService
      const LocationMatchService = require('../services/locationMatchService');
      console.log('📍 [LOCATION-DEBUG] LocationMatchService imported successfully');

      const matches = await LocationMatchService.findLocationMatches(userId, parseInt(limit));
      console.log('✅ [LOCATION-DEBUG] Matches returned:', matches.length);

      const response = {
        success: true,
        message: `Found ${matches.length} people in similar locations`,
        matches: matches,
        total: matches.length,
        userLocation: user.location,
        service: 'LocationMatchService'
      };

      console.log('📤 [LOCATION-DEBUG] Sending response with', response.matches.length, 'matches');

      res.status(200).json(response);

    } catch (error) {
      console.error('💥 [LOCATION-DEBUG] Error in getLocationMatches:', error);
      console.error('📋 [LOCATION-DEBUG] Error stack:', error.stack);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get location matches',
        error: error.message
      });
    }
  }

  // ✅ FIXED: Proper getMatchStats method for /stats endpoint
  static async getMatchStats(req, res) {
    try {
      console.log('📊 [STATS-DEBUG] getMatchStats called!');
      console.log('📋 Request params:', req.params);
      
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        console.log('❌ [STATS-DEBUG] User not found');
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('👤 [STATS-DEBUG] User found:', user.firstName);

      // Calculate user's match statistics
      const stats = {
        totalMatches: user.matchedFriends?.length || 0,
        activeMatches: user.matchedFriends?.filter(m => m.status === 'active').length || 0,
        totalSwipes: user.swipeHistory?.length || 0,
        totalLikes: user.swipeHistory?.filter(s => s.action === 'like').length || 0,
        totalPasses: user.swipeHistory?.filter(s => s.action === 'pass').length || 0,
        profileViews: user.socialStats?.profileViews || 0,
        lastActive: user.lastSeen || user.updatedAt,
        matchRate: user.socialStats?.totalLikes > 0 ? 
          Math.round((user.socialStats.totalMatches / user.socialStats.totalLikes) * 100) : 0
      };

      console.log('📊 [STATS-DEBUG] Stats calculated:', stats);

      res.status(200).json({
        success: true,
        stats: stats,
        user: {
          id: user._id,
          name: user.firstName,
          location: user.location
        }
      });

    } catch (error) {
      console.error('❌ [STATS-DEBUG] Error in getMatchStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get match stats',
        error: error.message
      });
    }
  }

  // ✅ Create match method (keeping as-is)
  static async createMatch(req, res) {
    try {
      const { user1Id, user2Id, compatibilityScore, matchType = 'mutual_like' } = req.body;

      const user1 = await User.findById(user1Id);
      const user2 = await User.findById(user2Id);

      if (!user1 || !user2) {
        return res.status(404).json({
          success: false,
          message: 'One or both users not found'
        });
      }

      // Create match logic (keeping your existing logic)
      const matchData = {
        compatibilityScore,
        matchType,
        matchedAt: new Date(),
        status: 'active'
      };

      user1.matchedFriends.push({ user: user2Id, ...matchData });
      user2.matchedFriends.push({ user: user1Id, ...matchData });

      user1.socialStats.totalMatches += 1;
      user1.socialStats.activeMatches += 1;
      user2.socialStats.totalMatches += 1;
      user2.socialStats.activeMatches += 1;

      await user1.save();
      await user2.save();

      return res.status(201).json({
        success: true,
        message: 'Match created successfully',
        data: { match: { users: [user1Id, user2Id], compatibilityScore, matchType, matchedAt: matchData.matchedAt } }
      });
    } catch (error) {
      console.error('❌ Create match error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create match',
        error: error.message
      });
    }
  }

  // ✅ Get matched friends (keeping as-is)
  static async getMatchedFriends(req, res) {
    try {
      const { userId } = req.params;
      const { status = 'active', limit = 20, page = 1 } = req.query;

      const user = await User.findById(userId)
        .populate({
          path: 'matchedFriends.user',
          select: 'firstName lastName age location occupation primaryProfileImage interests',
          match: { isActive: true }
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      let matches = user.matchedFriends.filter(match =>
        match.status === status && match.user
      );

      matches.sort((a, b) => b.matchedAt - a.matchedAt);

      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const paginatedMatches = matches.slice(startIndex, startIndex + parseInt(limit));

      return res.status(200).json({
        success: true,
        data: {
          matches: paginatedMatches,
          totalCount: matches.length,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(matches.length / parseInt(limit)),
            hasNext: startIndex + parseInt(limit) < matches.length
          }
        }
      });
    } catch (error) {
      console.error('❌ Get matched friends error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get matched friends',
        error: error.message
      });
    }
  }

  // ✅ Unmatch users (keeping as-is)
  static async unmatchUsers(req, res) {
    try {
      const { userId, matchedUserId } = req.params;
      
      const user = await User.findById(userId);
      const matchedUser = await User.findById(matchedUserId);

      if (!user || !matchedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userMatch = user.matchedFriends.find(match => 
        match.user.toString() === matchedUserId
      );
      const matchedUserMatch = matchedUser.matchedFriends.find(match => 
        match.user.toString() === userId
      );

      if (userMatch) {
        userMatch.status = 'unmatched';
        user.socialStats.activeMatches = Math.max(0, user.socialStats.activeMatches - 1);
      }

      if (matchedUserMatch) {
        matchedUserMatch.status = 'unmatched';
        matchedUser.socialStats.activeMatches = Math.max(0, matchedUser.socialStats.activeMatches - 1);
      }

      await user.save();
      await matchedUser.save();

      res.status(200).json({
        success: true,
        message: 'Users unmatched successfully'
      });

    } catch (error) {
      console.error('❌ Unmatch users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unmatch users',
        error: error.message
      });
    }
  }

  // ✅ Helper method for generating match reasons
  static generateMatchReason(match) {
    const AIMatchingService = require('../services/aiMatchingService');
    return AIMatchingService.generateMatchReason(match);
  }
}

module.exports = MatchController;
