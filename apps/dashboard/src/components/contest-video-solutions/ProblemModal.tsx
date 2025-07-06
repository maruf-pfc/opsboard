import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { problemSchema, type ProblemFormData } from '@/lib/validations';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface ContestVideoSolution {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo: number;
  contestName: string;
  onlineJudge: 'Leetcode' | 'Vjudge';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  estimatedTime: string;
  platform: 'Google Classroom' | 'Website';
  createdAt?: string;
  updatedAt?: string;
}

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contestVideoSolution: ContestVideoSolution) => void;
  users: User[];
  problem: ContestVideoSolution | null;
}

export default function ProblemModal({
  isOpen,
  onClose,
  onSave,
  users,
  problem,
}: ProblemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: 1,
      contestName: '',
      onlineJudge: '',
      status: 'TODO',
      priority: 'NORMAL',
      assignedTo: '',
      reportedTo: '',
      estimatedTime: '',
      platform: 'Google Classroom',
    },
  });

  useEffect(() => {
    if (problem) {
      reset({
        courseName: problem.courseName,
        batchNo: problem.batchNo,
        contestName: problem.contestName,
        onlineJudge: problem.onlineJudge,
        status: problem.status,
        priority: problem.priority,
        assignedTo: problem.assignedTo?._id || '',
        reportedTo: problem.reportedTo?._id || '',
        estimatedTime: problem.estimatedTime,
        platform: problem.platform,
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: 1,
        contestName: '',
        onlineJudge: '',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: '',
        reportedTo: '',
        estimatedTime: '',
        platform: 'Google Classroom',
      });
    }
  }, [problem, isOpen, reset]);

  const onSubmit = async (data: ProblemFormData) => {
    try {
      const payload = {
        courseName: data.courseName,
        batchNo: data.batchNo,
        contestName: data.contestName,
        onlineJudge: data.onlineJudge,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        reportedTo: data.reportedTo,
        estimatedTime: data.estimatedTime,
        platform: data.platform,
      };
      let response;
      if (problem && problem._id) {
        response = await api.put(
          `/contest-video-solutions/${problem._id}`,
          payload,
        );
        toast.success('Contest video solution updated!');
      } else {
        response = await api.post('/contest-video-solutions', payload);
        toast.success('Contest video solution created!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Failed to save contest video solution.',
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <h2 className="text-xl font-bold mb-4 cursor-pointer">
          {problem
            ? 'Edit Contest Video Solution'
            : 'Create Contest Video Solution'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Course Name</label>
              <select
                {...register('courseName')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.courseName ? 'border-red-500' : ''
                }`}
              >
                <option value="CPC">CPC</option>
                <option value="JIPC">JIPC</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>
              {errors.courseName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.courseName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Batch No</label>
              <input
                type="number"
                {...register('batchNo', { valueAsNumber: true })}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.batchNo ? 'border-red-500' : ''
                }`}
                min={1}
              />
              {errors.batchNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.batchNo.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Contest Name</label>
            <input
              type="text"
              {...register('contestName')}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.contestName ? 'border-red-500' : ''
              }`}
            />
            {errors.contestName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contestName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Online Judge</label>
              <select
                {...register('onlineJudge')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.onlineJudge ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Online Judge</option>
                <option value="Leetcode">Leetcode</option>
                <option value="Vjudge">Vjudge</option>
              </select>
              {errors.onlineJudge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.onlineJudge.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Platform</label>
              <select
                {...register('platform')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.platform ? 'border-red-500' : ''
                }`}
              >
                <option value="Google Classroom">Google Classroom</option>
                <option value="Website">Website</option>
              </select>
              {errors.platform && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.platform.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Estimated Time (hours)
            </label>
            <input
              type="text"
              {...register('estimatedTime')}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                errors.estimatedTime ? 'border-red-500' : ''
              }`}
              placeholder="e.g. 2, 3.5"
            />
            {errors.estimatedTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedTime.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                {...register('status')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.status ? 'border-red-500' : ''
                }`}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select
                {...register('priority')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.priority ? 'border-red-500' : ''
                }`}
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="LOW">Low</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Assigned To</label>
              <select
                {...register('assignedTo')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.assignedTo ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedTo.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Reported To</label>
              <select
                {...register('reportedTo')}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.reportedTo ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.reportedTo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.reportedTo.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? problem
                  ? 'Updating...'
                  : 'Creating...'
                : problem
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
