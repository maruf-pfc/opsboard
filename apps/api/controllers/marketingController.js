const Campaign = require('../models/Campaign');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all campaigns
exports.getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(campaigns);
});

// @desc    Create a new campaign draft
exports.createCampaign = asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  const campaign = await Campaign.create({
    subject,
    body,
    createdBy: req.user.id,
  });
  res.status(201).json(campaign);
});

// @desc    Update a campaign draft
exports.updateCampaign = asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  if (campaign.status === 'Sent')
    return res.status(400).json({ error: 'Cannot edit a sent campaign' });

  campaign.subject = subject || campaign.subject;
  campaign.body = body || campaign.body;
  await campaign.save();

  res.status(200).json(campaign);
});

// @desc    Delete a campaign draft
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  if (campaign.status === 'Sent')
    return res.status(400).json({ error: 'Cannot delete a sent campaign' });

  await campaign.remove();
  res.status(200).json({ message: 'Campaign deleted' });
});

// @desc    "Send" a campaign
exports.sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  if (campaign.status === 'Sent')
    return res.status(400).json({ error: 'Campaign has already been sent' });

  // In a real app, you would integrate with an email service like SendGrid or Mailgun here.
  // We will simulate it.
  const users = await User.find({}).select('email');
  const recipientCount = users.length;

  console.log('--- SIMULATING EMAIL SEND ---');
  console.log(`Campaign Subject: ${campaign.subject}`);
  console.log(`Sending to ${recipientCount} users...`);
  // users.forEach(user => console.log(`  - ${user.email}`));
  console.log('--- SIMULATION COMPLETE ---');

  campaign.status = 'Sent';
  campaign.sentAt = Date.now();
  campaign.recipientCount = recipientCount;
  await campaign.save();

  res
    .status(200)
    .json({ message: `Campaign sent to ${recipientCount} users.` });
});
