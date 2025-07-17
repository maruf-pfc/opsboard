import Comment from '../models/Comment.js';

// @desc    Create a comment on a task
// @route   POST /api/tasks/:taskId/comments
export const addCommentToTask = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      author: req.user.id,
      task: req.params.taskId,
    });
    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email',
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
