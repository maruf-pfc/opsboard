'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import TaskModal, { Task } from '@/components/general-tasks/TaskModal';
import {
  PlusIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MinusIcon,
  VideoCameraIcon,
  TrophyIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

const statusMeta = {
  TODO: {
    label: 'To Do',
    color: 'from-gray-400 via-gray-500 to-gray-600',
    icon: ClockIcon,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'from-blue-400 via-blue-500 to-blue-600',
    icon: ArrowTrendingUpIcon,
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'from-purple-400 via-purple-500 to-purple-600',
    icon: EyeIcon,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'from-green-400 via-green-500 to-green-600',
    icon: CheckCircleIcon,
  },
  BLOCKED: {
    label: 'Blocked',
    color: 'from-red-400 via-red-500 to-red-600',
    icon: XCircleIcon,
  },
};

const priorityMeta = {
  HIGH: {
    label: 'High',
    color: 'bg-gradient-to-r from-pink-500 to-red-500 text-white',
    icon: ArrowTrendingUpIcon,
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800',
    icon: MinusIcon,
  },
  LOW: {
    label: 'Low',
    color: 'bg-gradient-to-r from-blue-300 to-blue-500 text-white',
    icon: ArrowTrendingDownIcon,
  },
};

export default function GeneralTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Fetch only general tasks
  const fetchGeneralTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tasks?type=general');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch general tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Could not load users.');
    }
  };

  useEffect(() => {
    fetchGeneralTasks();
    fetchUsers();
  }, []);

  const handleTaskSaved = () => {
    fetchGeneralTasks();
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        Loading tasks...
      </div>
    );

  return (
    <div className="relative space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 pb-24">
      {/* Floating New Task Button (mobile) */}
      <button
        onClick={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-600 hover:to-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="New Task"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          General Tasks ({tasks.length} total)
        </h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition-all cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 w-full">
        {Object.entries(statusMeta)
          .filter(
            ([status]) => tasks.filter((t) => t.status === status).length > 0,
          )
          .map(([status, meta]) => (
            <div key={status} className="flex flex-col h-full">
              {/* Status Header */}
              <div
                className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-gradient-to-r ${meta.color} shadow-md text-white font-bold text-lg sticky top-0 z-10`}
              >
                <meta.icon className="h-6 w-6 mr-1 opacity-90" />
                <span>{meta.label}</span>
                <span className="ml-auto text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </div>
              <div className="space-y-5 flex-1 min-h-[120px]">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => {
                    const PriorityIcon = priorityMeta[task.priority].icon;
                    return (
                      <div
                        key={task._id}
                        onClick={() => {
                          setTaskToEdit(task);
                          setIsModalOpen(true);
                        }}
                        className="w-full text-left bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-2xl hover:scale-[1.025] group max-w-full cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircleIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                            <div className="task-title text-base font-semibold whitespace-normal break-words">
                              {task.title}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${priorityMeta[task.priority].color}`}
                            >
                              <PriorityIcon className="h-4 w-4" />
                              {priorityMeta[task.priority].label}
                            </span>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 w-full break-words">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {task.createdAt
                              ? format(new Date(task.createdAt), 'PP')
                              : '—'}
                          </span>
                          {task.assignedTo && (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-semibold">Assigned:</span>{' '}
                              {task.assignedTo.name}
                            </span>
                          )}
                          {task.reportedTo && (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-semibold">Reported:</span>{' '}
                              {task.reportedTo.name}
                            </span>
                          )}
                          {task.comments && task.comments.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <ChatBubbleLeftIcon className="h-4 w-4" />
                              <span className="font-semibold">
                                Comments:
                              </span>{' '}
                              {task.comments.length}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-4 mt-2 flex-col w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Assigned:
                            </span>
                            {task.assignedTo?.profileImage ? (
                              <img
                                src={task.assignedTo.profileImage}
                                alt={task.assignedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border-2 border-indigo-200">
                                {task.assignedTo?.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-xs text-gray-700 truncate max-w-[8rem]">
                              {task.assignedTo?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Reported:
                            </span>
                            {task.reportedTo?.profileImage ? (
                              <img
                                src={task.reportedTo.profileImage}
                                alt={task.reportedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-pink-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 border-2 border-pink-200">
                                {task.reportedTo?.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-gray-700 text-xs truncate max-w-[8rem]">
                              {task.reportedTo?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setTaskToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleTaskSaved}
        users={users}
        task={taskToEdit}
        key={taskToEdit ? taskToEdit._id : 'new'}
      />
    </div>
  );
}
