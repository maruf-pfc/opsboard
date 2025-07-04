import Contest from '../models/Contest.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find()
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  res.json(contests);
});

export const getContestById = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  if (!contest) return res.status(404).json({ message: 'Contest not found' });
  res.json(contest);
});

export const createContest = asyncHandler(async (req, res) => {
  const contest = await Contest.create(req.body);
  const populated = await Contest.findById(contest._id)
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  res.status(201).json(populated);
});

export const updateContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  if (!contest) return res.status(404).json({ message: 'Contest not found' });
  res.json(contest);
});

export const deleteContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findByIdAndDelete(req.params.id);
  if (!contest) return res.status(404).json({ message: 'Contest not found' });
  res.json({ message: 'Contest deleted' });
});
