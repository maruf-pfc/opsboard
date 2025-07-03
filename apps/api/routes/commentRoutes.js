// opsboard-server/routes/commentRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams
const { addCommentToTask } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addCommentToTask);

module.exports = router;
