import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserById,
  updateUserProfile,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// 🛡️ Admin-only access to get all users
router.route('/').get(protect, admin, getUsers);

// Admin routes
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id').delete(protect, admin, deleteUser);

// User routes
router.route('/:id').get(protect, getUserById);
router.route('/:id/profile').put(protect, updateUserProfile);

export default router;
