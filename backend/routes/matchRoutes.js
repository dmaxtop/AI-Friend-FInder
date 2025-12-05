const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/matchController');
const { auth } = require('../middleware/auth');

console.log('🛣️ [ROUTES] matchRoutes.js loaded successfully');

// Stats route
router.get('/:userId/stats', (req, res, next) => {
  console.log('🛣️ [ROUTES] Stats route hit with params:', req.params);
  next();
}, auth, MatchController.getMatchStats);

// Location route
router.get('/:userId/location', (req, res, next) => {
  console.log('🛣️ [ROUTES] Location route hit with params:', req.params);
  next();
}, auth, MatchController.getLocationMatches);

// Potential matches route
router.get('/:userId/potential', (req, res, next) => {
  console.log('🛣️ [ROUTES] Potential route hit with params:', req.params);
  next();
}, auth, MatchController.getPotentialMatches);

// Generic route (MUST be last)
router.get('/:userId', (req, res, next) => {
  console.log('🛣️ [ROUTES] Generic matches route hit with params:', req.params);
  next();
}, auth, MatchController.getMatchedFriends);

// POST routes
router.post('/', auth, MatchController.createMatch);
router.post('/:userId/swipe', auth, MatchController.recordSwipe);

// DELETE routes
router.delete('/:userId/unmatch/:matchedUserId', auth, MatchController.unmatchUsers);

console.log('🛣️ [ROUTES] All match routes registered');

module.exports = router;
