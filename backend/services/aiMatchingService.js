// backend/services/aiMatchingService.js (Browser TensorFlow version - corrected)
//const tf = require('@tensorflow/tfjs');
const User = require('../models/User');

class AIMatchingService {
  constructor() {
    this.model = null;
    console.log('🤖 AIMatchingService initialized with browser TensorFlow');
  }

  // Calculate similarity between two interest arrays
  calculateInterestSimilarity(interests1, interests2) {
    if (!interests1 || !interests2 || interests1.length === 0 || interests2.length === 0) {
      return 0;
    }
    const shared = interests1.filter(interest => interests2.includes(interest));
    const total = new Set([...interests1, ...interests2]).size;
    return shared.length / total;
  }
  
  // Ultra-enhanced location similarity with multiple matching strategies
  calculateLocationSimilarity(location1, location2) {
  if (!location1 || !location2) return 0.2;

  const loc1 = location1.toLowerCase().trim();
  const loc2 = location2.toLowerCase().trim();

  // Exact match
  if (loc1 === loc2) return 1.0;

  // Split into parts
  const loc1Parts = loc1.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const loc2Parts = loc2.split(',').map(p => p.trim()).filter(p => p.length > 0);

  // ✅ Strategy 1: Cross-match - any part contains another part
  const crossMatch = loc1Parts.some(part1 => 
    loc2Parts.some(part2 => {
      if (part1 === part2) return true;  // Exact part match
      if (part1.includes(part2) && part2.length > 2) return true;  // part2 is contained in part1
      if (part2.includes(part1) && part1.length > 2) return true;  // part1 is contained in part2
      return false;
    })
  );

  if (crossMatch) return 0.6;

  // ✅ Strategy 2: Word-level matching within parts
  const allWords1 = loc1Parts.flatMap(part => part.split(' ')).filter(w => w.length > 2);
  const allWords2 = loc2Parts.flatMap(part => part.split(' ')).filter(w => w.length > 2);
  
  const wordMatch = allWords1.some(word1 => 
    allWords2.some(word2 => word1 === word2)
  );

  if (wordMatch) return 0.6;

  // ✅ Strategy 3: Substring matching for similar spellings
  const substringMatch = loc1Parts.some(part1 => 
    loc2Parts.some(part2 => {
      if (part1.length > 3 && part2.length > 3) {
        return part1.includes(part2.substring(0, 3)) || 
               part2.includes(part1.substring(0, 3));
      }
      return false;
    })
  );

  if (substringMatch) return 0.4;

  // ✅ Strategy 4: Original exact common parts
  const commonParts = loc1Parts.filter(part => loc2Parts.includes(part));
  return commonParts.length > 0 ? 0.6 : 0.2;
  }

  // Calculate age compatibility
  calculateAgeCompatibility(age1, age2) {
    if (!age1 || !age2) return 0.5;
    const ageDiff = Math.abs(age1 - age2);
    if (ageDiff <= 2) return 1.0;
    if (ageDiff <= 5) return 0.8;
    if (ageDiff <= 10) return 0.6;
    return 0.3;
  }

  // Calculate occupation similarity
  calculateOccupationSimilarity(occ1, occ2) {
    if (!occ1 || !occ2) return 0.3;

    const occupation1 = occ1.toLowerCase();
    const occupation2 = occ2.toLowerCase();

    if (occupation1 === occupation2) return 1.0;

    // Enhanced occupation categories for Bangladesh job market
const techWords = [
  // Software & Development
  'developer', 'engineer', 'programmer', 'software', 'tech', 'it', 'system', 'network', 'database',
  'web developer', 'mobile developer', 'full stack', 'frontend', 'backend', 'devops', 'cloud',
  'data scientist', 'data analyst', 'business intelligence', 'machine learning', 'ai', 'artificial intelligence',
  'cybersecurity', 'security analyst', 'penetration tester', 'ethical hacker',
  'quality assurance', 'qa engineer', 'tester', 'automation',
  'ui designer', 'ux designer', 'product manager', 'scrum master',
  'technical writer', 'systems analyst', 'it support', 'helpdesk',
  // Bangladesh-specific IT roles
  'computer operator', 'data entry', 'mis', 'erp', 'crm'
];

const businessWords = [
  // Management & Leadership
  'manager', 'analyst', 'consultant', 'executive', 'coordinator', 'supervisor', 'director', 'ceo', 'cfo', 'coo',
  'team leader', 'project manager', 'operations manager', 'general manager', 'assistant manager',
  // Sales & Marketing  
  'sales', 'marketing', 'business development', 'account executive', 'relationship manager',
  'digital marketing', 'seo', 'sem', 'social media', 'content marketing', 'brand manager',
  // Finance & Accounting
  'accountant', 'auditor', 'cashier', 'finance', 'treasury', 'tax', 'budget', 'investment',
  'financial analyst', 'credit analyst', 'loan officer', 'insurance', 'actuarial',
  // Human Resources
  'hr', 'human resource', 'recruitment', 'talent acquisition', 'training', 'compensation',
  'employee relations', 'organizational development', 'payroll',
  // Bangladesh-specific business roles
  'administrative officer', 'executive officer', 'assistant', 'clerk', 'receptionist',
  'customer service', 'call center', 'bpo', 'outsourcing'
];

const creativeWords = [
  // Design & Visual Arts
  'designer', 'graphic designer', 'web designer', 'fashion designer', 'interior designer',
  'architect', 'urban planner', 'landscape architect', 'product designer',
  'artist', 'illustrator', 'animator', 'visual effects', 'motion graphics',
  // Media & Communication
  'writer', 'content writer', 'copywriter', 'editor', 'proofreader',
  'journalist', 'reporter', 'correspondent', 'news anchor', 'broadcaster',
  'photographer', 'videographer', 'cinematographer', 'video editor',
  'creative director', 'art director', 'brand designer',
  // Bangladesh-specific creative roles
  'cultural officer', 'event organizer', 'wedding planner', 'decorator',
  'handicrafts', 'traditional artist', 'folk artist'
];

const healthWords = [
  // Medical Professionals
  'doctor', 'physician', 'surgeon', 'neurosurgeon', 'cardiologist', 'pediatrician',
  'psychiatrist', 'dermatologist', 'orthopedic', 'gynecologist', 'urologist',
  'nurse', 'nursing', 'midwife', 'paramedic', 'medical assistant',
  'pharmacist', 'pharmacy', 'pharmaceutical', 'clinical pharmacist',
  // Allied Health
  'therapist', 'physiotherapist', 'occupational therapist', 'speech therapist',
  'psychologist', 'counselor', 'social worker', 'mental health',
  'dentist', 'dental', 'orthodontist', 'oral surgeon',
  'veterinarian', 'veterinary', 'animal health',
  // Public Health & Medical Support
  'medical', 'health', 'healthcare', 'public health', 'epidemiologist',
  'medical technologist', 'lab technician', 'radiology', 'pathologist',
  // Bangladesh-specific health roles
  'medical officer', 'health inspector', 'family welfare', 'community health',
  'traditional healer', 'homeopathic', 'ayurvedic', 'unani'
];

// Additional Bangladesh-specific categories
const educationWords = [
  'teacher', 'professor', 'lecturer', 'instructor', 'tutor', 'educator',
  'principal', 'headmaster', 'academic coordinator', 'curriculum developer',
  'research', 'researcher', 'scientist', 'scholar', 'librarian',
  'training officer', 'education officer', 'academic advisor'
];

const publicServiceWords = [
  // Government & Civil Service
  'government', 'civil service', 'public service', 'administrative service',
  'bcs', 'cadre', 'magistrate', 'commissioner', 'secretary',
  'deputy commissioner', 'upazila', 'union parishad', 'municipality',
  // Law & Justice
  'lawyer', 'advocate', 'barrister', 'solicitor', 'legal advisor', 'judge',
  'police', 'detective', 'security', 'intelligence', 'customs', 'immigration',
  // Defense & Security
  'army', 'navy', 'air force', 'military', 'defense', 'coast guard',
  'ansar', 'rab', 'border guard', 'fire service'
];

const agricultureWords = [
  'agriculture', 'farming', 'farmer', 'agricultural officer', 'agronomy',
  'fisheries', 'fishery', 'aquaculture', 'livestock', 'dairy',
  'forestry', 'horticulture', 'plant pathology', 'soil science',
  'agricultural extension', 'rural development', 'cooperative'
];

const manufacturingWords = [
  // Textiles & Garments (major BD industry)
  'garments', 'textile', 'apparel', 'fashion', 'merchandising',
  'quality controller', 'production manager', 'industrial engineer',
  'factory manager', 'supervisor', 'operator', 'technician',
  // Other Manufacturing
  'manufacturing', 'production', 'quality control', 'maintenance',
  'mechanical', 'electrical', 'civil engineering', 'chemical',
  'pharmaceuticals', 'leather', 'jute', 'ceramic', 'steel'
];

const serviceWords = [
  // Hospitality & Tourism
  'hotel', 'restaurant', 'tourism', 'travel', 'hospitality',
  'chef', 'cook', 'waiter', 'bartender', 'housekeeping',
  'tour guide', 'travel agent', 'event management',
  // Transportation & Logistics
  'driver', 'transport', 'logistics', 'supply chain', 'warehouse',
  'shipping', 'freight', 'courier', 'delivery',
  // Banking & Financial Services
  'bank', 'banking', 'financial services', 'microcredit', 'ngo',
  'development', 'social work', 'community development'
];

    const getCategory = (occ) => {
      if (techWords.some(word => occupation.includes(word))) return 'tech';
      if (businessWords.some(word => occupation.includes(word))) return 'business';  
      if (creativeWords.some(word => occupation.includes(word))) return 'creative';
      if (healthWords.some(word => occupation.includes(word))) return 'health';
      if (educationWords.some(word => occupation.includes(word))) return 'education';
      if (publicServiceWords.some(word => occupation.includes(word))) return 'public_service';
      if (agricultureWords.some(word => occupation.includes(word))) return 'agriculture';
      if (manufacturingWords.some(word => occupation.includes(word))) return 'manufacturing';
      if (serviceWords.some(word => occupation.includes(word))) return 'service';
      return 'other';
    };

    return getCategory(occupation1) === getCategory(occupation2) ? 0.7 : 0.2;
  }

  // Simple text similarity without ML models
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    return commonWords.length / totalWords;
  }
  // Find users who have swiped on the current user (overlapping swipe history)
async findRecentMutualSwipes(userId) {
  try {
    console.log('🔍 Finding recent mutual swipes for user:', userId);

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      console.error('❌ Current user not found:', userId);
      return [];
    }

    // Get other active users except current user
    const otherUsers = await User.find({
      _id: { $ne: userId },
      isActive: true
    }).select('firstName lastName swipeHistory');

    const recentMatches = [];

    for (const user of otherUsers) {
      // Check if this user swiped on the current user
      const swipedOnCurrentUser = user.swipeHistory.some(
        swipe => swipe.targetUser.toString() === userId
      );

      // Optional: You can add more filters, like only 'like' or 'super_like' actions
      if (swipedOnCurrentUser) {
        recentMatches.push(user);
      }
    }

    console.log(`✅ Found ${recentMatches.length} users with overlapping swipe history`);

    return recentMatches;
  } catch (error) {
    console.error('❌ Error finding recent mutual swipes:', error);
    return [];
  }
}

  // Main matching algorithm
  async findMatches(userId) {
    try {
      console.log('🔍 Finding matches for user:', userId);

      const currentUser = await User.findById(userId);
      if (!currentUser) {
        console.error('❌ Current user not found:', userId);
        return [];
      }

      // Get other active users, include thingsILove and notMyThing for frontend favorites
      const otherUsers = await User.find({
        _id: { $ne: userId },
        isActive: true
      }).select(
        'firstName lastName age location occupation interests bio profileImages primaryProfileImage thingsILove notMyThing personalityType personalityTraits personalityDescription communicationCompatibility lifestyleCompatibility'
      );

      console.log(`👥 Found ${otherUsers.length} potential matches to analyze`);

      const matches = [];

      for (const user of otherUsers) {
        try {
          // Individual similarity components
          const interestSimilarity = this.calculateInterestSimilarity(
            currentUser.interests || [],
            user.interests || []
          );
          const locationSimilarity = this.calculateLocationSimilarity(
            currentUser.location,
            user.location
          );
          const ageCompatibility = this.calculateAgeCompatibility(
            currentUser.age,
            user.age
          );
          const occupationSimilarity = this.calculateOccupationSimilarity(
            currentUser.occupation,
            user.occupation
          );
          const bioSimilarity = this.calculateTextSimilarity(
            currentUser.bio,
            user.bio
          );

          // Weighted combined score
          const combinedScore =
            (interestSimilarity * 0.40) +
            (locationSimilarity * 0.25) +
            (ageCompatibility * 0.15) +
            (occupationSimilarity * 0.10) +
            (bioSimilarity * 0.10);

          console.log(
            `📊 ${user.firstName}: interests=${interestSimilarity.toFixed(2)}, location=${locationSimilarity.toFixed(2)}, age=${ageCompatibility.toFixed(2)}, occupation=${occupationSimilarity.toFixed(2)}, bio=${bioSimilarity.toFixed(2)}, final=${combinedScore.toFixed(2)}`
          );

          // Keep everything above non-zero
          if (combinedScore > 0.0) {
            const sharedInterests = (currentUser.interests || []).filter(interest =>
              (user.interests || []).includes(interest)
            );

            matches.push({
              user,
              similarityScore: combinedScore,

              // Five individual metrics returned explicitly
              interestSimilarity,
              locationSimilarity,
              ageCompatibility,
              occupationSimilarity,
              bioSimilarity,

              // Also return a breakdown object
              breakdown: {
                interests: interestSimilarity,
                location: locationSimilarity,
                age: ageCompatibility,
                occupation: occupationSimilarity,
                bio: bioSimilarity
              },

              // Useful for the UI/controller
              sharedInterests,
              sharedEvents: []
            });
          }
        } catch (userError) {
          console.error('❌ Error processing user:', user._id, userError.message);
        }
      }

      // Sort by similarity score (highest first)
      matches.sort((a, b) => b.similarityScore - a.similarityScore);

      const topMatches = matches.slice(0, 10);
      console.log(`✅ Returning ${topMatches.length} top matches`);

      // Debug to ensure favorites fields are present for controller mapping
      topMatches.forEach((m, i) => {
        console.log('🧪 match.user fields', i, {
          id: m.user?._id?.toString(),
          il: Array.isArray(m.user?.thingsILove) ? m.user.thingsILove.length : 'missing',
          nm: Array.isArray(m.user?.notMyThing) ? m.user.notMyThing.length : 'missing'
        });
      });

      return topMatches;
    } catch (error) {
      console.error('❌ Error in findMatches:', error);
      return [];
    }
  }

  // Generate match explanation
  generateMatchReason(match) {
    const reasons = [];
    const breakdown = match.breakdown;

    if (breakdown.interests > 0.6) {
      reasons.push(`Strong shared interests (${Math.round(breakdown.interests * 100)}%)`);
    } else if (breakdown.interests > 0.3) {
      reasons.push(`Some common interests (${Math.round(breakdown.interests * 100)}%)`);
    }

    if (breakdown.location > 0.8) {
      reasons.push('Same location');
    } else if (breakdown.location > 0.5) {
      reasons.push('Similar location');
    }

    if (breakdown.age > 0.8) {
      reasons.push('Similar age');
    }

    if (breakdown.occupation > 0.6) {
      reasons.push('Related profession');
    }

    const scoreCategory = match.similarityScore >= 0.8 ? 'Excellent' :
                          match.similarityScore >= 0.6 ? 'Great' :
                          match.similarityScore >= 0.4 ? 'Good' : 'Fair';

    reasons.push(`${scoreCategory} overall compatibility (${Math.round(match.similarityScore * 100)}%)`);

    return reasons.length > 0 ? reasons.join(' • ') : `${Math.round(match.similarityScore * 100)}% compatibility`;
  }
}

module.exports = new AIMatchingService();
