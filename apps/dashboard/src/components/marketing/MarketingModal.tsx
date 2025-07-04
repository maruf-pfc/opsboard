import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface MarketingTask {
  _id?: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  dueDate: string;
  assignedTo: User;
  reportedTo: User;
  type?: string;
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<MarketingTask['status']>('TODO');
  const [priority, setPriority] = useState<MarketingTask['priority']>('NORMAL');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<User | undefined>(undefined);
  const [reportedTo, setReportedTo] = useState<User | undefined>(undefined);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'TODO');
    setPriority(task?.priority || 'NORMAL');
    setDueDate(task?.dueDate || '');
    setAssignedTo(task?.assignedTo);
    setReportedTo(task?.reportedTo);
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assignedTo || !reportedTo) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSave({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      reportedTo,
      type: 'marketing',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <h2 className="text-xl font-bold mb-4 cursor-pointer">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Task Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Task Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as MarketingTask['status'])
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Task Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as MarketingTask['priority'])
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Assigned To</label>
              <select
                value={assignedTo?._id || ''}
                onChange={(e) =>
                  setAssignedTo(users.find((u) => u._id === e.target.value))
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Reported To</label>
              <select
                value={reportedTo?._id || ''}
                onChange={(e) =>
                  setReportedTo(users.find((u) => u._id === e.target.value))
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
