// backend/routes/eventRoutes.js (Fixed Multer Import and Usage)
const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth1.js');
const upload = require('../middleware/upload');
const { handleMulterError } = upload;

// Create event with optional cover photo
router.post('/', auth, upload.single('coverPhoto'), handleMulterError, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      endDate,
      location,
      isVirtual,
      virtualLink,
      maxParticipants,
      minAge,
      maxAge,
      isPrivate,
      requiresApproval,
      tags
    } = req.body;

    const { userId } = req.user; // From auth middleware

    const Event = require('../models/Event');
    const eventData = {
      title,
      description,
      category,
      date: new Date(date),
      organizer: userId,
      location: location ? JSON.parse(location) : null,
      isVirtual: isVirtual === 'true',
      virtualLink,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      minAge: minAge ? parseInt(minAge) : 13,
      maxAge: maxAge ? parseInt(maxAge) : null,
      isPrivate: isPrivate === 'true',
      requiresApproval: requiresApproval === 'true',
      tags: tags ? JSON.parse(tags) : []
    };

    if (endDate) {
      eventData.endDate = new Date(endDate);
    }

    // Handle cover photo upload if provided
    if (req.file) {
      eventData.coverPhoto = {
        url: `/uploads/events/${req.file.filename}`,
        filename: req.file.filename,
        uploadedAt: new Date()
      };
    }

    const event = new Event(eventData);
    await event.save();

    // Populate organizer data for response
    await event.populate('organizer', 'firstName lastName primaryProfileImage');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    console.error('❌ Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// Get all events with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      city,
      date,
      status = 'upcoming',
      limit = 20,
      page = 1,
      search
    } = req.query;

    const Event = require('../models/Event');
    const filter = { status };

    // Apply filters
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDay };
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName primaryProfileImage')
      .populate('participants.user', 'firstName lastName primaryProfileImage')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalEvents = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalEvents / parseInt(limit)),
          totalEvents,
          hasNext: page * limit < totalEvents
        }
      }
    });

  } catch (error) {
    console.error('❌ Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get events',
      error: error.message
    });
  }
});

module.exports = router;
