import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { classSchema, type ClassFormData } from '@/lib/validations';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Class {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo: number;
  classNo: number;
  classTitle: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  description?: string;
  schedule?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classItem: Class) => void;
  users: User[];
  classItem: Class | null;
}

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  users,
  classItem,
}: ClassModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: 1,
      classNo: 1,
      classTitle: '',
      status: 'TODO',
      priority: 'NORMAL',
      assignedTo: '',
      reportedTo: '',
      description: '',
      schedule: '',
    },
  });

  useEffect(() => {
    if (classItem) {
      reset({
        courseName: classItem.courseName,
        batchNo: classItem.batchNo,
        classNo: classItem.classNo,
        classTitle: classItem.classTitle,
        status: classItem.status,
        priority: classItem.priority,
        assignedTo: classItem.assignedTo?._id || '',
        reportedTo: classItem.reportedTo?._id || '',
        description: classItem.description || '',
        schedule: classItem.schedule || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: 1,
        classNo: 1,
        classTitle: '',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: '',
        reportedTo: '',
        description: '',
        schedule: '',
      });
    }
  }, [classItem, isOpen, reset]);

  const onSubmit = async (data: ClassFormData) => {
    try {
      const payload = {
        courseName: data.courseName,
        batchNo: data.batchNo,
        classNo: data.classNo,
        classTitle: data.classTitle,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        reportedTo: data.reportedTo,
        description: data.description,
        schedule: data.schedule,
      };
      let response;
      if (classItem && classItem._id) {
        response = await api.put(`/classes/${classItem._id}`, payload);
        toast.success('Class updated!');
      } else {
        response = await api.post('/classes', payload);
        toast.success('Class created!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save class.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {classItem ? 'Edit Class' : 'Create New Class'}
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
                type="number"
                {...register('batchNo', { valueAsNumber: true })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.batchNo ? 'border-red-500' : 'border-gray-300'
                }`}
                min={1}
              />
              {errors.batchNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.batchNo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class No
              </label>
              <input
                type="number"
                {...register('classNo', { valueAsNumber: true })}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.classNo ? 'border-red-500' : 'border-gray-300'
                }`}
                min={1}
              />
              {errors.classNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.classNo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Title
              </label>
              <input
                type="text"
                {...register('classTitle')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.classTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter class title"
              />
              {errors.classTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.classTitle.message}
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
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter class description (optional)"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <input
              type="datetime-local"
              {...register('schedule')}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.schedule ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.schedule && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schedule.message}
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
                ? 'Saving...'
                : classItem
                  ? 'Update Class'
                  : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
