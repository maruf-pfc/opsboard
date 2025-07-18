import express from 'express';
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getClasses).post(createClass);

router.route('/:id').get(getClass).put(updateClass).delete(deleteClass);

export default router;
