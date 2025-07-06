import express from 'express';
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/taskController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes below are protected
router.use(protect);

router.route('/').post(createTask).get(getAllTasks);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

// Comment routes
router.route('/:id/comments').post(addComment);
router
  .route('/:id/comments/:commentId')
  .put(updateComment)
  .delete(deleteComment);

export default router;
