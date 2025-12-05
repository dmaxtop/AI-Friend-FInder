// backend/services/realTimeService.js (Real-time Data Updates)
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const User = require('../models/User');
const CompatibilityScore = require('../models/CompatibilityScore');
const MLResult = require('../models/MLResult');

class RealTimeService {
  constructor(server) {
    // ✅ Initialize Socket.IO for real-time updates
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketHandlers();
    this.setupChangeStreams();
  }

  // ✅ Setup Socket.IO connection handlers
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      // ✅ Handle user joining their personal room
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`👤 User ${userId} joined their room`);
      });

      // ✅ Handle ML processing requests
      socket.on('request-ml-processing', async (data) => {
        const { userId, processType } = data;
        console.log(`🤖 ML processing requested for user ${userId}: ${processType}`);
        
        socket.emit('ml-processing-started', { 
          userId, 
          processType, 
          message: 'ML processing started...' 
        });
      });

      // ✅ Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });
  }

  // ✅ Setup MongoDB Change Streams for real-time updates
  setupChangeStreams() {
    // ✅ Watch User changes
    this.watchUserChanges();
    
    // ✅ Watch CompatibilityScore changes
    this.watchCompatibilityChanges();
    
    // ✅ Watch MLResult changes
    this.watchMLResultChanges();
  }

  // ✅ Watch User collection changes
  watchUserChanges() {
    try {
      const userChangeStream = User.watch([
        {
          $match: {
            'operationType': { $in: ['update', 'replace'] },
            'updateDescription.updatedFields.mlProcessingStatus': { $exists: true }
          }
        }
      ]);

      userChangeStream.on('change', (change) => {
        console.log('👤 User ML status changed:', change.documentKey._id);
        
        const userId = change.documentKey._id.toString();
        
        // ✅ Emit to user's room
        this.io.to(`user-${userId}`).emit('ml-status-updated', {
          userId,
          status: change.updateDescription?.updatedFields?.mlProcessingStatus,
          timestamp: new Date()
        });
      });

    } catch (error) {
      console.error('❌ Error setting up user change stream:', error);
    }
  }

  // ✅ Watch CompatibilityScore changes
  watchCompatibilityChanges() {
    try {
      const compatibilityChangeStream = CompatibilityScore.watch([
        {
          $match: {
            'operationType': { $in: ['insert', 'update', 'replace'] }
          }
        }
      ]);

      compatibilityChangeStream.on('change', async (change) => {
        console.log('💕 Compatibility score changed:', change.documentKey._id);
        
        try {
          // ✅ Get the updated compatibility score with user data
          const compatibilityScore = await CompatibilityScore.findById(change.documentKey._id)
            .populate('user1', 'firstName lastName')
            .populate('user2', 'firstName lastName');

          if (compatibilityScore) {
            const user1Id = compatibilityScore.user1._id.toString();
            const user2Id = compatibilityScore.user2._id.toString();

            // ✅ Emit to both users
            this.io.to(`user-${user1Id}`).emit('compatibility-updated', {
              compatibilityId: compatibilityScore._id,
              partnerId: user2Id,
              partnerName: `${compatibilityScore.user2.firstName} ${compatibilityScore.user2.lastName}`,
              overallCompatibility: compatibilityScore.overallCompatibility,
              breakdown: compatibilityScore.compatibilityBreakdown,
              timestamp: new Date()
            });

            this.io.to(`user-${user2Id}`).emit('compatibility-updated', {
              compatibilityId: compatibilityScore._id,
              partnerId: user1Id,
              partnerName: `${compatibilityScore.user1.firstName} ${compatibilityScore.user1.lastName}`,
              overallCompatibility: compatibilityScore.overallCompatibility,
              breakdown: compatibilityScore.compatibilityBreakdown,
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.error('❌ Error processing compatibility change:', error);
        }
      });

    } catch (error) {
      console.error('❌ Error setting up compatibility change stream:', error);
    }
  }

  // ✅ Watch MLResult changes
  watchMLResultChanges() {
    try {
      const mlResultChangeStream = MLResult.watch([
        {
          $match: {
            'operationType': { $in: ['insert', 'update'] },
            'fullDocument.status': { $in: ['completed', 'failed'] }
          }
        }
      ]);

      mlResultChangeStream.on('change', (change) => {
        console.log('🤖 ML result changed:', change.documentKey._id);
        
        const mlResult = change.fullDocument;
        const userId = mlResult.userId.toString();

        // ✅ Emit ML processing completion to user
        this.io.to(`user-${userId}`).emit('ml-processing-completed', {
          mlResultId: mlResult._id,
          processType: mlResult.processType,
          status: mlResult.status,
          error: mlResult.error,
          results: mlResult.status === 'completed' ? mlResult.rawResults?.processedOutput : null,
          timestamp: new Date()
        });

        // ✅ If batch processing, emit progress updates
        if (mlResult.batchInfo?.batchId) {
          this.io.emit('batch-processing-progress', {
            batchId: mlResult.batchInfo.batchId,
            totalUsers: mlResult.batchInfo.totalUsers,
            processedUsers: mlResult.batchInfo.processedUsers,
            progress: Math.round((mlResult.batchInfo.processedUsers / mlResult.batchInfo.totalUsers) * 100)
          });
        }
      });

    } catch (error) {
      console.error('❌ Error setting up ML result change stream:', error);
    }
  }

  // ✅ Manual emit methods for specific events
  emitCompatibilityUpdate(userId, compatibilityData) {
    this.io.to(`user-${userId}`).emit('compatibility-updated', compatibilityData);
  }

  emitMLProcessingStart(userId, processType) {
    this.io.to(`user-${userId}`).emit('ml-processing-started', {
      userId,
      processType,
      timestamp: new Date()
    });
  }

  emitBatchProgress(batchId, progress) {
    this.io.emit('batch-processing-progress', {
      batchId,
      progress,
      timestamp: new Date()
    });
  }

  // ✅ Broadcast system-wide updates
  broadcastSystemUpdate(message, data = {}) {
    this.io.emit('system-update', {
      message,
      data,
      timestamp: new Date()
    });
  }
}

module.exports = RealTimeService;
