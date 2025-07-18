'use client';

import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contestSchema, type ContestFormData } from '@/lib/validations';
import api from '@/lib/api';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'; // Importing icons

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

  // Effect to reset form when modal opens or contest data changes
  useEffect(() => {
    if (contest) {
      reset({
        courseName: contest.courseName,
        batchNo: contest.batchNo,
        contestName: contest.contestName,
        onlineJudge: contest.onlineJudge,
        status: contest.status,
        priority: contest.priority === 'LOW' ? 'MEDIUM' : contest.priority,
        assignedTo: contest.assignedTo?._id || '',
        reportedTo: contest.reportedTo?._id || '',
        startDate: contest.startDate
          ? new Date(contest.startDate).toISOString().split('T')[0] // Format for date input
          : '',
        dueDate: contest.dueDate
          ? new Date(contest.dueDate).toISOString().split('T')[0] // Format for date input
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
        // Convert date strings to Date objects if they exist
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      };
      let response;
      if (contest && contest._id) {
        response = await api.put(
          `/programming-contests/${contest._id}`,
          payload
        );
        toast.success('Contest updated successfully!');
      } else {
        response = await api.post('/programming-contests', payload);
        toast.success('Contest created successfully!');
      }
      onSave(response.data); // Pass the saved/updated contest data back
      onClose(); // Close the modal
    } catch (err: any) {
      console.error('Contest save error:', err.response?.data || err);
      toast.error(err?.response?.data?.message || 'Failed to save contest.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 font-sans" onClose={onClose}>
        {/* Backdrop overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Modal content wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:p-8">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-extrabold leading-6 text-gray-900"
                  >
                    {contest ? 'Edit Contest' : 'Create New Contest'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-full border border-transparent bg-gray-100 p-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {' '}
                  {/* Increased space-y */}
                  {/* Course Name & Batch No */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="courseName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Course Name
                      </label>
                      <select
                        id="courseName"
                        {...register('courseName')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.courseName ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="CPC">CPC</option>
                        <option value="JIPC">JIPC</option>
                        <option value="Bootcamp">Bootcamp</option>
                        <option value="Others">Others</option>
                      </select>
                      {errors.courseName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.courseName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="batchNo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Batch No
                      </label>
                      <input
                        id="batchNo"
                        type="number"
                        {...register('batchNo', { valueAsNumber: true })}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.batchNo ? 'border-red-500' : ''
                        }`}
                        min={1}
                      />
                      {errors.batchNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.batchNo.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Contest Name */}
                  <div>
                    <label
                      htmlFor="contestName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contest Name
                    </label>
                    <input
                      id="contestName"
                      type="text"
                      {...register('contestName')}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                        errors.contestName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.contestName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contestName.message}
                      </p>
                    )}
                  </div>
                  {/* Online Judge */}
                  <div>
                    <label
                      htmlFor="onlineJudge"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Online Judge
                    </label>
                    <select
                      id="onlineJudge"
                      {...register('onlineJudge')}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                        errors.onlineJudge ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select Judge</option>{' '}
                      {/* Added a default empty option */}
                      <option value="Leetcode">Leetcode</option>
                      <option value="Vjudge">Vjudge</option>
                    </select>
                    {errors.onlineJudge && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.onlineJudge.message}
                      </p>
                    )}
                  </div>
                  {/* Status & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        {...register('status')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        {...register('priority')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.priority ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="LOW">Low</option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Assigned To & Reported To */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="assignedTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Assigned To
                      </label>
                      <select
                        id="assignedTo"
                        {...register('assignedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.assignedTo.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="reportedTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Reported To
                      </label>
                      <select
                        id="reportedTo"
                        {...register('reportedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.reportedTo.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Start Date & Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.startDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.dueDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                        errors.notes ? 'border-red-500' : ''
                      }`}
                      rows={4} // Increased rows for better usability
                    />
                    {errors.notes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    {' '}
                    {/* Added pt-4 border-t */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer shadow-sm"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : contest ? (
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <PlusIcon className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting
                        ? contest
                          ? 'Updating...'
                          : 'Creating...'
                        : contest
                        ? 'Update Contest'
                        : 'Create Contest'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
