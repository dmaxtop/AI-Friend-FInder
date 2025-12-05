// backend/services/mlService.js (ML Processing Service)
class MLService {
  
  // ✅ Analyze personality from user data
  static async analyzePersonality(userData) {
    try {
      console.log('🧠 Analyzing personality for user data...');

      // Simulate ML personality analysis (replace with actual ML model)
      const { bio, interests, age, occupation, education } = userData;

      // ✅ Text analysis of bio for personality traits
      const bioScore = this.analyzeBioText(bio || '');
      
      // ✅ Interest-based personality inference
      const interestScore = this.analyzeInterests(interests || []);
      
      // ✅ Demographic-based adjustments
      const demoScore = this.analyzeDemographics(age, occupation, education);

      // ✅ Combine scores with weights
      const personalityVector = {
        openness: Math.round((bioScore.openness * 0.4 + interestScore.openness * 0.4 + demoScore.openness * 0.2) * 10) / 10,
        conscientiousness: Math.round((bioScore.conscientiousness * 0.3 + demoScore.conscientiousness * 0.7) * 10) / 10,
        extraversion: Math.round((bioScore.extraversion * 0.5 + interestScore.extraversion * 0.3 + demoScore.extraversion * 0.2) * 10) / 10,
        agreeableness: Math.round((bioScore.agreeableness * 0.6 + interestScore.agreeableness * 0.4) * 10) / 10,
        neuroticism: Math.round((bioScore.neuroticism * 0.7 + demoScore.neuroticism * 0.3) * 10) / 10
      };

      // ✅ Calculate social score
      const socialScore = Math.round(
        (personalityVector.extraversion * 0.4 + 
         personalityVector.agreeableness * 0.3 + 
         (10 - personalityVector.neuroticism) * 0.3) * 10
      ) / 10;

      return {
        personalityVector,
        socialScore,
        confidence: 0.85,
        processingTime: Date.now()
      };

    } catch (error) {
      console.error('❌ Personality analysis error:', error);
      throw error;
    }
  }

  // ✅ Analyze bio text for personality indicators
  static analyzeBioText(bio) {
    const text = bio.toLowerCase();
    
    // ✅ Keyword-based personality analysis (simplified ML simulation)
    const personalityKeywords = {
      openness: ['creative', 'art', 'music', 'travel', 'adventure', 'explore', 'new', 'different'],
      conscientiousness: ['organized', 'plan', 'goal', 'work', 'professional', 'disciplined', 'responsible'],
      extraversion: ['social', 'people', 'party', 'friends', 'outgoing', 'energy', 'fun', 'meet'],
      agreeableness: ['kind', 'help', 'care', 'love', 'family', 'community', 'support', 'friendly'],
      neuroticism: ['stress', 'worry', 'anxiety', 'difficult', 'hard', 'challenge', 'struggle']
    };

    const scores = {};
    
    Object.keys(personalityKeywords).forEach(trait => {
      const keywords = personalityKeywords[trait];
      let score = 5; // Base score
      
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += trait === 'neuroticism' ? -0.5 : 0.5; // Neuroticism is reverse scored
        }
      });
      
      scores[trait] = Math.max(1, Math.min(10, score));
    });

    return scores;
  }

  // ✅ Analyze interests for personality traits
  static analyzeInterests(interests) {
    const interestCategories = {
      creative: ['art', 'music', 'writing', 'photography', 'design', 'painting'],
      social: ['dancing', 'parties', 'networking', 'volunteering', 'community'],
      intellectual: ['reading', 'science', 'philosophy', 'learning', 'research'],
      active: ['sports', 'hiking', 'gym', 'running', 'climbing', 'swimming'],
      technical: ['technology', 'coding', 'engineering', 'gaming', 'computers']
    };

    const categoryScores = {
      creative: 0,
      social: 0,
      intellectual: 0,
      active: 0,
      technical: 0
    };

    // ✅ Count interests in each category
    interests.forEach(interest => {
      const lowerInterest = interest.toLowerCase();
      Object.keys(interestCategories).forEach(category => {
        if (interestCategories[category].some(keyword => 
          lowerInterest.includes(keyword))) {
          categoryScores[category]++;
        }
      });
    });

    // ✅ Map categories to personality traits
    return {
      openness: Math.min(10, 5 + (categoryScores.creative * 0.8) + (categoryScores.intellectual * 0.6)),
      conscientiousness: Math.min(10, 5 + (categoryScores.technical * 0.5)),
      extraversion: Math.min(10, 5 + (categoryScories.social * 1.0) + (categoryScores.active * 0.4)),
      agreeableness: Math.min(10, 5 + (categoryScores.social * 0.6)),
      neuroticism: Math.max(1, 5 - (categoryScores.active * 0.3))
    };
  }

  // ✅ Demographic-based personality adjustments
  static analyzeDemographics(age, occupation, education) {
    const baseScores = {
      openness: 5,
      conscientiousness: 5,
      extraversion: 5,
      agreeableness: 5,
      neuroticism: 5
    };

    // ✅ Age-based adjustments
    if (age && age > 30) {
      baseScores.conscientiousness += 1;
      baseScores.neuroticism -= 0.5;
    }
    if (age && age < 25) {
      baseScores.openness += 1;
      baseScores.extraversion += 0.5;
    }

    // ✅ Occupation-based adjustments
    if (occupation) {
      const occLower = occupation.toLowerCase();
      if (occLower.includes('artist') || occLower.includes('creative')) {
        baseScores.openness += 2;
      }
      if (occLower.includes('manager') || occLower.includes('leader')) {
        baseScores.extraversion += 1;
        baseScores.conscientiousness += 1;
      }
      if (occLower.includes('engineer') || occLower.includes('developer')) {
        baseScores.conscientiousness += 1;
        baseScores.openness += 0.5;
      }
    }

    // Ensure scores stay within bounds
    Object.keys(baseScores).forEach(key => {
      baseScores[key] = Math.max(1, Math.min(10, baseScores[key]));
    });

    return baseScores;
  }

  // ✅ Categorize interests using ML
  static async categorizeInterests(interests) {
    const categories = {
      'Technology': ['programming', 'coding', 'tech', 'computers', 'ai', 'software'],
      'Sports': ['football', 'basketball', 'soccer', 'tennis', 'gym', 'fitness'],
      'Arts': ['music', 'painting', 'drawing', 'photography', 'design', 'art'],
      'Travel': ['travel', 'adventure', 'exploring', 'tourism', 'culture'],
      'Food': ['cooking', 'baking', 'food', 'cuisine', 'restaurants', 'wine'],
      'Entertainment': ['movies', 'tv', 'gaming', 'books', 'reading', 'netflix'],
      'Nature': ['hiking', 'camping', 'outdoors', 'environment', 'animals'],
      'Social': ['friends', 'networking', 'parties', 'community', 'volunteering']
    };

    const userCategories = [];
    
    interests.forEach(interest => {
      const lowerInterest = interest.toLowerCase();
      Object.keys(categories).forEach(category => {
        if (categories[category].some(keyword => 
          lowerInterest.includes(keyword)) && 
          !userCategories.includes(category)) {
          userCategories.push(category);
        }
      });
    });

    return {
      categories: userCategories,
      originalInterests: interests,
      confidence: 0.9
    };
  }

  // ✅ Calculate compatibility between two users
  static async calculateCompatibility(user1, user2) {
    try {
      console.log(`🔄 Calculating compatibility between ${user1.firstName} and ${user2.firstName}`);

      // ✅ Personality compatibility using cosine similarity
      const personalityScore = this.calculatePersonalityCompatibility(
        user1.personalityVector, 
        user2.personalityVector
      );

      // ✅ Interest similarity
      const interestScore = this.calculateInterestSimilarity(
        user1.interests || [], 
        user2.interests || []
      );

      // ✅ Demographic compatibility
      const demographicScore = this.calculateDemographicCompatibility(user1, user2);

      // ✅ Weighted overall score
      const overallScore = Math.round(
        (personalityScore * 0.4 + 
         interestScore * 0.35 + 
         demographicScore * 0.25) * 100
      ) / 100;

      return {
        overallScore: Math.round(overallScore),
        breakdown: {
          personalityMatch: {
            score: Math.round(personalityScore),
            details: {
              openness: Math.abs(user1.personalityVector.openness - user2.personalityVector.openness),
              conscientiousness: Math.abs(user1.personalityVector.conscientiousness - user2.personalityVector.conscientiousness),
              extraversion: Math.abs(user1.personalityVector.extraversion - user2.personalityVector.extraversion),
              agreeableness: Math.abs(user1.personalityVector.agreeableness - user2.personalityVector.agreeableness),
              neuroticism: Math.abs(user1.personalityVector.neuroticism - user2.personalityVector.neuroticism)
            }
          },
          interestSimilarity: {
            score: Math.round(interestScore),
            commonInterests: this.findCommonInterests(user1.interests || [], user2.interests || []),
            interestOverlap: this.calculateInterestOverlap(user1.interests || [], user2.interests || [])
          },
          demographicCompatibility: {
            ageCompatibility: this.calculateAgeCompatibility(user1.age, user2.age),
            locationCompatibility: this.calculateLocationCompatibility(user1.location, user2.location),
            educationCompatibility: this.calculateEducationCompatibility(user1.education, user2.education),
            occupationCompatibility: this.calculateOccupationCompatibility(user1.occupation, user2.occupation)
          }
        },
        modelInfo: {
          modelVersion: 'compatibility-v1.2.0',
          algorithmUsed: 'weighted_cosine_similarity',
          confidenceScore: 0.88,
          processingTime: Date.now(),
          featuresUsed: ['personality', 'interests', 'demographics']
        }
      };

    } catch (error) {
      console.error('❌ Compatibility calculation error:', error);
      throw error;
    }
  }

  // ✅ Calculate personality compatibility using cosine similarity
  static calculatePersonalityCompatibility(p1, p2) {
    if (!p1 || !p2) return 50;

    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    traits.forEach(trait => {
      const val1 = p1[trait] || 5;
      const val2 = p2[trait] || 5;
      
      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    });

    const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    return Math.max(0, Math.min(100, similarity * 100));
  }

  // ✅ Calculate interest similarity
  static calculateInterestSimilarity(interests1, interests2) {
    if (!interests1.length || !interests2.length) return 0;

    const commonInterests = this.findCommonInterests(interests1, interests2);
    const totalUniqueInterests = new Set([...interests1, ...interests2]).size;
    
    return Math.round((commonInterests.length / totalUniqueInterests) * 100);
  }

  // ✅ Find common interests between users
  static findCommonInterests(interests1, interests2) {
    const lowerInterests1 = interests1.map(i => i.toLowerCase());
    const lowerInterests2 = interests2.map(i => i.toLowerCase());
    
    return interests1.filter(interest => 
      lowerInterests2.includes(interest.toLowerCase())
    );
  }

  // ✅ Calculate interest overlap percentage
  static calculateInterestOverlap(interests1, interests2) {
    if (!interests1.length || !interests2.length) return 0;
    
    const common = this.findCommonInterests(interests1, interests2).length;
    const minInterests = Math.min(interests1.length, interests2.length);
    
    return Math.round((common / minInterests) * 100);
  }

  // ✅ Helper methods for demographic compatibility
  static calculateAgeCompatibility(age1, age2) {
    if (!age1 || !age2) return 50;
    const ageDiff = Math.abs(age1 - age2);
    return Math.max(0, 100 - (ageDiff * 5)); // 5 points deduction per year difference
  }

  static calculateLocationCompatibility(loc1, loc2) {
    if (!loc1 || !loc2) return 50;
    // Simple string similarity (replace with actual geographic distance)
    return loc1.toLowerCase() === loc2.toLowerCase() ? 100 : 30;
  }

  static calculateEducationCompatibility(edu1, edu2) {
    if (!edu1 || !edu2) return 50;
    // Simple education level matching
    const levels = ['high school', 'bachelor', 'master', 'phd'];
    const level1 = levels.findIndex(l => edu1.toLowerCase().includes(l));
    const level2 = levels.findIndex(l => edu2.toLowerCase().includes(l));
    
    if (level1 === -1 || level2 === -1) return 50;
    
    const diff = Math.abs(level1 - level2);
    return Math.max(30, 100 - (diff * 20));
  }

  static calculateOccupationCompatibility(occ1, occ2) {
    if (!occ1 || !occ2) return 50;
    // Simple occupation similarity
    return occ1.toLowerCase() === occ2.toLowerCase() ? 100 : 60;
  }

  // ✅ Additional utility methods
  static async getLocationEmbedding(location) {
    // Simulate location embedding (replace with actual geo-encoding)
    if (!location) return [0, 0];
    
    const hash = location.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return [Math.sin(hash) * 100, Math.cos(hash) * 100];
  }

  static getAgeGroup(age) {
    if (!age) return 'unknown';
    if (age < 25) return 'young_adult';
    if (age < 35) return 'adult';
    if (age < 50) return 'middle_age';
    return 'senior';
  }

  static getEducationLevel(education) {
    if (!education) return 5;
    const edu = education.toLowerCase();
    if (edu.includes('phd') || edu.includes('doctorate')) return 10;
    if (edu.includes('master')) return 8;
    if (edu.includes('bachelor') || edu.includes('degree')) return 6;
    if (edu.includes('college') || edu.includes('university')) return 5;
    return 3;
  }
}

module.exports = MLService;
