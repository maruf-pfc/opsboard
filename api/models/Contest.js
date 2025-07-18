import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      enum: ['CPC', 'JIPC', 'Bootcamp', 'Others'],
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
    onlineJudge: {
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
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Contest', ContestSchema);
