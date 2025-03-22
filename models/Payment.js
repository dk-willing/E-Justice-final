const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // Amount in GHS
  currency: { type: String, default: 'GHS' }, // Currency (GHS for Ghana)
  reference: { type: String, required: true, unique: true }, // Paystack transaction reference
  status: { type: String, required: true }, // e.g., 'success', 'failed'
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
