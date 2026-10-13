const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    default: ''
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeEmail: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  checkInTime: {
    type: String // e.g. "09:30:15 AM"
  },
  checkOutTime: {
    type: String // e.g. "06:00:20 PM"
  },
  deviceTime: {
    type: String // e.g. browser device time string
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  distanceMeters: {
    type: Number
  },
  locationStatus: {
    type: String,
    default: 'Verified (Sakchi Office)'
  },
  status: {
    type: String,
    enum: ['Present', 'Checked Out'],
    default: 'Present'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
