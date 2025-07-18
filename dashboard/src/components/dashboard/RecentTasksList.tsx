import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

/**
 * Defines the shape of a single task object that this component expects to receive.
 * This should match the data structure sent from the backend's `statsController`.
 */
interface Task {
  _id: string;
  title: string;
  createdAt: string; // The backend sends this as an ISO string
  assignedTo?: {
    // This field is optional as a task might be unassigned
    name: string;
  };
}

interface RecentTasksListProps {
  tasks: Task[];
  title?: string;
}

/**
 * A dashboard component that displays a list of the 5 most recently created tasks.
 * It shows key information and provides a link to the main tasks page.
 *
 * @param {object} props - The component props.
 * @param {Task[]} props.tasks - An array of recent task objects.
 * @returns {JSX.Element} A styled card component with the list of tasks.
 */
export function RecentTasksList({
  tasks,
  title = 'Recently Created Tasks',
}: RecentTasksListProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-full flex flex-col min-h-[220px] w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      <div className="flex-grow">
        {/* Check if there are any tasks to display */}
        {tasks && tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {/* Map over the tasks array to create a list item for each one */}
            {tasks.map((task) => (
              <li key={task._id} className="py-3">
                <p className="font-medium text-gray-900 whitespace-normal break-words">
                  {task.title}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>
                    Assigned to: {task.assignedTo?.name || 'Unassigned'}
                  </span>
                  {/* Use date-fns to format the timestamp into a relative time (e.g., "about 5 hours ago") */}
                  <span className="flex-shrink-0">
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Display a helpful message if the tasks array is empty
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No recent tasks
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
          </div>
        )}
      </div>

      {/* This link is always visible, encouraging users to visit the main tasks page */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/tasks"
          className="w-full text-center block text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
        >
          View All Tasks →
        </Link>
      </div>
    </div>
  );
}
