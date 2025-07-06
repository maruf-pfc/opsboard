'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ContestModal, { Contest } from '@/components/contests/ContestModal';
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
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
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

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contestToEdit, setContestToEdit] = useState<Contest | null>(null);

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/contests');
      setContests(data);
    } catch (error) {
      toast.error('Could not load contests.');
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
    fetchContests();
    fetchUsers();
  }, []);

  const handleContestSaved = () => {
    fetchContests();
    setContestToEdit(null);
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        Loading contests...
      </div>
    );

  return (
    <div className="relative space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 pb-24">
      {/* Floating New Contest Button (mobile) */}
      <button
        onClick={() => {
          setContestToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-600 hover:to-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="New Contest"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Contests
        </h1>
        <button
          onClick={() => {
            setContestToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition-all cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          New Contest
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 w-full">
        {Object.entries(statusMeta)
          .filter(
            ([status]) =>
              contests.filter((c) => c.status === status).length > 0,
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
                  {contests.filter((c) => c.status === status).length}
                </span>
              </div>
              <div className="space-y-5 flex-1 min-h-[120px]">
                {contests
                  .filter((c) => c.status === status)
                  .map((contest) => {
                    const PriorityIcon = priorityMeta[contest.priority].icon;
                    return (
                      <button
                        key={contest._id}
                        className="w-full text-left bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-2xl hover:scale-[1.025] focus:ring-2 focus:ring-indigo-400 focus:outline-none cursor-pointer group max-w-full"
                        onClick={() => {
                          setContestToEdit(contest);
                          setIsModalOpen(true);
                        }}
                        aria-label={`Edit contest ${contest.contestName}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <AcademicCapIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                            <span className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors truncate max-w-[10rem]">
                              {contest.contestName}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${priorityMeta[contest.priority].color}`}
                          >
                            <PriorityIcon className="h-4 w-4" />
                            {priorityMeta[contest.priority].label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 w-full break-words">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {contest.createdAt
                              ? format(new Date(contest.createdAt), 'PP')
                              : '—'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {contest.estimatedTime}h
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Batch:</span>{' '}
                            {contest.batchNo}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Course:</span>{' '}
                            {contest.courseName}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Platform:</span>{' '}
                            {contest.platform}
                          </span>
                        </div>
                        <div className="flex items-start gap-4 mt-2 flex-col w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Assigned:
                            </span>
                            {contest.assignedTo?.profileImage ? (
                              <img
                                src={contest.assignedTo.profileImage}
                                alt={contest.assignedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border-2 border-indigo-200">
                                {contest.assignedTo?.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-xs text-gray-700 truncate max-w-[8rem]">
                              {contest.assignedTo?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Reported:
                            </span>
                            {contest.reportedTo?.profileImage ? (
                              <img
                                src={contest.reportedTo.profileImage}
                                alt={contest.reportedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-pink-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 border-2 border-pink-200">
                                {contest.reportedTo?.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-gray-700 text-xs truncate max-w-[8rem]">
                              {contest.reportedTo?.name}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
      <ContestModal
        isOpen={isModalOpen}
        onClose={() => {
          setContestToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleContestSaved}
        users={users}
        contest={contestToEdit}
        key={contestToEdit ? contestToEdit._id : 'new'}
      />
    </div>
  );
}
