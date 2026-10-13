const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Job', 'Internship'],
    default: 'Job'
  },
  location: {
    type: String,
    default: 'Jamshedpur / Remote'
  },
  experience: {
    type: String,
    default: '0-2 Years'
  },
  salary: {
    type: String,
    default: 'Best in Industry'
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
