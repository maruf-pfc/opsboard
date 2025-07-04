import Class from '../models/Class.js';

// @desc    Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('trainer', 'name email')
      .sort({ schedule: -1 });
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a class
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
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
    );
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
