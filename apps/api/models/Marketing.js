import mongoose from 'mongoose';

const MarketingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
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
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    dueDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true },
);

const Marketing = mongoose.model('Marketing', MarketingSchema);
export default Marketing;
