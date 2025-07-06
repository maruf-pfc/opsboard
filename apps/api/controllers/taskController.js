import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({})
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage')
    .sort({ createdAt: -1 });

  res.json(tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,
    reportedTo,
    courseName,
    batchNo,
    startDate,
    dueDate,
    estimatedTime,
  } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    assignedTo,
    reportedTo,
    courseName,
    batchNo,
    startDate,
    dueDate,
    estimatedTime,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  res.status(201).json(populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,
    reportedTo,
    courseName,
    batchNo,
    startDate,
    dueDate,
    estimatedTime,
  } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      status,
      priority,
      assignedTo,
      reportedTo,
      courseName,
      batchNo,
      startDate,
      dueDate,
      estimatedTime,
    },
    { new: true, runValidators: true },
  )
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({ message: 'Task removed' });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content, parentId } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.comments.push({
    content,
    author: req.user._id,
    parentId: parentId || null,
  });

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  res.json(populatedTask);
});

// @desc    Update comment
// @route   PUT /api/tasks/:id/comments/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = task.comments.id(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content;
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  res.json(populatedTask);
});

// @desc    Delete comment
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = task.comments.id(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the author of the comment or admin
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== 'ADMIN'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  comment.remove();
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .populate('comments.author', 'name email profileImage');

  res.json(populatedTask);
});

export {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
};
