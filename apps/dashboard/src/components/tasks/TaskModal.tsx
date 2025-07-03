import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ITask } from './TaskBoard';
import { SubtaskList } from './SubtaskList';
import { CommentSection } from './CommentSection';
import { classNames } from '@/lib/utils';

// Define a more detailed type for a user (for the dropdown)
interface User {
  _id: string;
  name: string;
  email: string;
}

// Define a type for a comment
interface IComment {
  _id: string;
  content: string;
  author: { name: string; email: string };
  createdAt: string;
}

// Extend ITask to include the populated fields from the API
interface ITaskDetails extends ITask {
  subtasks?: ITask[];
  comments?: IComment[];
  reportedTo: User;
}

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void; // Used to refresh the main board
  taskToEdit?: ITask | null;
};

export function TaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  taskToEdit,
}: TaskModalProps) {
  const [taskDetails, setTaskDetails] = useState<ITaskDetails | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ITask['status']>('TODO');
  const [priority, setPriority] = useState<ITask['priority']>('NORMAL');
  const [assignedToId, setAssignedToId] = useState<string | undefined>(
    undefined,
  );
  const [dueDate, setDueDate] = useState('');

  // Fetch all users for the assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (error) {
        toast.error('Could not fetch users.');
      }
    };
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Fetch full task details (including subtasks/comments) when editing a task
  const fetchTaskDetails = async (taskId: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/tasks/${taskId}`);
      setTaskDetails(data);
      // Pre-fill form state with fetched data
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus(data.status);
      setPriority(data.priority);
      setAssignedToId(data.assignedTo?._id);
      setDueDate(
        data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
      );
    } catch (error) {
      toast.error('Failed to load task details.');
      onClose(); // Close modal if details can't be fetched
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to decide whether to fetch details (for editing) or reset the form (for creating)
  useEffect(() => {
    if (taskToEdit && isOpen) {
      fetchTaskDetails(taskToEdit._id);
    } else {
      // Reset form state for a new task
      setTaskDetails(null);
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('NORMAL');
      setAssignedToId(undefined);
      setDueDate('');
    }
  }, [taskToEdit, isOpen]);

  const handleDetailsUpdated = () => {
    // If we were editing a task, refetch its details to get the latest data
    if (taskToEdit) {
      fetchTaskDetails(taskToEdit._id);
    }
    // Refresh the main task board
    onTaskCreated();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Title is required.');
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      assignedTo: assignedToId || null,
      dueDate: dueDate || null,
    };

    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit._id}`, taskData);
        toast.success('Task updated successfully!');
      } else {
        await api.post('/tasks', taskData);
        toast.success('Task created successfully!');
        onClose(); // Close modal after creating a new task
      }
      handleDetailsUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white p-0 text-left align-middle shadow-2xl transition-all">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500">
                    <h2 className="text-2xl font-bold text-white">
                      {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                      onClick={onClose}
                      className="text-white hover:text-gray-200 transition cursor-pointer text-2xl font-bold focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="px-8 py-6 bg-white">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
                          <Tab
                            className={({ selected }) =>
                              classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                  ? 'bg-white text-blue-700 shadow'
                                  : 'text-black hover:bg-blue-100',
                              )
                            }
                          >
                            Details
                          </Tab>
                          {taskToEdit && (
                            <>
                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer',
                                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                      ? 'bg-white text-blue-700 shadow'
                                      : 'text-black hover:bg-blue-100',
                                  )
                                }
                              >
                                Subtasks ({taskDetails?.subtasks?.length || 0})
                              </Tab>
                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer',
                                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                      ? 'bg-white text-blue-700 shadow'
                                      : 'text-black hover:bg-blue-100',
                                  )
                                }
                              >
                                Comments ({taskDetails?.comments?.length || 0})
                              </Tab>
                            </>
                          )}
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                          <Tab.Panel className="rounded-xl bg-white p-3 focus:outline-none">
                            <form
                              onSubmit={handleSubmit}
                              className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  placeholder="Task Title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  required
                                  className="w-full text-lg font-semibold border-b focus:outline-none focus:border-indigo-500"
                                />
                                <textarea
                                  placeholder="Add a description..."
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  rows={4}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                />
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Status
                                  </label>
                                  <select
                                    value={status}
                                    onChange={(e) =>
                                      setStatus(
                                        e.target.value as ITask['status'],
                                      )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm cursor-pointer"
                                  >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">
                                      In Progress
                                    </option>
                                    <option value="IN_REVIEW">In Review</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="BLOCKED">Blocked</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Priority
                                  </label>
                                  <select
                                    value={priority}
                                    onChange={(e) =>
                                      setPriority(
                                        e.target.value as ITask['priority'],
                                      )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm cursor-pointer"
                                  >
                                    <option value="LOW">Low</option>
                                    <option value="NORMAL">Normal</option>
                                    <option value="HIGH">High</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Assign To
                                  </label>
                                  <select
                                    value={assignedToId || ''}
                                    onChange={(e) =>
                                      setAssignedToId(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm cursor-pointer"
                                  >
                                    <option value="">Unassigned</option>
                                    {users.map((user) => (
                                      <option key={user._id} value={user._id}>
                                        {user.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Due Date
                                  </label>
                                  <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm cursor-pointer"
                                  />
                                </div>
                              </div>
                              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                                <button
                                  type="button"
                                  onClick={onClose}
                                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </Tab.Panel>
                          {taskToEdit && taskDetails && (
                            <>
                              <Tab.Panel className="rounded-xl bg-white p-3 focus:outline-none">
                                <SubtaskList
                                  parentTaskId={taskDetails._id}
                                  subtasks={taskDetails.subtasks || []}
                                  onUpdate={handleDetailsUpdated}
                                />
                              </Tab.Panel>
                              <Tab.Panel className="rounded-xl bg-white p-3 focus:outline-none">
                                <CommentSection
                                  taskId={taskDetails._id}
                                  comments={taskDetails.comments || []}
                                  onUpdate={handleDetailsUpdated}
                                />
                              </Tab.Panel>
                            </>
                          )}
                        </Tab.Panels>
                      </Tab.Group>
                    )}
                  </div>
                </Dialog.Panel>
              </motion.div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
