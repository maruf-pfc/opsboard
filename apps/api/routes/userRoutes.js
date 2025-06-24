// opsboard-server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect } = require("../middleware/authMiddleware");
const { admin } = require('../middleware/adminMiddleware');

router.route("/").get(protect, getUsers);

// Admin-only routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
