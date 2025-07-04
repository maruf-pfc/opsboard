import express from 'express';
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/paymentController.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All payment routes are admin-only
router.use(protect, admin);

router.route('/').get(getPayments).post(createPayment);

router.route('/:id').put(updatePayment).delete(deletePayment);

export default router;
