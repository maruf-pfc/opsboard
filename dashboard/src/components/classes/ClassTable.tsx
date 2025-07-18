import { IClass } from '@/app/(dashboard)/classes/page'; // Assuming IClass definition is correct
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Using outline icons for a cleaner look
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useState } from 'react'; // Import useState for confirmation dialog

type ClassTableProps = {
  classes: IClass[];
  onEdit: (classItem: IClass) => void;
  onUpdate: () => void;
};

export function ClassTable({ classes, onEdit, onUpdate }: ClassTableProps) {
  // State for custom confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [classToDeleteId, setClassToDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setClassToDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDeleteId) return;

    try {
      await api.delete(`/classes/${classToDeleteId}`);
      toast.success('Class deleted successfully!');
      onUpdate(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete class:', error);
      toast.error('Failed to delete class. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setClassToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setClassToDeleteId(null);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        {' '}
        {/* Enhanced shadow and border */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {' '}
            {/* Lighter header background */}
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl" // Adjusted padding, rounded corner
              >
                Class Title
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Batch/Class
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Schedule
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl"
              >
                {' '}
                {/* Centered actions, rounded corner */}
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 text-lg"
                >
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((classItem) => (
                <tr
                  key={classItem._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {' '}
                  {/* Hover effect */}
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    {' '}
                    {/* Adjusted padding, max-w-xs */}
                    <div className="whitespace-normal break-words font-semibold">
                      {' '}
                      {/* Bold title */}
                      {classItem.classTitle}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {' '}
                    {/* Darker text */}
                    {classItem.courseName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {' '}
                    {/* Darker text */}
                    Batch {classItem.batchNo} / Class {classItem.classNo}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border-2 shadow-sm transition-colors duration-200 ${
                        classItem.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 border-green-400'
                          : classItem.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border-blue-400'
                          : classItem.status === 'IN_REVIEW'
                          ? 'bg-purple-100 text-purple-800 border-purple-400'
                          : classItem.status === 'BLOCKED'
                          ? 'bg-red-100 text-red-800 border-red-400'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      {classItem.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {' '}
                    {/* Darker text */}
                    <div className="flex items-center gap-2">
                      {classItem.assignedTo?.profileImage ? (
                        <img
                          src={classItem.assignedTo.profileImage}
                          alt={classItem.assignedTo.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-indigo-300 shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs border-2 border-indigo-300 shadow-sm">
                          {classItem.assignedTo?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{classItem.assignedTo.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {' '}
                    {/* Darker text */}
                    {classItem.schedule ? (
                      format(new Date(classItem.schedule), 'PPP p')
                    ) : (
                      <span className="text-gray-400 italic">
                        Not scheduled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {' '}
                    {/* Centered actions */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(classItem)}
                        className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Edit Class"
                      >
                        <PencilIcon className="h-4 w-4" />{' '}
                        {/* Icon-only button for edit */}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(classItem._id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Delete Class"
                      >
                        <TrashIcon className="h-4 w-4" />{' '}
                        {/* Icon-only button for delete */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-auto text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this class record? This action
              cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
