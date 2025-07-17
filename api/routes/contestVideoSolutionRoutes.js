import express from 'express';
import {
  getContestVideoSolutions,
  getContestVideoSolutionById,
  createContestVideoSolution,
  updateContestVideoSolution,
  deleteContestVideoSolution,
} from '../controllers/contestVideoSolutionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getContestVideoSolutions)
  .post(protect, createContestVideoSolution);

router
  .route('/:id')
  .get(protect, getContestVideoSolutionById)
  .put(protect, updateContestVideoSolution)
  .delete(protect, deleteContestVideoSolution);

export default router;
