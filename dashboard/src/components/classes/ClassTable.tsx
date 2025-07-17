import { IClass } from '@/app/(dashboard)/classes/page';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

type ClassTableProps = {
  classes: IClass[];
  onEdit: (classItem: IClass) => void;
  onUpdate: () => void;
};

export function ClassTable({ classes, onEdit, onUpdate }: ClassTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${id}`);
        toast.success('Class deleted!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete class.');
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Class Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Course
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Batch/Class
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Assigned To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Schedule
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((classItem) => (
            <tr key={classItem._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 whitespace-normal break-words">
                  {classItem.classTitle}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {classItem.courseName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Batch {classItem.batchNo} / Class {classItem.classNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    classItem.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : classItem.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : classItem.status === 'IN_REVIEW'
                          ? 'bg-purple-100 text-purple-800'
                          : classItem.status === 'BLOCKED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {classItem.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {classItem.assignedTo.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {classItem.schedule
                  ? format(new Date(classItem.schedule), 'PPP p')
                  : 'Not scheduled'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(classItem)}
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  className="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
