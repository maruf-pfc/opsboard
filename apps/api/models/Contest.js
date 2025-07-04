import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      enum: ['CPC', 'JIPC', 'Bootcamp'],
      required: true,
    },
    batchNo: {
      type: Number,
      required: true,
    },
    contestName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['Leetcode', 'Vjudge'],
      required: true,
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH'],
      default: 'NORMAL',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Contest', ContestSchema);
