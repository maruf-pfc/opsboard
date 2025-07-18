import { ITask } from './TaskBoard'; // Import the type from TaskBoard
import { TaskCard } from './TaskCard'; // Assuming TaskCard is already responsive and beautiful
import {
  ClockIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid'; // Importing icons for status

type TaskColumnProps = {
  status: ITask['status'];
  tasks: ITask[];
  onTaskUpdate: () => void;
};

// Enhanced status map with gradients and icons for a more vibrant look
const statusMap: Record<
  ITask['status'],
  { name: string; color: string; icon: React.ElementType }
> = {
  TODO: {
    name: 'To Do',
    color: 'bg-gradient-to-r from-gray-500 to-gray-600', // Darker gray for better contrast
    icon: ClockIcon,
  },
  IN_PROGRESS: {
    name: 'In Progress',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600', // Slightly darker blue
    icon: ArrowTrendingUpIcon,
  },
  IN_REVIEW: {
    name: 'In Review',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600', // Slightly darker purple
    icon: EyeIcon,
  },
  COMPLETED: {
    name: 'Completed',
    color: 'bg-gradient-to-r from-green-500 to-green-600', // Slightly darker green
    icon: CheckCircleIcon,
  },
  BLOCKED: {
    name: 'Blocked',
    color: 'bg-gradient-to-r from-red-500 to-red-600', // Slightly darker red
    icon: XCircleIcon,
  },
};

export function TaskColumn({ status, tasks, onTaskUpdate }: TaskColumnProps) {
  const { name, color, icon: StatusIcon } = statusMap[status];

  return (
    <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-full shadow-md border border-gray-200">
      {' '}
      {/* Enhanced column styling */}
      {/* Column Header */}
      <h3
        className={`font-extrabold text-lg mb-4 flex items-center px-2 py-1 rounded-lg text-white ${color} shadow-sm sticky top-0 z-10`}
      >
        {' '}
        {/* Styled header with gradient */}
        <StatusIcon className="h-5 w-5 mr-2 opacity-90" /> {/* Status icon */}
        {name}
        <span className="ml-auto text-sm font-semibold bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {' '}
          {/* More prominent task count */}
          {tasks.length}
        </span>
      </h3>
      {/* Task Cards Container */}
      <div className="space-y-4 overflow-y-auto flex-1 pr-1 -mr-1">
        {' '}
        {/* Added pr-1 -mr-1 for scrollbar styling */}
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 text-sm italic p-4 bg-white rounded-lg shadow-inner">
            No tasks here.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onTaskUpdate={onTaskUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
