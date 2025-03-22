const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: { type: String },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['CITIZEN', 'LAWYER'],
    required: true,
  },
  specialization: { type: String },
  experience: { type: Number },
  licenseNumber: { type: String }, // Removed unique: true
  isVerified: { type: Boolean, default: false },
  verificationDocument: { type: String },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
