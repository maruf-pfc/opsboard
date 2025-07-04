import express from 'express';
import {
  getContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
} from '../controllers/contestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getContests).post(protect, createContest);

router
  .route('/:id')
  .get(protect, getContestById)
  .put(protect, updateContest)
  .delete(protect, deleteContest);

export default router;
