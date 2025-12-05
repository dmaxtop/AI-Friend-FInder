// backend/controllers/eventController.js (New Event Controller)
const Event = require('../models/Event');
const User = require('../models/User');

class EventController {

  // ✅ Create new event
  static async createEvent(req, res) {
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

      const eventData = {
        title,
        description,
        category,
        date: new Date(date),
        organizer: userId,
        location,
        isVirtual,
        virtualLink,
        maxParticipants,
        minAge,
        maxAge,
        isPrivate,
        requiresApproval,
        tags: tags || []
      };

      if (endDate) {
        eventData.endDate = new Date(endDate);
      }

      // ✅ Handle cover photo upload if provided
      if (req.file) {
        eventData.coverPhoto = {
          url: `/uploads/events/${req.file.filename}`,
          filename: req.file.filename,
          uploadedAt: new Date()
        };
      }

      const event = new Event(eventData);
      await event.save();

      // ✅ Populate organizer data for response
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
  }

  // ✅ Get all events with filters
  static async getEvents(req, res) {
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

      const filter = { status };

      // ✅ Apply filters
      if (category) filter.category = category;
      if (city) filter['location.city'] = new RegExp(city, 'i');
      if (date) {
        const selectedDate = new Date(date);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date = { $gte: selectedDate, $lt: nextDay };
      }

      // ✅ Search functionality
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
  }

  // ✅ Join an event
  static async joinEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { userId } = req.user; // From auth middleware
      const { rsvpStatus = 'going' } = req.body;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // ✅ Check if user already joined
      const existingParticipant = event.participants.find(p => p.user.toString() === userId);
      if (existingParticipant) {
        return res.status(400).json({
          success: false,
          message: 'User already joined this event'
        });
      }

      // ✅ Check capacity
      if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Event is at full capacity'
        });
      }

      // ✅ Check age restrictions
      const user = await User.findById(userId);
      if (event.minAge && user.age < event.minAge) {
        return res.status(400).json({
          success: false,
          message: `Minimum age requirement: ${event.minAge}`
        });
      }
      if (event.maxAge && user.age > event.maxAge) {
        return res.status(400).json({
          success: false,
          message: `Maximum age limit: ${event.maxAge}`
        });
      }

      // ✅ Add participant
      event.participants.push({
        user: userId,
        joinedAt: new Date(),
        rsvpStatus
      });

      // ✅ Add event to user's joined events
      if (!user.joinedEvents.includes(eventId)) {
        user.joinedEvents.push(eventId);
        await user.save();
      }

      await event.save();

      // ✅ Populate for response
      await event.populate('participants.user', 'firstName lastName primaryProfileImage');

      res.status(200).json({
        success: true,
        message: 'Successfully joined event',
        data: {
          event,
          participantCount: event.participantCount
        }
      });

    } catch (error) {
      console.error('❌ Join event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to join event',
        error: error.message
      });
    }
  }

  // ✅ Leave an event
  static async leaveEvent(req, res) {
    try {
      const { eventId } = req.params;
      const { userId } = req.user;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // ✅ Remove participant
      event.participants = event.participants.filter(p => p.user.toString() !== userId);

      // ✅ Remove from user's joined events
      const user = await User.findById(userId);
      user.joinedEvents = user.joinedEvents.filter(e => e.toString() !== eventId);
      
      await event.save();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Successfully left event',
        data: {
          participantCount: event.participantCount
        }
      });

    } catch (error) {
      console.error('❌ Leave event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to leave event',
        error: error.message
      });
    }
  }

  // ✅ Get events user has joined
  static async getUserEvents(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId)
        .populate({
          path: 'joinedEvents',
          populate: {
            path: 'organizer',
            select: 'firstName lastName primaryProfileImage'
          }
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          events: user.joinedEvents,
          totalEvents: user.joinedEvents.length
        }
      });

    } catch (error) {
      console.error('❌ Get user events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user events',
        error: error.message
      });
    }
  }
}

module.exports = EventController;
