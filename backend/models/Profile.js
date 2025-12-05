// backend/models/Profile.js
const profileSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User' },
  interests: [String],  // ["music", "travel", "technology"]
  personality: {
    openness: Number,      // 1-10 scale
    conscientiousness: Number,
    extraversion: Number,
    agreeableness: Number,
    neuroticism: Number
  },
  preferences: {
    ageRange: { min: Number, max: Number },
    maxDistance: Number,
    minCompatibility: Number
  }
});
