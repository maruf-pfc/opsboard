import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all users (for Admin Panel)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('name email role phone facebookUrl profileImage createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private (self or admin/manager/trainer)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.status(200).json(user);
});

// @desc    Update user profile (image, password, phone, facebookUrl)
// @route   PUT /api/v1/users/:id/profile
// @access  Private (self or admin/manager/trainer)
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (
    req.user._id.toString() !== user._id.toString() &&
    !['ADMIN', 'MANAGER', 'TRAINER'].includes(req.user.role)
  ) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.facebookUrl !== undefined)
    user.facebookUrl = req.body.facebookUrl;
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

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
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'MANAGER', 'MEMBER', 'TRAINER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const user = await User.findById(req.params.id);
  if (user) {
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully.' });
  } else {
    res.status(404).json({ error: 'User not found.' });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  // Optional: handle cascading effects if needed
  res.json({ message: 'User deleted successfully.' });
});
