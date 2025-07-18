'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import TaskModal, { Task } from '@/components/general-tasks/TaskModal';
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MinusIcon,
  PencilIcon, // Added PencilIcon for edit button
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import KanbanCard from '@/components/kanban/KanbanCard';

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

// Meta information for task statuses
const statusMeta = {
  TODO: {
    label: 'To Do',
    color: 'from-gray-500 to-gray-600', // Darker gray for better contrast
    icon: ClockIcon,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'from-blue-500 to-blue-600', // Slightly darker blue
    icon: ArrowTrendingUpIcon,
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'from-purple-500 to-purple-600', // Slightly darker purple
    icon: EyeIcon,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'from-green-500 to-green-600', // Slightly darker green
    icon: CheckCircleIcon,
  },
  BLOCKED: {
    label: 'Blocked',
    color: 'from-red-500 to-red-600', // Slightly darker red
    icon: XCircleIcon,
  },
};

// Meta information for task priorities
const priorityMeta = {
  HIGH: {
    label: 'High',
    color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    icon: ArrowTrendingUpIcon,
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    icon: MinusIcon,
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
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
      console.error('Error fetching general tasks:', error);
      toast.error('Failed to fetch general tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users for assignment dropdowns
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Could not load users.');
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchGeneralTasks();
    fetchUsers();
  }, []);

  // Handler for when a task is saved (created or updated)
  const handleTaskSaved = () => {
    fetchGeneralTasks(); // Re-fetch tasks to update the list
    setTaskToEdit(null); // Clear task being edited
    setIsModalOpen(false); // Close the modal
  };

  // Display a loading state while tasks are being fetched
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading tasks...
      </div>
    );

  return (
    <div className="relative space-y-8 p-4 sm:p-6 lg:p-8 pb-24 font-sans">
      {' '}
      {/* Added base padding */}
      {/* Floating New Task Button (mobile) */}
      <button
        onClick={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="New Task"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>
      {/* Page Header and Desktop New Task Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          General Tasks ({tasks.length} total)
        </h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </button>
      </div>
      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {' '}
        {/* Adjusted gaps for better spacing */}
        {/* Filter status columns to only show those with tasks */}
        {Object.entries(statusMeta)
          .filter(
            ([status]) => tasks.filter((t) => t.status === status).length > 0
          )
          .map(([status, meta]) => (
            <div key={status} className="flex flex-col h-full">
              {/* Status Header (Sticky for scrolling lists) */}
              <div
                className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-gradient-to-r ${meta.color} shadow-lg text-white font-bold text-lg sticky top-0 z-10`}
              >
                <meta.icon className="h-6 w-6 mr-1 opacity-90" />
                <span>{meta.label}</span>
                <span className="ml-auto text-sm font-medium bg-white/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  {' '}
                  {/* More prominent count */}
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </div>

              {/* Task Cards within each status column */}
              <div className="space-y-4 flex-1 min-h-[120px]">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => {
                    return (
                      <KanbanCard
                        key={task._id}
                        title={task.title}
                        description={task.description}
                        details={[
                          <span key="status">Status: {task.status}</span>,
                          <span key="priority">Priority: {task.priority}</span>,
                          task.notes && (
                            <span key="notes">Notes: {task.notes}</span>
                          ),
                        ].filter(Boolean)}
                        metaTop={[
                          task.startDate && (
                            <span
                              key="start"
                              className="flex items-center gap-1"
                            >
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Start: {format(new Date(task.startDate), 'PP')}
                            </span>
                          ),
                          task.dueDate && (
                            <span key="due" className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Due: {format(new Date(task.dueDate), 'PP')}
                            </span>
                          ),
                        ].filter(Boolean)}
                        metaBottom={[
                          task.assignedTo && (
                            <span
                              key="assigned"
                              className="flex items-center gap-1"
                            >
                              {task.assignedTo.profileImage ? (
                                <img
                                  src={task.assignedTo.profileImage}
                                  alt={task.assignedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-indigo-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs border-2 border-indigo-300">
                                  {task.assignedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Assigned: {task.assignedTo.name}</span>
                            </span>
                          ),
                          task.reportedTo && (
                            <span
                              key="reported"
                              className="flex items-center gap-1"
                            >
                              {task.reportedTo.profileImage ? (
                                <img
                                  src={task.reportedTo.profileImage}
                                  alt={task.reportedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-pink-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 text-xs border-2 border-pink-300">
                                  {task.reportedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Reported: {task.reportedTo.name}</span>
                            </span>
                          ),
                        ].filter(Boolean)}
                        priority={task.priority}
                        onClick={() => {
                          setTaskToEdit(task);
                          setIsModalOpen(true);
                        }}
                      />
                    );
                  })}
                {/* Placeholder for empty status columns */}
                {tasks.filter((t) => t.status === status).length === 0 && (
                  <div className="p-5 text-center text-gray-400 text-sm italic bg-gray-50 rounded-xl shadow-inner">
                    No tasks in this status.
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setTaskToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleTaskSaved}
        users={users}
        task={taskToEdit}
        key={taskToEdit ? taskToEdit._id : 'new'} // Key to force re-render for new/edit
      />
    </div>
  );
}
