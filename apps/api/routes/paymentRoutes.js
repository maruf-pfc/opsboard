const express = require('express');
const router = express.Router();
const {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All payment routes are admin-only
router.use(protect, admin);

router.route('/').get(getPayments).post(createPayment);
router.route('/:id').put(updatePayment).delete(deletePayment);

module.exports = router;
