import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },

    // Self-relation for threaded comments
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
