import ContestVideoSolution from '../models/ContestVideoSolution.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getContestVideoSolutions = asyncHandler(async (req, res) => {
  const contestVideoSolutions = await ContestVideoSolution.find()
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  res.json(contestVideoSolutions);
});

export const getContestVideoSolutionById = asyncHandler(async (req, res) => {
  const contestVideoSolution = await ContestVideoSolution.findById(
    req.params.id,
  )
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  if (!contestVideoSolution)
    return res
      .status(404)
      .json({ message: 'Contest video solution not found' });
  res.json(contestVideoSolution);
});

export const createContestVideoSolution = asyncHandler(async (req, res) => {
  const contestVideoSolution = await ContestVideoSolution.create(req.body);
  const populated = await ContestVideoSolution.findById(
    contestVideoSolution._id,
  )
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  res.status(201).json(populated);
});

export const updateContestVideoSolution = asyncHandler(async (req, res) => {
  const contestVideoSolution = await ContestVideoSolution.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  )
    .populate('assignedTo', 'name email profileImage')
    .populate('reportedTo', 'name email profileImage');
  if (!contestVideoSolution)
    return res
      .status(404)
      .json({ message: 'Contest video solution not found' });
  res.json(contestVideoSolution);
});

export const deleteContestVideoSolution = asyncHandler(async (req, res) => {
  const contestVideoSolution = await ContestVideoSolution.findByIdAndDelete(
    req.params.id,
  );
  if (!contestVideoSolution)
    return res
      .status(404)
      .json({ message: 'Contest video solution not found' });
  res.json({ message: 'Contest video solution deleted' });
});
