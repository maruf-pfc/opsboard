'use client';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ITask } from './TaskBoard';
import { CommentSection } from './CommentSection';
import { classNames } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { z } from 'zod';

// Define a more detailed type for a user (for the dropdown)
interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// Define a type for a comment
interface IComment {
  _id: string;
  content: string;
  author: { name: string; email: string; profileImage?: string };
  createdAt: string;
  parentId?: string;
}

// Extend ITask to include the populated fields from the API
interface ITaskDetails extends ITask {
  subtasks?: ITask[];
  comments?: IComment[];
  reportedTo: User;
}

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  comments?: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  users: User[];
  task: Task | null;
}

// Update Zod schema to match backend model and frontend form expectations
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['NORMAL', 'MEDIUM', 'HIGH']),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  reportedTo: z.string().min(1, 'Reported to is required'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  task,
}: TaskModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'NORMAL',
      assignedTo: '',
      reportedTo: '',
      startDate: '',
      dueDate: '',
      notes: '',
    },
  });

  // Effect to reset form when modal opens or task data changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'NORMAL',
        assignedTo: task.assignedTo?._id || '',
        reportedTo: task.reportedTo?._id || '',
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split('T')[0]
          : '',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '',
        notes: task.notes || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: '',
        reportedTo: '',
        startDate: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [task, isOpen, reset]);

  // Main form submission handler (create/update task)
  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSaving(true);
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        reportedTo: data.reportedTo,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      };

      let response;
      if (task && task._id) {
        response = await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated successfully!');
      } else {
        response = await api.post('/tasks', payload);
        toast.success('Task created successfully!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      console.error('Task save error:', err.response?.data || err);
      toast.error(err?.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSaving(false);
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
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:p-8 max-h-[90vh] overflow-y-auto">
                {' '}
                {/* FIX: Changed overflow-hidden to overflow-y-auto */}
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-extrabold leading-6 text-gray-900"
                  >
                    {task ? 'Edit Task' : 'Create New Task'}
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
                  {/* Task Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      className="w-full min-w-0 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200"
                      placeholder="e.g., Implement user authentication"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Task Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Description
                    </label>
                    <textarea
                      id="description"
                      {...register('description')}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 resize-y"
                      placeholder="Provide a detailed description of the task requirements."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status *
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
                        Priority *
                      </label>
                      <select
                        id="priority"
                        {...register('priority')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.priority ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned To and Reported To */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="assignedTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Assigned To *
                      </label>
                      <select
                        id="assignedTo"
                        {...register('assignedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.assignedTo ? 'border-red-500' : ''
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
                        Reported To *
                      </label>
                      <select
                        id="reportedTo"
                        {...register('reportedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.reportedTo ? 'border-red-500' : ''
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.reportedTo.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Start Date and Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
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
                        type="date"
                        id="dueDate"
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
                      rows={4}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                        errors.notes ? 'border-red-500' : ''
                      }`}
                      placeholder="Any additional notes or details for the task..."
                    />
                    {errors.notes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>

                  {/* Comments Section */}
                  {task && (
                    <CommentSection
                      comments={task.comments || []}
                      taskId={task._id as string}
                      onUpdate={() => onSave(task)}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer shadow-sm"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
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
                      ) : task ? (
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <PlusIcon className="h-5 w-5 mr-2" />
                      )}
                      {isSaving
                        ? task
                          ? 'Updating...'
                          : 'Creating...'
                        : task
                        ? 'Update Task'
                        : 'Create Task'}
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
