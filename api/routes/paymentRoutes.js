import express from 'express';
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/paymentController.js';

import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Payment routes accessible by Admin and Manager
router.use(protect, requireRole(['ADMIN', 'MANAGER']));

router.route('/').get(getPayments).post(createPayment);

router.route('/:id').put(updatePayment).delete(deletePayment);

export default router;
