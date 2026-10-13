const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  message: {
    type: String,
    default: 'Welcome to PaulTech Software Services! Custom Enterprise & Cloud Solutions.'
  },
  priority: {
    type: String,
    enum: ['orange', 'red', 'blue', 'green'],
    default: 'orange'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
