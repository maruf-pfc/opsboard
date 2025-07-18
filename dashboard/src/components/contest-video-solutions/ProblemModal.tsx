import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { problemSchema, type ProblemFormData } from '@/lib/validations';
import api from '@/lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface ContestVideoSolution {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: string;
  contestName: string;
  onlineJudge: 'Leetcode' | 'Vjudge';
  platform: 'Google Classroom' | 'Website';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  startDate?: string;
  dueDate?: string;
  notes?: string;
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
      batchNo: '',
      contestName: '',
      onlineJudge: undefined,
      platform: 'Google Classroom',
      status: 'TODO',
      priority: 'NORMAL',
      assignedTo: '',
      reportedTo: '',
      startDate: '',
      dueDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (problem) {
      reset({
        courseName: problem.courseName,
        batchNo: problem.batchNo,
        contestName: problem.contestName,
        onlineJudge: problem.onlineJudge,
        platform: problem.platform,
        status: problem.status,
        priority: problem.priority,
        assignedTo: problem.assignedTo?._id || '',
        reportedTo: problem.reportedTo?._id || '',
        startDate: problem.startDate
          ? new Date(problem.startDate).toISOString().slice(0, 16)
          : '',
        dueDate: problem.dueDate
          ? new Date(problem.dueDate).toISOString().slice(0, 16)
          : '',
        notes: problem.notes || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: '',
        contestName: '',
        onlineJudge: undefined,
        platform: 'Google Classroom',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: '',
        reportedTo: '',
        startDate: '',
        dueDate: '',
        notes: '',
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
        platform: data.platform,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        reportedTo: data.reportedTo,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      };
      let response;
      if (problem && problem._id) {
        response = await api.put(
          `/contest-video-solutions/${problem._id}`,
          payload
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
        err?.response?.data?.message || 'Failed to save contest video solution.'
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {problem
                ? 'Edit Contest Video Solution'
                : 'Create Contest Video Solution'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <select
                    {...register('courseName')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.courseName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="CPC">CPC</option>
                    <option value="JIPC">JIPC</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Others">Others</option>
                  </select>
                  {errors.courseName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.courseName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch No
                  </label>
                  <input
                    type="text"
                    {...register('batchNo')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.batchNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.batchNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.batchNo.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contest Name
                  </label>
                  <input
                    type="text"
                    {...register('contestName')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.contestName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contestName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contestName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Online Judge
                  </label>
                  <select
                    {...register('onlineJudge')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.onlineJudge ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    {...register('platform')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.platform ? 'border-red-500' : 'border-gray-300'
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.priority ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.priority.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    {...register('assignedTo')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select assigned user</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reported To
                  </label>
                  <select
                    {...register('reportedTo')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.reportedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select reported user</option>
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

              {/* Start Date and Due Date in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.notes ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? problem
                      ? 'Saving...'
                      : 'Creating...'
                    : problem
                    ? 'Update Contest Video Solution'
                    : 'Create Contest Video Solution'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
