const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateNo: { type: String, required: true, unique: true, index: true },
  candidateName: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  domain: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  issueDate: { type: Date, default: Date.now },
  duration: { type: String, default: '3 Months' },
  grade: { type: String, default: 'A' },
  status: { type: String, default: 'VERIFIED' },
  created_at: { type: Date, default: Date.now }
});

// Virtual ID transformation for frontend consistency
certificateSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    converted.id = converted._id;
    delete converted._id;
    delete converted.__v;
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
