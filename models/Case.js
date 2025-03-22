const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['SUBMITTED', 'LAWYER_ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
    default: 'SUBMITTED',
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  documents: [
    {
      name: { type: String, required: true },
      path: { type: String, required: true },
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Case', CaseSchema);
