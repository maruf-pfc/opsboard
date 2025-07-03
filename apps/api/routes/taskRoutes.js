const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const commentRouter = require('./commentRoutes');

router.use('/:taskId/comments', commentRouter);
router.use(protect); // All routes below are protected

router.route('/').post(createTask).get(getTasks);
router.route('/:id').put(updateTask).delete(deleteTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
