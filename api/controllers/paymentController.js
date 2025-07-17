import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('trainer', 'name email profileImage')
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage')
    .sort({ createdAt: -1 });
  res.status(200).json(payments);
});

export const createPayment = asyncHandler(async (req, res) => {
  console.log('Creating payment with data:', req.body); // DEBUG LOG
  console.log('Date fields:', {
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
  }); // DEBUG LOG

  const payment = await Payment.create(req.body);

  // Populate the created payment with user details
  const populatedPayment = await Payment.findById(payment._id)
    .populate('trainer', 'name email profileImage')
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');

  console.log('Created payment:', populatedPayment); // DEBUG LOG
  res.status(201).json(populatedPayment);
});

export const updatePayment = asyncHandler(async (req, res) => {
  console.log('Updating payment with data:', req.body); // DEBUG LOG
  console.log('Date fields:', {
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
  }); // DEBUG LOG

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
  })
    .populate('trainer', 'name email profileImage')
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');

  console.log('Updated payment:', payment); // DEBUG LOG
  res.status(200).json(payment);
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment)
    return res.status(404).json({ error: 'Payment record not found' });
  res.status(200).json({ message: 'Payment record deleted' });
});
