const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserById,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(protect, getUsers);

// Admin-only routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id').delete(protect, admin, deleteUser);

router.route('/:id').get(protect, getUserById);
router.route('/:id/profile').put(protect, updateUserProfile);

module.exports = router;
