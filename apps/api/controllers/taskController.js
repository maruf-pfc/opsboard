const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    // Accept all unified fields
    const {
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      estimatedTime,
      assignedTo,
      type,
      courseName,
      batchNo,
      contestName,
      parentTask,
    } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      estimatedTime,
      assignedTo,
      reportedTo: req.user.id,
      type,
      courseName,
      batchNo,
      contestName,
      parentTask,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ parentTask: null }) // only get top-level tasks
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single task by ID with details
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('reportedTo', 'name email')
      .populate({
        path: 'subtasks',
        populate: { path: 'assignedTo', select: 'name email' },
      })
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email' },
        options: { sort: { createdAt: 'desc' } },
      });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Accept all unified fields
    const updateFields = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      startDate: req.body.startDate,
      dueDate: req.body.dueDate,
      estimatedTime: req.body.estimatedTime,
      assignedTo: req.body.assignedTo,
      type: req.body.type,
      courseName: req.body.courseName,
      batchNo: req.body.batchNo,
      contestName: req.body.contestName,
      parentTask: req.body.parentTask,
    };
    const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // Optional: Also delete subtasks
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
