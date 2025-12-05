// backend/controllers/aiController.js
const tf = require('@tensorflow/tfjs');

class AIController {
  static async calculateCompatibility(profile1, profile2) {
    // Interest similarity using cosine similarity
    const interestScore = this.calculateInterestSimilarity(profile1, profile2);
    
    // Personality compatibility using Euclidean distance
    const personalityScore = this.calculatePersonalityCompatibility(profile1, profile2);
    
    // Combined weighted score
    const overallScore = (interestScore * 0.6) + (personalityScore * 0.4);
    
    return Math.round(overallScore * 100); // Percentage
  }
}
