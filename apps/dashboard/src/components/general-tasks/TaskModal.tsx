'use client';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ITask } from './TaskBoard';
import { SubtaskList } from './SubtaskList';
import { CommentSection } from './CommentSection';
import { classNames } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  courseName?: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo?: string;
  startDate?: string;
  dueDate?: string;
  estimatedTime?: number;
  createdAt?: string;
  updatedAt?: string;
  comments?: IComment[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  users: User[];
  task: Task | null;
}

// Simple validation schema for task updates
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  reportedTo: z.string().min(1, 'Reported to is required'),
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp']).optional(),
  batchNo: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedTime: z.union([z.string(), z.number()]).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  task,
}: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

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
      courseName: undefined,
      batchNo: '',
      startDate: '',
      dueDate: '',
      estimatedTime: '',
    },
  });

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('assignedTo', task.assignedTo._id);
      setValue('reportedTo', task.reportedTo._id);
      setValue('courseName', task.courseName);
      setValue('batchNo', task.batchNo || '');
      setValue(
        'startDate',
        task.startDate
          ? new Date(task.startDate).toISOString().slice(0, 16)
          : '',
      );
      setValue(
        'dueDate',
        task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      );
      setValue(
        'estimatedTime',
        task.estimatedTime ? (task.estimatedTime / 60).toString() : '',
      );
    } else {
      reset();
    }
  }, [task, setValue, reset]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !task?._id) return;

    try {
      const response = await api.post(`/tasks/${task._id}/comments`, {
        content: newComment.trim(),
      });
      setNewComment('');
      onSave(response.data);
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyContent.trim() || !task?._id) return;
    try {
      const response = await api.post(`/tasks/${task._id}/comments`, {
        content: replyContent.trim(),
        parentId: parentCommentId,
      });
      setReplyContent('');
      setReplyingTo(null);
      onSave(response.data);
      toast.success('Reply added!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add reply');
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        reportedTo: data.reportedTo,
        courseName: data.courseName,
        batchNo: data.batchNo,
        startDate: data.startDate,
        dueDate: data.dueDate,
        estimatedTime: data.estimatedTime
          ? (typeof data.estimatedTime === 'string'
              ? parseFloat(data.estimatedTime)
              : data.estimatedTime) * 60
          : undefined,
      };

      let response;
      if (task && task._id) {
        response = await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated!');
      } else {
        response = await api.post('/tasks', payload);
        toast.success('Task created!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
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
        <div className="flex items-center justify-between py-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              {...register('title')}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Course Name and Batch No */}
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
                <option value="">Select Course</option>
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
                type="text"
                {...register('batchNo')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.batchNo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter batch number"
              />
              {errors.batchNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.batchNo.message}
                </p>
              )}
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
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
                Priority *
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
          </div>

          {/* Assigned To and Reported To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To *
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
                Reported To *
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

          {/* Start Date, Due Date, and Estimated Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
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
                type="datetime-local"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                {...register('estimatedTime')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.estimatedTime ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter estimated time"
              />
              {errors.estimatedTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.estimatedTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            {/* Add New Comment */}
            <div className="mb-4">
              <textarea
                placeholder="Add a comment..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Add Comment
              </button>
            </div>
            {/* Existing Comments with Nested Replies */}
            {task?.comments && task.comments.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-3">
                {task.comments
                  .filter((c) => !c.parentId)
                  .map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {comment.author.profileImage ? (
                          <img
                            src={comment.author.profileImage}
                            alt={comment.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                            {comment.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          className="ml-auto text-indigo-500 hover:text-indigo-700 text-xs font-semibold cursor-pointer"
                          onClick={() => setReplyingTo(comment._id)}
                        >
                          Reply
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {comment.content}
                      </p>
                      {/* Reply input */}
                      {replyingTo === comment._id && (
                        <div className="mb-3 ml-6 border-l-2 border-indigo-200 pl-4">
                          <textarea
                            placeholder="Write a reply..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={2}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => handleAddReply(comment._id)}
                              disabled={!replyContent.trim()}
                              className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Nested replies */}
                      {task.comments &&
                        task.comments.filter((r) => r.parentId === comment._id)
                          .length > 0 && (
                          <div className="ml-12 border-l-2 border-gray-200 pl-4 space-y-2">
                            {task.comments
                              .filter((r) => r.parentId === comment._id)
                              .map((reply) => (
                                <div
                                  key={reply._id}
                                  className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {reply.author.profileImage ? (
                                      <img
                                        src={reply.author.profileImage}
                                        alt={reply.author.name}
                                        className="w-5 h-5 rounded-full"
                                      />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                                        {reply.author.name
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>
                                    )}
                                    <span className="font-medium text-xs">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-indigo-600 font-medium ml-auto">
                                      Reply
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">
                                    {reply.content}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting
                ? 'Saving...'
                : task
                  ? 'Update Task'
                  : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
