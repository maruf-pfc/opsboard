import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema(
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
    classNo: {
      type: Number,
      required: true,
    },
    classTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'MEDIUM', 'HIGH'],
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
    // We can add enrolled students later if needed
    // students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', ClassSchema);
export default Class;
