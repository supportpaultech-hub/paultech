const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  plainPassword: { type: String },
  role: { type: String, enum: ['ADMIN', 'DEVELOPER', 'EMPLOYEE'], required: true },
  
  // IT Employee specific fields
  employeeId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  designation: { type: String },
  department: { type: String },
  experience: { type: String },
  phone: { type: String },
  education: { type: String },
  skills: { type: [String] },
  img: { type: String }
});

module.exports = mongoose.model('User', userSchema);
