import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
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
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    notes: {
      type: String,
    },
    courseName: {
      type: String,
      enum: ['CPC', 'JIPC', 'Bootcamp'],
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
    paidAt: {
      type: Date,
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
