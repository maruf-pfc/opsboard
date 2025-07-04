import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Contest {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo: number;
  contestName: string;
  platform: 'Leetcode' | 'Vjudge';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  estimatedTime: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contest: Contest) => void;
  users: User[];
  contest: Contest | null;
}

export default function ContestModal({
  isOpen,
  onClose,
  onSave,
  users,
  contest,
}: ContestModalProps) {
  const [courseName, setCourseName] = useState<Contest['courseName']>('CPC');
  const [batchNo, setBatchNo] = useState<number>(1);
  const [contestName, setContestName] = useState('');
  const [platform, setPlatform] = useState<Contest['platform']>('Leetcode');
  const [status, setStatus] = useState<Contest['status']>('TODO');
  const [priority, setPriority] = useState<Contest['priority']>('NORMAL');
  const [assignedTo, setAssignedTo] = useState<User | undefined>(undefined);
  const [reportedTo, setReportedTo] = useState<User | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCourseName(contest?.courseName || 'CPC');
    setBatchNo(contest?.batchNo || 1);
    setContestName(contest?.contestName || '');
    setPlatform(contest?.platform || 'Leetcode');
    setStatus(contest?.status || 'TODO');
    setPriority(contest?.priority || 'NORMAL');
    setAssignedTo(contest?.assignedTo);
    setReportedTo(contest?.reportedTo);
    setEstimatedTime(contest?.estimatedTime || '');
  }, [contest, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !courseName ||
      !batchNo ||
      !contestName ||
      !platform ||
      !status ||
      !priority ||
      !assignedTo ||
      !reportedTo ||
      !estimatedTime
    ) {
      toast.error('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        courseName,
        batchNo,
        contestName,
        platform,
        status,
        priority,
        assignedTo: assignedTo._id,
        reportedTo: reportedTo._id,
        estimatedTime,
      };
      let response;
      if (contest && contest._id) {
        response = await api.put(`/contests/${contest._id}`, payload);
        toast.success('Contest updated!');
      } else {
        response = await api.post('/contests', payload);
        toast.success('Contest created!');
      }
      onSave(response.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save contest.');
    } finally {
      setLoading(false);
    }
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
          {contest ? 'Edit Contest' : 'Create Contest'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Course Name</label>
              <select
                value={courseName}
                onChange={(e) =>
                  setCourseName(e.target.value as Contest['courseName'])
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="CPC">CPC</option>
                <option value="JIPC">JIPC</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Batch No</label>
              <input
                type="number"
                value={batchNo}
                onChange={(e) => setBatchNo(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
                min={1}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Contest Name</label>
            <input
              type="text"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Platform</label>
              <select
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value as Contest['platform'])
                }
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="Leetcode">Leetcode</option>
                <option value="Vjudge">Vjudge</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Estimated Time (hours)
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="e.g. 2, 3.5"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Contest['status'])}
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
              <label className="block text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Contest['priority'])
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-semibold cursor-pointer"
              disabled={loading}
            >
              {loading
                ? contest
                  ? 'Updating...'
                  : 'Creating...'
                : contest
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
