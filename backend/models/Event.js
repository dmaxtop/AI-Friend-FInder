// backend/models/Event.js (New Event model)
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Event Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['Social', 'Sports', 'Arts', 'Technology', 'Food', 'Travel', 'Education', 'Entertainment', 'Other'],
    default: 'Social'
  },

  // Event Details
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  location: {
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualLink: {
    type: String
  },

  // ✅ Event Images
  coverPhoto: {
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  eventImages: [{
    url: String,
    filename: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Event Management
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  minAge: {
    type: Number,
    default: 13
  },
  maxAge: {
    type: Number,
    default: null
  },

  // ✅ Participants and RSVP
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    rsvpStatus: {
      type: String,
      enum: ['going', 'maybe', 'not_going'],
      default: 'going'
    }
  }],

  // Event Status
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },

  // Tags for better discovery
  tags: [String],

  // Event Statistics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Virtual fields
eventSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

eventSchema.virtual('isPastEvent').get(function() {
  return this.date < new Date();
});

// ✅ Indexes for efficient querying
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ 'location.city': 1, date: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ participants: 1 });
eventSchema.index({ tags: 1 });

module.exports = mongoose.model('Event', eventSchema);
