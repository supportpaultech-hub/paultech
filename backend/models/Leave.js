const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
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
  designation: {
    type: String,
    default: 'Team Member'
  },
  img: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: 'General'
  },
  leaveType: {
    type: String,
    enum: ['Casual Leave', 'Sick Leave', 'Emergency Leave', 'Earned Leave', 'Maternity/Paternity Leave', 'Other'],
    default: 'Casual Leave'
  },
  startDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  endDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  totalDays: {
    type: Number,
    default: 1
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leave', leaveSchema);
