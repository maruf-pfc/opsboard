'use client';
import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import MarketingTaskModal from '@/components/email-marketing/MarketingModal';

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

export default function MarketingPage() {
  const [tasks, setTasks] = useState<MarketingTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<MarketingTask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Fetch marketing tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/email-marketing');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleModalOpen = (task: MarketingTask | null = null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleSave = (task: Omit<MarketingTask, '_id'>) => {
    (async () => {
      try {
        if (taskToEdit) {
          // Update existing task
          const res = await api.put(`/email-marketing/${taskToEdit._id}`, {
            ...task,
            type: 'marketing',
          });
          setTasks((prev) =>
            prev.map((t) => (t._id === taskToEdit._id ? res.data : t)),
          );
          toast.success('Task updated');
        } else {
          // Create new task
          const res = await api.post('/email-marketing', {
            ...task,
            type: 'marketing',
          });
          setTasks((prev) => [res.data, ...prev]);
          toast.success('Task created');
        }
        handleModalClose();
      } catch (error) {
        console.error('Error saving task:', error);
        toast.error('Failed to save task');
      }
    })();
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/email-marketing/${taskId}`);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        toast.success('Task deleted');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Email Marketing</h1>
        <p className="text-gray-600 mt-1">
          Manage and assign marketing tasks to your team.
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Marketing Tasks</h2>
          <button
            onClick={() => handleModalOpen()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Create Task
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reported To
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Notes
              </th> */}
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No marketing tasks found. Create your first task!
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div>
                      <div className="font-medium text-gray-900">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'TODO'
                          ? 'bg-gray-100 text-gray-800'
                          : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : task.status === 'IN_REVIEW'
                              ? 'bg-yellow-100 text-yellow-800'
                              : task.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {task.status === 'TODO'
                        ? 'To Do'
                        : task.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : task.status === 'IN_REVIEW'
                            ? 'In Review'
                            : task.status === 'COMPLETED'
                              ? 'Completed'
                              : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'LOW'
                          ? 'bg-green-100 text-green-800'
                          : task.priority === 'NORMAL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {task.priority === 'LOW'
                        ? 'Low'
                        : task.priority === 'NORMAL'
                          ? 'Normal'
                          : 'High'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.startDate
                      ? new Date(task.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.dueDate || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                          src={
                            task.assignedTo?.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo?.name || 'User')}&color=7C3AED&background=EBF4FF`
                          }
                          alt={task.assignedTo?.name || 'User'}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo?.name || 'User')}&color=7C3AED&background=EBF4FF`;
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {task.assignedTo?.name || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                          src={
                            task.reportedTo?.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(task.reportedTo?.name || 'User')}&color=059669&background=ECFDF5`
                          }
                          alt={task.reportedTo?.name || 'User'}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.reportedTo?.name || 'User')}&color=059669&background=ECFDF5`;
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {task.reportedTo?.name || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.notes || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleModalOpen(task)}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs rounded-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transform transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer font-medium"
                      >
                        <PencilIcon className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id || '')}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transform transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer font-medium"
                      >
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <MarketingTaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSave}
          users={users}
          task={taskToEdit}
        />
      )}
    </div>
  );
}
