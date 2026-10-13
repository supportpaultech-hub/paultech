const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// Get all events (Public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Event (Admin)
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Event (Admin)
exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Event (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for Event (Public)
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email, phone, paymentStatus, paymentId } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if event date has passed or status is Completed
    const now = new Date();
    let isPast = event.status === 'Completed';
    if (!isPast && event.date) {
      const eventDate = new Date(event.date.includes('T') ? event.date : event.date + 'T23:59:59');
      if (!isNaN(eventDate.getTime()) && now > eventDate) {
        isPast = true;
      }
    }

    if (isPast) {
      return res.status(400).json({ error: 'Registration closed. This event has ended.' });
    }

    if (event.registeredCount >= event.totalSeats) {
      return res.status(400).json({ error: 'Registration closed. All seats are booked!' });
    }

    const newRegistration = new EventRegistration({
      eventId,
      eventTitle: event.title,
      name,
      email,
      phone,
      paymentStatus: event.priceType === 'Free' ? 'Free' : (paymentStatus || 'Completed'),
      paymentId
    });

    await newRegistration.save();

    // Increment registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      message: 'Registration successful!',
      meetingLink: event.meetingLink,
      registration: newRegistration
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Registrations for an Event (Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
