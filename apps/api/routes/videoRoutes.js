import express from 'express';
import {
  getVideos,
  createVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getVideos).post(createVideo);
router.route('/:id').delete(deleteVideo);

export default router;
