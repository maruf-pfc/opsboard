// opsboard-server/controllers/userController.js
const User = require("../models/User");
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users (for Admin Panel)
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    // FIX: Explicitly select all the fields needed by the frontend.
    // '-password' ensures the hashed password is never sent.
    const users = await User.find({}).select('name email role createdAt').sort({ createdAt: -1 });
    
    res.status(200).json(users);
});

// --- ADMIN ONLY FUNCTIONS ---

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    if (!['ADMIN', 'MANAGER', 'MEMBER'].includes(role)) {
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