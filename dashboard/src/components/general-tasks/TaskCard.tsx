import { useState } from 'react';
import { ITask } from './TaskBoard'; // Assuming ITask definition is correct
import TaskModal from './TaskModal'; // Assuming TaskModal is already responsive and beautiful
import {
  ClockIcon,
  UserCircleIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline'; // Using outline icons for a cleaner look
import { formatDistanceToNow } from 'date-fns';
import { classNames } from '@/lib/utils'; // Assuming classNames utility is available

type TaskCardProps = {
  task: ITask;
  onTaskUpdate: () => void;
};

// Enhanced priority classes with gradients and shadows for better visual distinction
const priorityClasses: Record<ITask['priority'], string> = {
  NORMAL: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm',
  MEDIUM: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-sm',
  HIGH: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm',
};

export function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button // Changed div to button for better accessibility and clickability
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left bg-white rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 group relative" // Enhanced card styling
        aria-label={`View details for task: ${task.title}`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          {' '}
          {/* Adjusted gap and alignment */}
          <h4 className="font-extrabold text-gray-900 break-words flex-1 text-lg sm:text-xl leading-tight group-hover:text-indigo-700 transition-colors duration-200">
            {' '}
            {/* Enhanced typography */}
            {task.title}
          </h4>
          <span
            className={classNames(
              `text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap`, // Adjusted padding
              priorityClasses[task.priority],
              'mt-1 sm:mt-0 sm:ml-2'
            )}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-gray-700 mt-2 flex items-start gap-2 line-clamp-2">
            {' '}
            {/* Darker text, line-clamp for truncation */}
            <Bars3BottomLeftIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />{' '}
            {/* Larger icon, adjusted margin */}
            {task.description}{' '}
            {/* Removed manual substring as line-clamp handles it */}
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-between items-center text-xs text-gray-600 gap-2">
          {' '}
          {/* Added flex-wrap and gap */}
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span>
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <UserCircleIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {task.assignedTo.name}
              </span>{' '}
              {/* Darker text */}
            </div>
          )}
        </div>
      </button>
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onTaskUpdate}
          users={[]} // Ensure users prop is correctly passed from parent if needed by TaskModal
          task={task}
        />
      )}
    </>
  );
}
