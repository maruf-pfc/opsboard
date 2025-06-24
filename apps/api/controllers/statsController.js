const Task = require("../models/Task");
const User = require("../models/User");
const Class = require("../models/Class");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");
const { startOfMonth, endOfMonth } = require("date-fns");

// @desc    Get dashboard statistics
// @route   GET /api/v1/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  // --- Task Statistics ---
  const totalTasks = await Task.countDocuments({ parentTask: null });
  const tasksByStatus = await Task.aggregate([
    { $match: { parentTask: null } }, // Only count top-level tasks
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const recentTasks = await Task.find({ parentTask: null })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("assignedTo", "name");

  // --- User Statistics ---
  const totalUsers = await User.countDocuments();
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth(new Date()), $lte: endOfMonth(new Date()) },
  });

  // --- Class Statistics ---
  const upcomingClasses = await Class.find({ schedule: { $gte: new Date() } })
    .sort({ schedule: "asc" })
    .limit(3)
    .populate("trainer", "name");

  // --- Payment Statistics (Admin only) ---
  let paymentStats = {};
  if (req.user.role === "ADMIN") {
    const pendingPayments = await Payment.aggregate([
      { $match: { status: "Pending" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    paymentStats = {
      pendingCount: pendingPayments[0]?.count || 0,
      pendingAmount: pendingPayments[0]?.totalAmount || 0,
    };
  }

  // --- Format the data for easy consumption on the frontend ---
  const formattedTaskStats = tasksByStatus.reduce((acc, item) => {
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
      recent: recentTasks,
    },
    users: {
      total: totalUsers,
      newThisMonth: newUsersThisMonth,
    },
    classes: {
      upcoming: upcomingClasses,
    },
    payments: paymentStats,
  });
});
