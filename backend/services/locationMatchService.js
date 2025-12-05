const User = require('../models/User');
const express = require('express');
class LocationMatchService {

  // Simple location comparison - only checks if locations match
  static isSimilarLocation(loc1, loc2) {
    if (!loc1 || !loc2) return false;

    loc1 = loc1.toLowerCase().trim();
    loc2 = loc2.toLowerCase().trim();

    // Exact match
    if (loc1 === loc2) return true;

    // Split by comma and check parts
    const parts1 = loc1.split(",").map(p => p.trim());
    const parts2 = loc2.split(",").map(p => p.trim());

    // Check if any part matches
    for (let p1 of parts1) {
      for (let p2 of parts2) {
        if (p1 === p2) return true;
      }
    }

    return false;
  }

  // Main function - returns ALL users with similar locations
  static async findLocationMatches(userId, limit = 20) {
    try {
      console.log('📍 LocationMatchService: Finding location matches for user:', userId);
      
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      console.log('👤 Current user location:', currentUser.location);

      const allUsers = await User.find({
        _id: { $ne: userId },
        isActive: true
      }).select('firstName lastName age location profileImages interests');

      console.log(`👥 Found ${allUsers.length} potential users to check`);

      const matches = [];

      for (let user of allUsers) {
        if (this.isSimilarLocation(currentUser.location, user.location)) {
          console.log(`✅ Location match: ${user.firstName} from ${user.location}`);
          
          matches.push({
            user,
            locationMatch: true,
            matchReason: 'Similar location'
          });
        } else {
          console.log(`❌ No location match: ${user.firstName} from ${user.location}`);
        }
      }

      console.log(`📍 LocationMatchService: Found ${matches.length} location matches`);
      return matches.slice(0, limit);

    } catch (error) {
      console.error('❌ LocationMatchService error:', error);
      throw error;
    }
  }
}

module.exports = LocationMatchService;
