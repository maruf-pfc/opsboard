'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ContestModal, {
  Contest,
} from '@/components/programming-contests/ContestModal';
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

// Extend Contest type to include 'onlineJudge' as 'platform' for display flexibility
type ContestWithPlatform = Contest & { onlineJudge?: string };

// Meta information for contest statuses
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

// Meta information for contest priorities
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

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestWithPlatform[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contestToEdit, setContestToEdit] = useState<Contest | null>(null);

  // Function to fetch all programming contests
  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/programming-contests');
      // Ensure onlineJudge is mapped for display
      const formattedData = data.map((c: Contest) => ({
        ...c,
        platform: c.onlineJudge, // Use onlineJudge as platform for display
      }));
      setContests(formattedData);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Could not load contests.');
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
    fetchContests();
    fetchUsers();
  }, []);

  // Handler for when a contest is saved (created or updated)
  const handleContestSaved = () => {
    fetchContests(); // Re-fetch contests to update the list
    setContestToEdit(null); // Clear contest being edited
    setIsModalOpen(false); // Close the modal
  };

  // Display a loading state while contests are being fetched
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading contests...
      </div>
    );

  return (
    <div className="relative space-y-8 p-4 sm:p-6 lg:p-8 pb-24 font-sans">
      {' '}
      {/* Added base padding */}
      {/* Floating New Contest Button (mobile) */}
      <button
        onClick={() => {
          setContestToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="New Contest"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>
      {/* Page Header and Desktop New Contest Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          Programming Contests
        </h1>
        <button
          onClick={() => {
            setContestToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Contest
        </button>
      </div>
      {/* Contests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {' '}
        {/* Adjusted gaps for better spacing */}
        {Object.entries(statusMeta)
          .filter(
            ([status]) => contests.filter((c) => c.status === status).length > 0
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
                  {contests.filter((c) => c.status === status).length}
                </span>
              </div>

              {/* Contest Cards within each status column */}
              <div className="space-y-4 flex-1 min-h-[120px]">
                {' '}
                {/* Adjusted space-y */}
                {contests
                  .filter((c) => c.status === status)
                  .map((contest) => {
                    return (
                      <KanbanCard
                        key={contest._id}
                        title={contest.contestName}
                        description={''}
                        details={[
                          <span key="course">
                            Course: {contest.courseName}
                          </span>,
                          <span key="batch">Batch: {contest.batchNo}</span>,
                          <span key="oj">
                            Online Judge: {contest.onlineJudge}
                          </span>,
                        ].filter(Boolean)}
                        metaTop={[
                          contest.startDate && (
                            <span
                              key="start"
                              className="flex items-center gap-1"
                            >
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Start: {format(new Date(contest.startDate), 'PP')}
                            </span>
                          ),
                          contest.dueDate && (
                            <span key="due" className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Due: {format(new Date(contest.dueDate), 'PP')}
                            </span>
                          ),
                        ].filter(Boolean)}
                        metaBottom={[
                          contest.assignedTo && (
                            <span
                              key="assigned"
                              className="flex items-center gap-1"
                            >
                              {contest.assignedTo.profileImage ? (
                                <img
                                  src={contest.assignedTo.profileImage}
                                  alt={contest.assignedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-indigo-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs border-2 border-indigo-300">
                                  {contest.assignedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Assigned: {contest.assignedTo.name}</span>
                            </span>
                          ),
                          contest.reportedTo && (
                            <span
                              key="reported"
                              className="flex items-center gap-1"
                            >
                              {contest.reportedTo.profileImage ? (
                                <img
                                  src={contest.reportedTo.profileImage}
                                  alt={contest.reportedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-pink-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 text-xs border-2 border-pink-300">
                                  {contest.reportedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Reported: {contest.reportedTo.name}</span>
                            </span>
                          ),
                        ].filter(Boolean)}
                        priority={
                          contest.priority === 'LOW'
                            ? 'MEDIUM'
                            : contest.priority
                        }
                        onClick={() => {
                          setContestToEdit(contest);
                          setIsModalOpen(true);
                        }}
                      />
                    );
                  })}
                {/* Placeholder for empty status columns */}
                {contests.filter((c) => c.status === status).length === 0 && (
                  <div className="p-5 text-center text-gray-400 text-sm italic bg-gray-50 rounded-xl shadow-inner">
                    No contests in this status.
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Contest Modal */}
      <ContestModal
        isOpen={isModalOpen}
        onClose={() => {
          setContestToEdit(null);
          setIsModalOpen(false);
        }}
        onSave={handleContestSaved}
        users={users}
        contest={contestToEdit}
        key={contestToEdit ? contestToEdit._id : 'new'} // Key to force re-render for new/edit
      />
    </div>
  );
}
