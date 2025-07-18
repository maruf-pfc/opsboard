import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  marketingTaskSchema,
  type MarketingTaskFormData,
} from '@/lib/validations';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface MarketingTask {
  _id?: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  dueDate?: string;
  assignedTo?: User;
  reportedTo?: User;
  type?: string;
  startDate?: string;
  notes?: string;
}

interface MarketingTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<MarketingTask, '_id'>) => void;
  users: User[];
  task: MarketingTask | null;
}

export default function MarketingTaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  task,
}: MarketingTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarketingTaskFormData>({
    resolver: zodResolver(marketingTaskSchema),
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
          ? new Date(task.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
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

  const onSubmit = (data: MarketingTaskFormData) => {
    // Find the user objects from the users array
    const assignedUser = users.find((u) => u._id === data.assignedTo);
    const reportedUser = users.find((u) => u._id === data.reportedTo);

    const payload = {
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      assignedTo: assignedUser || undefined,
      reportedTo: reportedUser || undefined,
      startDate: data.startDate || undefined,
      dueDate: data.dueDate || undefined,
      notes: data.notes,
    };

    onSave(payload);
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
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Task Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Task Details
                </label>
                <textarea
                  {...register('description')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Task Status
                  </label>
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
                  <label className="block text-sm font-medium">
                    Task Priority
                  </label>
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
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.startDate ? 'border-red-500' : ''
                    }`}
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
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.dueDate ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate.message}
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
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  {...register('notes')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${errors.notes ? 'border-red-500' : ''}`}
                  rows={2}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
