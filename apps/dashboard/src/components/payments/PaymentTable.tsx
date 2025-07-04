import { IPayment } from '@/app/(dashboard)/payments/page';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { classNames } from '@/lib/utils';

// Patch: Extend IPayment.trainer to include role for table display
type TrainerWithRole = {
  _id: string;
  name: string;
  role?: string;
  profileImage?: string;
};
interface PaymentWithRole extends Omit<IPayment, 'trainer'> {
  trainer: TrainerWithRole;
}

type PaymentTableProps = {
  payments: PaymentWithRole[];
  onEdit: (payment: PaymentWithRole) => void;
  onUpdate: () => void;
};

export function PaymentTable({
  payments,
  onEdit,
  onUpdate,
}: PaymentTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this payment record?')) {
      try {
        await api.delete(`/payments/${id}`);
        toast.success('Record deleted!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete record.');
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.trainer.profileImage ? (
                  <img
                    src={payment.trainer.profileImage}
                    alt={payment.trainer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                    {payment.trainer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {payment.trainer.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.trainer.role === 'TRAINER' &&
                payment.courseName &&
                payment.batchNo &&
                payment.classNo
                  ? `Course: ${payment.courseName}, Batch: ${payment.batchNo}, Class: ${payment.classNo}`
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.trainer.role || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(payment.createdAt), 'PP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 shadow-sm ${
                    payment.status === 'Paid'
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="space-x-2 flex items-center justify-center">
                  <button
                    onClick={() => onEdit(payment)}
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs rounded-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transform transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  >
                    Edit
                  </button>
                  <a
                    href="#"
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
