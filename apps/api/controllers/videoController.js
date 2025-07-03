const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');

exports.getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate('uploadedBy', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(videos);
});

exports.createVideo = asyncHandler(async (req, res) => {
  req.body.uploadedBy = req.user.id;
  const video = await Video.create(req.body);
  res.status(201).json(video);
});

exports.deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.status(200).json({ message: 'Video deleted' });
});
