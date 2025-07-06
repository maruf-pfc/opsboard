import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema(
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
    classNo: {
      type: Number,
      required: true,
    },
    classTitle: {
      type: String,
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
    description: {
      type: String,
    },
    schedule: {
      type: Date,
    },
    // We can add enrolled students later if needed
    // students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true },
);

const Class = mongoose.model('Class', ClassSchema);
export default Class;
