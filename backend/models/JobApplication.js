const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  candidateEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  candidatePhone: {
    type: String,
    required: true,
    trim: true
  },
  mode: {
    type: String,
    enum: ['Offline', 'Online'],
    default: 'Offline'
  },
  domain: {
    type: String,
    default: 'MERN stack'
  },
  duration: {
    type: Number,
    default: 2
  },
  joining_date: {
    type: Date,
    default: Date.now
  },
  college: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: 'Fresher'
  },
  coverNote: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    required: true
  },
  localResumePath: {
    type: String,
    default: ''
  },
  registrationFee: {
    type: Number,
    default: 1000
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Exempted'],
    default: 'Completed'
  },
  paymentId: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: 'UPI / Online Gateway'
  },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  offerLetterSent: {
    type: Boolean,
    default: false
  },
  offerLetterSentAt: {
    type: Date
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
