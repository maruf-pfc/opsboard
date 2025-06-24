// opsboard-server/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "BLOCKED"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["HIGH", "NORMAL", "LOW"],
      default: "NORMAL",
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    estimatedTime: { type: Number }, // In minutes

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Self-relation for subtasks
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to get subtasks
TaskSchema.virtual("subtasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "parentTask",
});

// Virtual property to get comments
TaskSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "task",
});

module.exports = mongoose.model("Task", TaskSchema);
