import express from 'express';
import * as marketingController from '../controllers/marketingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

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

export default router;
