import Task from '../models/Task.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { startOfMonth, endOfMonth } from 'date-fns';

// @desc    Get dashboard statistics
// @route   GET /api/v1/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      console.error('Dashboard stats: req.user missing');
      return res
        .status(401)
        .json({ error: 'Authentication required for dashboard statistics.' });
    }
    // --- Task Statistics ---
    const totalTasks = await Task.countDocuments({ parentTask: null });
    const tasksByStatus = await Task.aggregate([
      { $match: { parentTask: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const tasksByPriority = await Task.aggregate([
      { $match: { parentTask: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const recentTasks = await Task.find({ parentTask: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name');
    const highPriorityTasks = await Task.find({
      parentTask: null,
      priority: 'HIGH',
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name');

    // --- User Statistics ---
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      },
    });
    const totalManagers = await User.countDocuments({ role: 'MANAGER' });
    const totalTrainers = await User.countDocuments({ role: 'TRAINER' });

    // --- Class Statistics ---
    // Use startDate for upcoming classes
    const upcomingClasses = await Class.find({
      startDate: { $gte: new Date() },
    })
      .sort({ startDate: 'asc' })
      .limit(3)
      .populate('assignedTo', 'name');

    // --- Payment Statistics (Admin only) ---
    let paymentStats = {};
    if (req.user.role === 'ADMIN') {
      const pendingPayments = await Payment.aggregate([
        { $match: { status: 'Pending' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]);
      const paidPayments = await Payment.aggregate([
        { $match: { status: 'Paid' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]);
      // Monthly analytics (amount paid per month, using 'date' field)
      const monthlyAnalytics = await Payment.aggregate([
        { $match: { status: 'Paid', date: { $ne: null } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            totalPaid: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 6 }, // last 6 months
      ]);
      paymentStats = {
        pendingCount: pendingPayments[0]?.count || 0,
        pendingAmount: pendingPayments[0]?.totalAmount || 0,
        paidCount: paidPayments[0]?.count || 0,
        paidAmount: paidPayments[0]?.totalAmount || 0,
        dueAmount: pendingPayments[0]?.totalAmount || 0, // alias for clarity
        monthlyAnalytics,
      };
    }

    // --- Format the data for easy consumption on the frontend ---
    const formattedTaskStats = tasksByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    const formattedPriorityStats = tasksByPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      tasks: {
        total: totalTasks,
        byStatus: {
          TODO: formattedTaskStats.TODO || 0,
          IN_PROGRESS: formattedTaskStats.IN_PROGRESS || 0,
          IN_REVIEW: formattedTaskStats.IN_REVIEW || 0,
          COMPLETED: formattedTaskStats.COMPLETED || 0,
          BLOCKED: formattedTaskStats.BLOCKED || 0,
        },
        byPriority: {
          HIGH: formattedPriorityStats.HIGH || 0,
          NORMAL: formattedPriorityStats.NORMAL || 0,
          LOW: formattedPriorityStats.LOW || 0,
        },
        recent: recentTasks,
        highPriority: highPriorityTasks,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        managers: totalManagers,
        trainers: totalTrainers,
      },
      classes: {
        upcoming: upcomingClasses,
      },
      payments: paymentStats,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      error: 'Failed to load dashboard statistics. Please try again later.',
    });
  }
});
