import Class from '../models/Class.js';

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
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
