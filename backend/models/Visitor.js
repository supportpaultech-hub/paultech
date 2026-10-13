const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: { type: Number, default: 1248 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
