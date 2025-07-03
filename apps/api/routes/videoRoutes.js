const express = require('express');
const router = express.Router();
const {
  getVideos,
  createVideo,
  deleteVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getVideos).post(createVideo);
router.route('/:id').delete(deleteVideo);

module.exports = router;
