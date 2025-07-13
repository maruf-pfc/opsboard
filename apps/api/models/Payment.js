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
    classTitle: {
      type: String,
      required: true,
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
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH'],
      default: 'NORMAL',
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
