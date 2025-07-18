'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { TaskColumn } from './TaskColumn'; // Assuming TaskColumn is already responsive and beautiful
import TaskModal from './TaskModal'; // Assuming TaskModal is already responsive and beautiful
import { PlusIcon } from '@heroicons/react/24/solid';

// Define types to match your backend model
export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  reportedTo: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  courseName?: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo?: string;
  startDate?: string;
  dueDate?: string;
  estimatedTime?: number;
  createdAt: string;
  updatedAt?: string;
  comments?: any[];
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  // Function to fetch all tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Could not load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all users for assignment dropdowns
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
    fetchTasks();
    fetchUsers();
  }, []);

  // Handler for when a task is created or updated
  const handleTaskCreatedOrUpdated = () => {
    fetchTasks(); // Refetch all tasks to update the board
    setTaskToEdit(null); // Clear task being edited
    setIsModalOpen(false); // Close the modal
  };

  // Display a loading state while tasks are being fetched
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading board...
      </div>
    );

  // Define the order of statuses for the columns
  const statuses: ITask['status'][] = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'COMPLETED',
    'BLOCKED',
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 font-sans">
      {' '}
      {/* Added base padding */}
      {/* Page Header and New Task Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          Task Board
        </h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </button>
      </div>
      {/* Task Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {' '}
        {/* Adjusted gaps and added xl:grid-cols-5 */}
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onTaskUpdate={handleTaskCreatedOrUpdated}
          />
        ))}
      </div>
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setTaskToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleTaskCreatedOrUpdated}
        users={users} // Pass users to TaskModal for dropdowns
        task={taskToEdit}
        key={taskToEdit ? taskToEdit._id : 'new'} // Key to force re-render for new/edit
      />
    </div>
  );
}
