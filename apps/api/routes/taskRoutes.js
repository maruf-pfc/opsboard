import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

import { protect } from '../middleware/authMiddleware.js';
import commentRouter from './commentRoutes.js';

const router = express.Router();

// Nested comment routes
router.use('/:taskId/comments', commentRouter);

// All task routes below are protected
router.use(protect);

router.route('/').post(createTask).get(getTasks);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
