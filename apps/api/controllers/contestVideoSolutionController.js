import ContestVideoSolution from '../models/ContestVideoSolution.js';
import Task from '../models/Task.js';
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

  // Create a corresponding task for the global tasks page
  const taskData = {
    title: `${req.body.contestName} - ${req.body.courseName} Batch ${req.body.batchNo}`,
    description: `Contest video solution for ${req.body.contestName} on ${req.body.onlineJudge} platform`,
    status: req.body.status,
    priority: req.body.priority,
    assignedTo: req.body.assignedTo,
    reportedTo: req.body.reportedTo,
    type: 'contest-video-solutions',
    courseName: req.body.courseName,
    batchNo: req.body.batchNo.toString(),
    contestName: req.body.contestName,
    estimatedTime: req.body.estimatedTime
      ? parseInt(req.body.estimatedTime) * 60
      : undefined, // Convert hours to minutes
  };

  await Task.create(taskData);

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

  // Update the corresponding task
  const taskTitle = `${req.body.contestName} - ${req.body.courseName} Batch ${req.body.batchNo}`;
  const taskDescription = `Contest video solution for ${req.body.contestName} on ${req.body.onlineJudge} platform`;

  await Task.findOneAndUpdate(
    {
      type: 'contest-video-solutions',
      courseName: req.body.courseName,
      batchNo: req.body.batchNo.toString(),
      contestName: req.body.contestName,
    },
    {
      title: taskTitle,
      description: taskDescription,
      status: req.body.status,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo,
      reportedTo: req.body.reportedTo,
      estimatedTime: req.body.estimatedTime
        ? parseInt(req.body.estimatedTime) * 60
        : undefined,
    },
    { new: true },
  );

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

  // Delete the corresponding task
  await Task.findOneAndDelete({
    type: 'contest-video-solutions',
    courseName: contestVideoSolution.courseName,
    batchNo: contestVideoSolution.batchNo.toString(),
    contestName: contestVideoSolution.contestName,
  });

  res.json({ message: 'Contest video solution deleted' });
});
