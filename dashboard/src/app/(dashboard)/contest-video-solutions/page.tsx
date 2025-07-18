'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ProblemModal, {
  ContestVideoSolution,
} from '@/components/contest-video-solutions/ProblemModal';
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

const platformMeta = {
  'Google Classroom': {
    label: 'Google Classroom',
    color: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
  },
  Website: {
    label: 'Website',
    color: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
  },
};

export default function ContestVideoSolutionsPage() {
  const [problems, setProblems] = useState<ContestVideoSolution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemToEdit, setProblemToEdit] =
    useState<ContestVideoSolution | null>(null);

  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/contest-video-solutions');
      setProblems(data);
    } catch (error) {
      toast.error('Could not load problems.');
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
    fetchProblems();
    fetchUsers();
  }, []);

  const handleProblemSaved = () => {
    fetchProblems();
    setProblemToEdit(null);
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        Loading problems...
      </div>
    );

  return (
    <div className="relative space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 pb-24">
      {/* Floating New Problem Button (mobile) */}
      <button
        onClick={() => {
          setProblemToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-600 hover:to-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="New Problem"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Contest Video Solutions
        </h1>
        <button
          onClick={() => {
            setProblemToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition-all cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          New Problem
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 w-full">
        {Object.entries(statusMeta)
          .filter(
            ([status]) =>
              problems.filter((p) => p.status === status).length > 0,
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
                  {problems.filter((p) => p.status === status).length}
                </span>
              </div>
              <div className="space-y-5 flex-1 min-h-[120px]">
                {problems
                  .filter((p) => p.status === status)
                  .map((problem) => {
                    const PriorityIcon = priorityMeta[problem.priority].icon;
                    return (
                      <button
                        key={problem._id}
                        className="w-full text-left bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-2xl hover:scale-[1.025] focus:ring-2 focus:ring-indigo-400 focus:outline-none cursor-pointer group max-w-full"
                        onClick={() => {
                          setProblemToEdit(problem);
                          setIsModalOpen(true);
                        }}
                        aria-label={`Edit problem ${problem.contestName}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <AcademicCapIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                            <span className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors truncate max-w-[10rem]">
                              {problem.contestName}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${priorityMeta[problem.priority].color}`}
                            >
                              <PriorityIcon className="h-4 w-4" />
                              {priorityMeta[problem.priority].label}
                            </span>
                            {problem.platform ? (
                              platformMeta[problem.platform] ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${platformMeta[problem.platform].color}`}
                                >
                                  {platformMeta[problem.platform].label}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-800">
                                  {problem.platform}
                                </span>
                              )
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 w-full break-words">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {problem.createdAt
                              ? format(new Date(problem.createdAt), 'PP')
                              : '—'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {problem.estimatedTime}h
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Batch:</span>{' '}
                            {problem.batchNo}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Course:</span>{' '}
                            {problem.courseName}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="font-semibold">Online Judge:</span>{' '}
                            {problem.onlineJudge}
                          </span>
                        </div>

                        <div className="flex items-start gap-4 mt-2 flex-col w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Assigned:
                            </span>
                            {problem.assignedTo?.profileImage ? (
                              <img
                                src={problem.assignedTo.profileImage}
                                alt={problem.assignedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border-2 border-indigo-200">
                                {problem.assignedTo?.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-xs text-gray-700 truncate max-w-[8rem]">
                              {problem.assignedTo?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-500">
                              Reported:
                            </span>
                            {problem.reportedTo?.profileImage ? (
                              <img
                                src={problem.reportedTo.profileImage}
                                alt={problem.reportedTo.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-pink-200"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 border-2 border-pink-200">
                                {problem.reportedTo?.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-gray-700 text-xs truncate max-w-[8rem]">
                              {problem.reportedTo?.name}
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
      <ProblemModal
        isOpen={isModalOpen}
        onClose={() => {
          setProblemToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleProblemSaved}
        users={users}
        problem={problemToEdit}
        key={problemToEdit ? problemToEdit._id : 'new'}
      />
    </div>
  );
}
