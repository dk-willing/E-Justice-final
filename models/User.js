const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['CITIZEN', 'LAWYER'] },
  specialization: { type: String },
  experience: { type: Number },
  licenseNumber: { type: String },
  verificationDocument: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
