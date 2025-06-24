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
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((classItem) => (
            <tr key={classItem._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{classItem.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.trainer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(classItem.schedule), 'PPP p')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => onEdit(classItem)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-5 w-5"/></button>
                <button onClick={() => handleDelete(classItem._id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}