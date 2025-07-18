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
  PencilIcon, // Added PencilIcon for edit button
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { classNames } from '@/lib/utils'; // Assuming classNames utility is available
import KanbanCard from '@/components/kanban/KanbanCard';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

// Meta information for problem statuses
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

// Meta information for problem priorities
const priorityMeta = {
  HIGH: {
    label: 'High',
    color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white', // More vibrant red-pink gradient
    icon: ArrowTrendingUpIcon,
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white', // Darker gray for contrast
    icon: MinusIcon,
  },
  LOW: {
    label: 'Low',
    color: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white', // Blue-cyan gradient
    icon: ArrowTrendingDownIcon,
  },
};

// Meta information for platforms
const platformMeta = {
  'Google Classroom': {
    label: 'Google Classroom',
    color: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white', // Darker blue gradient
  },
  Website: {
    label: 'Website',
    color: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white', // Darker purple gradient
  },
};

export default function ContestVideoSolutionsPage() {
  const [problems, setProblems] = useState<ContestVideoSolution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemToEdit, setProblemToEdit] =
    useState<ContestVideoSolution | null>(null);

  // Function to fetch all contest video solutions
  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/contest-video-solutions');
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Could not load problems.');
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
    fetchProblems();
    fetchUsers();
  }, []);

  // Handler for when a problem is saved (created or updated)
  const handleProblemSaved = () => {
    fetchProblems(); // Re-fetch problems to update the list
    setProblemToEdit(null); // Clear problem being edited
    setIsModalOpen(false); // Close the modal
  };

  // Display a loading state while problems are being fetched
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading problems...
      </div>
    );

  return (
    <div className="relative space-y-8 p-4 sm:p-6 lg:p-8 pb-24 font-sans">
      {' '}
      {/* Added base padding */}
      {/* Floating New Problem Button (mobile) */}
      <button
        onClick={() => {
          setProblemToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="New Problem"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>
      {/* Page Header and Desktop New Problem Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          Contest Video Solutions
        </h1>
        <button
          onClick={() => {
            setProblemToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Problem
        </button>
      </div>
      {/* Problems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {' '}
        {/* Adjusted gaps for better spacing */}
        {Object.entries(statusMeta)
          .filter(
            ([status]) => problems.filter((p) => p.status === status).length > 0
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
                  {problems.filter((p) => p.status === status).length}
                </span>
              </div>

              {/* Problem Cards within each status column */}
              <div className="space-y-4 flex-1 min-h-[120px]">
                {' '}
                {/* Adjusted space-y */}
                {problems
                  .filter((p) => p.status === status)
                  .map((problem) => {
                    return (
                      <KanbanCard
                        key={problem._id}
                        title={problem.contestName}
                        description={''}
                        details={[
                          <span key="course">
                            Course: {problem.courseName}
                          </span>,
                          <span key="batch">Batch: {problem.batchNo}</span>,
                          <span key="oj">
                            Online Judge: {problem.onlineJudge}
                          </span>,
                          <span key="platform">
                            Platform: {problem.platform ?? ''}
                          </span>,
                          <span key="status">Status: {problem.status}</span>,
                          <span key="priority">
                            Priority: {problem.priority}
                          </span>,
                          problem.notes && (
                            <span key="notes">Notes: {problem.notes}</span>
                          ),
                        ].filter(Boolean)}
                        metaTop={[
                          problem.startDate && (
                            <span
                              key="start"
                              className="flex items-center gap-1"
                            >
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Start: {format(new Date(problem.startDate), 'PP')}
                            </span>
                          ),
                          problem.dueDate && (
                            <span key="due" className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Due: {format(new Date(problem.dueDate), 'PP')}
                            </span>
                          ),
                        ].filter(Boolean)}
                        metaBottom={[
                          problem.assignedTo && (
                            <span
                              key="assigned"
                              className="flex items-center gap-1"
                            >
                              {problem.assignedTo.profileImage ? (
                                <img
                                  src={problem.assignedTo.profileImage}
                                  alt={problem.assignedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-indigo-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs border-2 border-indigo-300">
                                  {problem.assignedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Assigned: {problem.assignedTo.name}</span>
                            </span>
                          ),
                          problem.reportedTo && (
                            <span
                              key="reported"
                              className="flex items-center gap-1"
                            >
                              {problem.reportedTo.profileImage ? (
                                <img
                                  src={problem.reportedTo.profileImage}
                                  alt={problem.reportedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-pink-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 text-xs border-2 border-pink-300">
                                  {problem.reportedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Reported: {problem.reportedTo.name}</span>
                            </span>
                          ),
                        ].filter(Boolean)}
                        priority={problem.priority}
                        onClick={() => {
                          setProblemToEdit(problem);
                          setIsModalOpen(true);
                        }}
                      />
                    );
                  })}
                {/* Placeholder for empty status columns */}
                {problems.filter((p) => p.status === status).length === 0 && (
                  <div className="p-5 text-center text-gray-400 text-sm italic bg-gray-50 rounded-xl shadow-inner">
                    No problems in this status.
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Problem Modal */}
      <ProblemModal
        isOpen={isModalOpen}
        onClose={() => {
          setProblemToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleProblemSaved}
        users={users}
        problem={problemToEdit}
        key={problemToEdit ? problemToEdit._id : 'new'} // Key to force re-render for new/edit
      />
    </div>
  );
}
