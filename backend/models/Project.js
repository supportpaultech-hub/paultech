const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Web Development'
  },
  clientName: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  },
  techStack: [{
    type: String
  }],
  liveUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
