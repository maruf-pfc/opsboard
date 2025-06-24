const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add a payment amount'],
  },
  month: {
    type: String,
    required: [true, 'Please specify the payment month (e.g., January 2024)'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  notes: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);