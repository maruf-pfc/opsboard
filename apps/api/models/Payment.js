import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    details: {
      courseName: {
        type: String,
        enum: ['CPC', 'JIPC', 'Bootcamp', 'Others'],
        required: false,
      },
      batchNo: {
        type: String,
        required: false,
      },
      classNo: {
        type: String,
        required: false,
      },
    },
    amount: {
      type: Number,
      required: [true, 'Please add a payment amount'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    date: {
      type: Date,
    },
    notes: {
      type: String,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
