const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');

exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('trainer', 'name email role profileImage')
    .sort({ createdAt: -1 });
  res.status(200).json(payments);
});

exports.createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json(payment);
});

exports.updatePayment = asyncHandler(async (req, res) => {
  let payment = await Payment.findById(req.params.id);
  if (!payment)
    return res.status(404).json({ error: 'Payment record not found' });

  // If status is changed to Paid, set paidAt and processedBy
  if (req.body.status === 'Paid' && payment.status === 'Pending') {
    req.body.paidAt = Date.now();
    req.body.processedBy = req.user.id;
  }

  payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(payment);
});

exports.deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment)
    return res.status(404).json({ error: 'Payment record not found' });
  res.status(200).json({ message: 'Payment record deleted' });
});
