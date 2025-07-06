import Class from '../models/Class.js';
import Task from '../models/Task.js';

// @desc    Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get a single class
export const getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.status(200).json(classItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a class
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    const populatedClass = await Class.findById(newClass._id)
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');

    // Create a corresponding task for the global tasks page
    const taskData = {
      title: `${req.body.classTitle} - ${req.body.courseName} Batch ${req.body.batchNo}`,
      description:
        req.body.description ||
        `Class ${req.body.classNo} for ${req.body.courseName} Batch ${req.body.batchNo}`,
      status: req.body.status,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo,
      reportedTo: req.body.reportedTo,
      type: 'classes',
      courseName: req.body.courseName,
      batchNo: req.body.batchNo.toString(),
      startDate: req.body.schedule,
      dueDate: req.body.schedule,
    };

    await Task.create(taskData);

    res.status(201).json(populatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update a class
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    )
      .populate('assignedTo', 'name email profileImage')
      .populate('reportedTo', 'name email profileImage');

    if (!updatedClass)
      return res.status(404).json({ error: 'Class not found' });

    // Update the corresponding task
    const taskTitle = `${req.body.classTitle} - ${req.body.courseName} Batch ${req.body.batchNo}`;
    const taskDescription =
      req.body.description ||
      `Class ${req.body.classNo} for ${req.body.courseName} Batch ${req.body.batchNo}`;

    await Task.findOneAndUpdate(
      {
        type: 'classes',
        courseName: req.body.courseName,
        batchNo: req.body.batchNo.toString(),
        title: { $regex: req.body.classTitle, $options: 'i' },
      },
      {
        title: taskTitle,
        description: taskDescription,
        status: req.body.status,
        priority: req.body.priority,
        assignedTo: req.body.assignedTo,
        reportedTo: req.body.reportedTo,
        startDate: req.body.schedule,
        dueDate: req.body.schedule,
      },
      { new: true },
    );

    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a class
export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass)
      return res.status(404).json({ error: 'Class not found' });

    // Delete the corresponding task
    await Task.findOneAndDelete({
      type: 'classes',
      courseName: deletedClass.courseName,
      batchNo: deletedClass.batchNo.toString(),
      title: { $regex: deletedClass.classTitle, $options: 'i' },
    });

    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
