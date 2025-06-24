const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a class title'],
  },
  description: {
    type: String,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  // We can add enrolled students later if needed
  // students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);