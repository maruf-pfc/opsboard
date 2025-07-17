'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { TaskColumn } from './TaskColumn';
import TaskModal from './TaskModal';
import { PlusIcon } from '@heroicons/react/24/solid';

// Define types to match your backend model
export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
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

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Could not load tasks.');
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
    fetchTasks();
    fetchUsers();
  }, []);

  const handleTaskCreatedOrUpdated = () => {
    fetchTasks(); // Refetch all tasks
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Loading board...</div>;

  const statuses: ITask['status'][] = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'COMPLETED',
    'BLOCKED',
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onTaskUpdate={handleTaskCreatedOrUpdated}
          />
        ))}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setTaskToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleTaskCreatedOrUpdated}
        users={users}
        task={taskToEdit}
      />
    </div>
  );
}
