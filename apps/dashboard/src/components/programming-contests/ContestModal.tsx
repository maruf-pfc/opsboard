import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contestSchema, type ContestFormData } from '@/lib/validations';
import api from '@/lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Contest {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: number;
  contestName: string;
  onlineJudge: 'Leetcode' | 'Vjudge';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contest: Contest) => void;
  users: User[];
  contest: Contest | null;
}

export default function ContestModal({
  isOpen,
  onClose,
  onSave,
  users,
  contest,
}: ContestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: 1,
      contestName: '',
      onlineJudge: undefined,
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
    if (contest) {
      reset({
        courseName: contest.courseName,
        batchNo: contest.batchNo,
        contestName: contest.contestName,
        onlineJudge: contest.onlineJudge,
        status: contest.status,
        priority: contest.priority,
        assignedTo: contest.assignedTo?._id || '',
        reportedTo: contest.reportedTo?._id || '',
        startDate: contest.startDate
          ? new Date(contest.startDate).toISOString().slice(0, 16)
          : '',
        dueDate: contest.dueDate
          ? new Date(contest.dueDate).toISOString().slice(0, 16)
          : '',
        notes: contest.notes || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: 1,
        contestName: '',
        onlineJudge: undefined,
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: '',
        reportedTo: '',
        startDate: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [contest, isOpen, reset]);

  const onSubmit = async (data: ContestFormData) => {
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
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      };
      let response;
      if (contest && contest._id) {
        response = await api.put(
          `/programming-contests/${contest._id}`,
          payload,
        );
        toast.success('Contest updated!');
      } else {
        response = await api.post('/programming-contests', payload);
        toast.success('Contest created!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save contest.');
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
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4 cursor-pointer">
              {contest ? 'Edit Contest' : 'Create Contest'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Course Name
                  </label>
                  <select
                    {...register('courseName')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.courseName ? 'border-red-500' : ''}`}
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
                <label className="block text-sm font-medium">
                  Contest Name
                </label>
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
              <div>
                <label className="block text-sm font-medium">
                  Online Judge
                </label>
                <select
                  {...register('onlineJudge')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${errors.onlineJudge ? 'border-red-500' : ''}`}
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
                  <label className="block text-sm font-medium">
                    Assigned To
                  </label>
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
                  <label className="block text-sm font-medium">
                    Reported To
                  </label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.startDate ? 'border-red-500' : ''}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.dueDate ? 'border-red-500' : ''}`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  {...register('notes')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.notes ? 'border-red-500' : ''
                  }`}
                  rows={3}
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.notes.message}
                  </p>
                )}
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
                    ? contest
                      ? 'Updating...'
                      : 'Creating...'
                    : contest
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
