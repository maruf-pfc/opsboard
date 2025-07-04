const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(marketingController.getAllMarketingTasks)
  .post(marketingController.createMarketingTask);

router
  .route('/:id')
  .get(marketingController.getMarketingTaskById)
  .put(marketingController.updateMarketingTask)
  .delete(marketingController.deleteMarketingTask);

module.exports = router;
