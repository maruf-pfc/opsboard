import express from 'express';
import { addCommentToTask } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // Important: mergeParams

router.route('/').post(protect, addCommentToTask);

export default router;
