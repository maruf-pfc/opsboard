const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { v2: cloudinary } = require('cloudinary');
const bcrypt = require('bcryptjs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all users (for Admin Panel)
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // FIX: Explicitly select all the fields needed by the frontend.
  // '-password' ensures the hashed password is never sent.
  const users = await User.find({})
    .select('name email role phone facebookUrl profileImage createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private (self or admin/manager/trainer)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.status(200).json(user);
});

// @desc    Update user profile (image, password, phone, facebookUrl)
// @route   PUT /api/v1/users/:id/profile
// @access  Private (self or admin/manager/trainer)
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Only allow self or admin/manager/trainer
  if (
    req.user._id.toString() !== user._id.toString() &&
    !['ADMIN', 'MANAGER', 'TRAINER'].includes(req.user.role)
  ) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  // Update fields
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.facebookUrl !== undefined)
    user.facebookUrl = req.body.facebookUrl;
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;

  // Password update
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  // Profile image upload (expects base64 or URL in req.body.profileImage)
  if (req.body.profileImage) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.body.profileImage,
        {
          folder: 'users',
          public_id: `user_${user._id}`,
          overwrite: true,
        },
      );
      user.profileImage = uploadResult.secure_url;
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Image upload failed', details: err.message });
    }
  }

  await user.save();
  res.status(200).json({ message: 'Profile updated', user });
});

// --- ADMIN ONLY FUNCTIONS ---

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'MANAGER', 'MEMBER', 'TRAINER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = role;
      await user.save();
      res.json({ message: 'User role updated successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    // NOTE: You might want to handle what happens to tasks assigned to this user.
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
