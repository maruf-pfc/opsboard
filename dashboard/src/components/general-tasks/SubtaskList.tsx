import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ITask } from './TaskBoard'; // Assuming ITask definition is correct
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/solid'; // Added CheckCircleIcon for subtask items

type SubtaskListProps = {
  parentTaskId: string;
  subtasks: ITask[];
  onUpdate: () => void;
};

export function SubtaskList({
  parentTaskId,
  subtasks,
  onUpdate,
}: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) {
      toast.error('Subtask title cannot be empty.');
      return;
    }
    setIsAddingSubtask(true);
    try {
      await api.post('/tasks', {
        title: newSubtaskTitle,
        parentTask: parentTaskId,
        // Inherit some properties from parent task if needed, e.g., assignedTo, reportedTo, status (TODO)
        // This depends on your backend logic for subtask creation
        status: 'TODO', // Default status for new subtasks
        priority: 'NORMAL', // Default priority for new subtasks
        // You might need to pass assignedTo, reportedTo IDs from the parent task modal
        // assignedTo: someAssignedToId,
        // reportedTo: someReportedToId,
      });
      toast.success('Subtask added successfully!');
      setNewSubtaskTitle('');
      onUpdate(); // Trigger update in parent component (e.g., re-fetch task details)
    } catch (error) {
      console.error('Failed to add subtask:', error);
      toast.error('Failed to add subtask. Please try again.');
    } finally {
      setIsAddingSubtask(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
        Subtasks ({subtasks.length})
      </h4>
      {subtasks.length === 0 ? (
        <p className="text-sm text-gray-500 italic mb-4">
          No subtasks yet. Add one below!
        </p>
      ) : (
        <ul className="mt-2 space-y-3 max-h-48 overflow-y-auto pr-2">
          {' '}
          {/* Added max-h and pr-2 for scroll */}
          {subtasks.map((subtask) => (
            <li
              key={subtask._id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-800 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
            >
              <CheckCircleIcon
                className={`h-5 w-5 ${
                  subtask.status === 'COMPLETED'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              />
              <span
                className={`${
                  subtask.status === 'COMPLETED'
                    ? 'line-through text-gray-500'
                    : ''
                }`}
              >
                {subtask.title}
              </span>
              {/* Optional: Add a small status badge or edit/delete button here for subtasks */}
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={handleAddSubtask}
        className="mt-4 flex flex-col sm:flex-row gap-3"
      >
        {' '}
        {/* Responsive layout for form */}
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="flex-grow w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          disabled={isAddingSubtask}
        />
        <button
          type="submit"
          disabled={!newSubtaskTitle.trim() || isAddingSubtask}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isAddingSubtask ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          <span className="ml-2 hidden sm:inline">Add Subtask</span>{' '}
          {/* Show text on larger screens */}
        </button>
      </form>
    </div>
  );
}
