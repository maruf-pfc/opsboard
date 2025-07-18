'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/solid'; // Added PencilIcon for edit button
import { ClassTable } from '@/components/classes/ClassTable'; // Assuming ClassTable is already responsive and beautiful
import ClassModal from '@/components/classes/ClassModal';
import {
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
import { classNames } from '@/lib/utils'; // Assuming classNames utility is available
import KanbanCard from '@/components/kanban/KanbanCard';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

// Meta information for class statuses (re-using from other pages for consistency)
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

// Meta information for class priorities (re-using from other pages for consistency)
const priorityMeta = {
  HIGH: {
    label: 'High',
    color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    icon: ArrowTrendingUpIcon,
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    icon: MinusIcon,
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
    icon: ArrowTrendingDownIcon,
  },
};

export interface IClass {
  _id: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp';
  batchNo: number;
  classNo: number;
  classTitle: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
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
  description?: string;
  schedule?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<IClass | null>(null);

  // Function to fetch all classes
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes.');
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
    fetchClasses();
    fetchUsers();
  }, []);

  // Handlers for modal open/close
  const handleModalOpen = (classItem: IClass | null = null) => {
    setClassToEdit(classItem);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setClassToEdit(null);
    setIsModalOpen(false);
  };

  // Handler for when a class is saved (created or updated)
  const handleClassSaved = () => {
    fetchClasses(); // Re-fetch classes to update the list
    setClassToEdit(null); // Clear class being edited
    setIsModalOpen(false); // Close the modal
  };

  // Display a loading state while classes are being fetched
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading classes...
      </div>
    );

  return (
    <div className="relative space-y-8 p-4 sm:p-6 lg:p-8 pb-24 font-sans">
      {' '}
      {/* Added base padding */}
      {/* Floating New Class Button (mobile) */}
      <button
        onClick={() => {
          setClassToEdit(null);
          setIsModalOpen(true);
        }}
        className="fixed z-50 bottom-6 right-6 md:hidden flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="New Class"
      >
        <PlusIcon className="h-6 w-6" />
        <span className="font-bold">New</span>
      </button>
      {/* Page Header and Desktop New Class Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
          Classes
        </h1>
        <button
          onClick={() => {
            setClassToEdit(null);
            setIsModalOpen(true);
          }}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Class
        </button>
      </div>
      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {' '}
        {/* Adjusted gaps for better spacing */}
        {Object.entries(statusMeta)
          .filter(
            ([status]) => classes.filter((c) => c.status === status).length > 0
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
                  {classes.filter((c) => c.status === status).length}
                </span>
              </div>

              {/* Class Cards within each status column */}
              <div className="space-y-4 flex-1 min-h-[120px]">
                {' '}
                {/* Adjusted space-y */}
                {classes
                  .filter((c) => c.status === status)
                  .map((classItem) => {
                    return (
                      <KanbanCard
                        key={classItem._id}
                        title={classItem.classTitle}
                        description={classItem.description}
                        details={[
                          <span key="course">
                            Course: {classItem.courseName}
                          </span>,
                          <span key="batch">Batch: {classItem.batchNo}</span>,
                          <span key="class">
                            Class No: {classItem.classNo}
                          </span>,
                          <span key="status">Status: {classItem.status}</span>,
                          <span key="priority">
                            Priority: {classItem.priority}
                          </span>,
                          classItem.notes && (
                            <span key="notes">Notes: {classItem.notes}</span>
                          ),
                        ].filter(Boolean)}
                        metaTop={[
                          classItem.schedule && (
                            <span
                              key="start"
                              className="flex items-center gap-1"
                            >
                              <CalendarIcon className="h-4 w-4 text-gray-500" />
                              Start:{' '}
                              {format(new Date(classItem.schedule), 'PPp')}
                            </span>
                          ),
                        ].filter(Boolean)}
                        metaBottom={[
                          classItem.assignedTo && (
                            <span
                              key="assigned"
                              className="flex items-center gap-1"
                            >
                              {classItem.assignedTo.profileImage ? (
                                <img
                                  src={classItem.assignedTo.profileImage}
                                  alt={classItem.assignedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-indigo-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs border-2 border-indigo-300">
                                  {classItem.assignedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Assigned: {classItem.assignedTo.name}</span>
                            </span>
                          ),
                          classItem.reportedTo && (
                            <span
                              key="reported"
                              className="flex items-center gap-1"
                            >
                              {classItem.reportedTo.profileImage ? (
                                <img
                                  src={classItem.reportedTo.profileImage}
                                  alt={classItem.reportedTo.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-pink-300"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-700 text-xs border-2 border-pink-300">
                                  {classItem.reportedTo.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                              <span>Reported: {classItem.reportedTo.name}</span>
                            </span>
                          ),
                        ].filter(Boolean)}
                        priority={classItem.priority}
                        onClick={() => {
                          setClassToEdit(classItem);
                          setIsModalOpen(true);
                        }}
                      />
                    );
                  })}
                {/* Placeholder for empty status columns */}
                {classes.filter((c) => c.status === status).length === 0 && (
                  <div className="p-5 text-center text-gray-400 text-sm italic bg-gray-50 rounded-xl shadow-inner">
                    No classes in this status.
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Class Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleClassSaved}
        users={users}
        classItem={classToEdit}
        key={classToEdit ? classToEdit._id : 'new'} // Key to force re-render for new/edit
      />
    </div>
  );
}
