'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import MarketingTaskModal from '@/components/email-marketing/MarketingModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Using solid icons
import { format } from 'date-fns'; // For date formatting

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
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: User;
  reportedTo?: User;
  type?: string;
  startDate?: string;
  notes?: string;
}

// Meta information for task statuses (re-using from GeneralTasksPage for consistency)
const statusMeta = {
  TODO: {
    label: 'To Do',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  BLOCKED: {
    label: 'Blocked',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
};

// Meta information for task priorities (re-using from GeneralTasksPage for consistency)
const priorityMeta = {
  HIGH: {
    label: 'High',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
};

export default function MarketingPage() {
  const [tasks, setTasks] = useState<MarketingTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<MarketingTask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for delete confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

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

  const handleSave = async (taskData: Omit<MarketingTask, '_id'>) => {
    // Renamed 'task' to 'taskData' to avoid conflict
    try {
      if (taskToEdit) {
        // Update existing task
        const res = await api.put(`/email-marketing/${taskToEdit._id}`, {
          ...taskData, // Use taskData here
          type: 'marketing',
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? res.data : t))
        );
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        const res = await api.post('/email-marketing', {
          ...taskData, // Use taskData here
          type: 'marketing',
        });
        setTasks((prev) => [res.data, ...prev]);
        toast.success('Task created successfully!');
      }
      handleModalClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task.');
    }
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskIdToDelete) return;

    try {
      await api.delete(`/email-marketing/${taskIdToDelete}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskIdToDelete));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    } finally {
      setShowConfirmDialog(false);
      setTaskIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setTaskIdToDelete(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {' '}
      {/* Adjusted padding and spacing */}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          Email Marketing Tasks
        </h1>
        <button
          onClick={() => handleModalOpen()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Task
        </button>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        {' '}
        {/* Enhanced shadow, border, and overflow */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          All Marketing Tasks
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-lg font-semibold text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mr-3"></div>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-lg italic">
            No marketing tasks found. Click "Create New Task" to add one!
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              {' '}
              {/* Lighter header background */}
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Reported To
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {' '}
                  {/* Hover effect */}
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <div className="font-semibold text-gray-900">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-gray-600 truncate max-w-[150px] mt-1">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                        statusMeta[task.status]?.color ||
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      {statusMeta[task.status]?.label || task.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                        priorityMeta[task.priority]?.color ||
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      {priorityMeta[task.priority]?.label || task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {task.startDate
                      ? format(new Date(task.startDate), 'PP')
                      : '—'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {task.dueDate ? format(new Date(task.dueDate), 'PP') : '—'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-indigo-300 shadow-sm"
                          src={
                            task.assignedTo?.profileImage ||
                            `https://placehold.co/32x32/EBF4FF/7C3AED?text=${encodeURIComponent(
                              task.assignedTo?.name?.charAt(0).toUpperCase() ||
                                'U'
                            )}`
                          }
                          alt={task.assignedTo?.name || 'User'}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://placehold.co/32x32/EBF4FF/7C3AED?text=${encodeURIComponent(
                              task.assignedTo?.name?.charAt(0).toUpperCase() ||
                                'U'
                            )}`;
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
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-pink-300 shadow-sm"
                          src={
                            task.reportedTo?.profileImage ||
                            `https://placehold.co/32x32/ECFDF5/059669?text=${encodeURIComponent(
                              task.reportedTo?.name?.charAt(0).toUpperCase() ||
                                'U'
                            )}`
                          }
                          alt={task.reportedTo?.name || 'User'}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://placehold.co/32x32/ECFDF5/059669?text=${encodeURIComponent(
                              task.reportedTo?.name?.charAt(0).toUpperCase() ||
                                'U'
                            )}`;
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
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleModalOpen(task)}
                        className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Edit Task"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task._id || '')}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Delete Task"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Marketing Task Modal */}
      {isModalOpen && (
        <MarketingTaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSave}
          users={users}
          task={
            taskToEdit
              ? {
                  ...taskToEdit,
                }
              : null
          }
        />
      )}
      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-auto text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this marketing task? This action
              cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
