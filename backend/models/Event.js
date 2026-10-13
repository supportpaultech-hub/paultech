const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  eventType: { 
    type: String, 
    enum: ['Webinar', 'Bootcamp', 'Workshop', 'Live Class'], 
    default: 'Webinar' 
  },
  date: { type: String, required: true }, // e.g. "2026-10-15"
  time: { type: String, required: true }, // e.g. "07:00 PM IST"
  duration: { type: String, default: '2 Hours' }, // e.g. "2 Hours" or "3 Days"
  priceType: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
  price: { type: Number, default: 0 },
  platform: { type: String, default: 'Google Meet' },
  meetingLink: { type: String, required: true },
  bannerImage: { 
    type: String, 
    default: '' 
  },
  totalSeats: { type: Number, default: 100 },
  registeredCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Upcoming', 'Live', 'Completed'], default: 'Upcoming' },
  isPopup: { type: Boolean, default: false },
  popupDurationType: { 
    type: String, 
    enum: ['always', 'until_event', 'until_date'], 
    default: 'always' 
  },
  popupEndDate: { type: String, default: '' },
  popupFrequency: { 
    type: String, 
    enum: ['session', 'always', 'once_daily'], 
    default: 'session' 
  },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
