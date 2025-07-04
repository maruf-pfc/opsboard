import express from 'express';
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getClasses).post(createClass);

router.route('/:id').put(updateClass).delete(deleteClass);

export default router;
