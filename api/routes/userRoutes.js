import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserById,
  updateUserProfile,
  createUser,
  changePassword,
  adminUpdateUser,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import {
  canViewUser,
  canModifyUser,
  requireRole,
} from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🛡️ Admin and Manager access to get all users
router.route('/').get(protect, requireRole(['ADMIN', 'MANAGER']), getUsers);

// Admin routes
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id').delete(protect, admin, deleteUser);

// Admin create user
router.post('/', protect, admin, createUser);
// User change password
router.put('/:id/password', protect, changePassword);

// Admin update any user (all fields, including role)
router.put('/:id', protect, admin, adminUpdateUser);

// User routes with enhanced security
router.route('/:id').get(protect, canViewUser, getUserById);
router.route('/:id/profile').put(protect, canModifyUser, updateUserProfile);

export default router;
