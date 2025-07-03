const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
} = require('../controllers/marketingController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All marketing routes are admin-only
router.use(protect, admin);

router.route('/campaigns').get(getCampaigns).post(createCampaign);
router.route('/campaigns/:id').put(updateCampaign).delete(deleteCampaign);
router.route('/campaigns/:id/send').post(sendCampaign);

module.exports = router;
