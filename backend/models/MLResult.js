// backend/models/MLResult.js (Raw ML Output Storage)
const mongoose = require('mongoose');

const mlResultSchema = new mongoose.Schema({
  // Processing Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processType: {
    type: String,
    enum: ['personality_analysis', 'interest_categorization', 'compatibility_batch', 'recommendation_generation'],
    required: true
  },

  // ✅ Raw ML Outputs
  rawResults: {
    inputFeatures: mongoose.Schema.Types.Mixed, // Original input data
    modelOutput: mongoose.Schema.Types.Mixed,   // Raw model predictions
    processedOutput: mongoose.Schema.Types.Mixed, // Cleaned/transformed results
    metadata: {
      modelName: String,
      modelVersion: String,
      processingTime: Number,
      accuracy: Number,
      confidenceScores: [Number]
    }
  },

  // ✅ Processing Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    message: String,
    stack: String,
    code: String
  },

  // ✅ Batch Processing Info
  batchInfo: {
    batchId: String,
    totalUsers: Number,
    processedUsers: Number,
    estimatedTimeRemaining: Number
  },

  // Performance Metrics
  performanceMetrics: {
    memoryUsed: Number,
    cpuTime: Number,
    executionTime: Number,
    throughput: Number // results per second
  }

}, {
  timestamps: true
});

// ✅ Indexes for ML result queries
mlResultSchema.index({ userId: 1, processType: 1 });
mlResultSchema.index({ status: 1, createdAt: -1 });
mlResultSchema.index({ 'batchInfo.batchId': 1 });
mlResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

module.exports = mongoose.model('MLResult', mlResultSchema);
