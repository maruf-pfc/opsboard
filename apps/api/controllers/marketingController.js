import MarketingTask from '../models/Marketing.js';

// Get all marketing tasks
export const getAllMarketingTasks = async (req, res) => {
  try {
    const tasks = await MarketingTask.find()
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single marketing task by ID
export const getMarketingTaskById = async (req, res) => {
  try {
    const task = await MarketingTask.findById(req.params.id)
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new marketing task
export const createMarketingTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      reportedTo,
    } = req.body;
    const task = new MarketingTask({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      reportedTo,
    });
    await task.save();
    const populatedTask = await MarketingTask.findById(task._id)
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a marketing task
export const updateMarketingTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      reportedTo,
    } = req.body;
    const task = await MarketingTask.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, assignedTo, reportedTo },
      { new: true, runValidators: true },
    )
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a marketing task
export const deleteMarketingTask = async (req, res) => {
  try {
    const task = await MarketingTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
