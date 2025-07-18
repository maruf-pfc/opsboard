import { IPayment } from '@/app/(dashboard)/payments/page'; // Assuming this path is correct for IPayment interface
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Outline icons for a cleaner look
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns'; // For date formatting
import { classNames, formatDateForDisplay } from '@/lib/utils'; // Assuming formatDateForDisplay is correct
import { useState } from 'react';

// Patch: Extend IPayment.trainer to include profileImage for table display
type TrainerWithProfile = {
  _id: string;
  name: string;
  profileImage?: string; // Add profileImage to trainer type
};
interface PaymentWithTrainerProfile extends Omit<IPayment, 'trainer'> {
  trainer: TrainerWithProfile;
}

type PaymentTableProps = {
  payments: PaymentWithTrainerProfile[]; // Use the extended type
  onEdit: (payment: PaymentWithTrainerProfile) => void;
  onUpdate: () => void;
};

export function PaymentTable({
  payments,
  onEdit,
  onUpdate,
}: PaymentTableProps) {
  // Use a custom confirmation dialog instead of window.confirm for better UI
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentToDeleteId, setPaymentToDeleteId] = useState<string | null>(
    null
  );

  const handleDeleteClick = (id: string) => {
    setPaymentToDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!paymentToDeleteId) return;

    try {
      await api.delete(`/payments/${paymentToDeleteId}`);
      toast.success('Payment record deleted successfully!');
      onUpdate(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('Failed to delete payment record.');
    } finally {
      setShowConfirmDialog(false);
      setPaymentToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setPaymentToDeleteId(null);
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl">
                {' '}
                {/* Rounded corner */}
                Profile
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Class Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl">
                {' '}
                {/* Centered actions, rounded corner */}
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500 text-lg"
                >
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {' '}
                  {/* Hover effect */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.trainer.profileImage ? (
                      <img
                        src={payment.trainer.profileImage}
                        alt={payment.trainer.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border-2 border-indigo-300 shadow-sm">
                        {payment.trainer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.trainer.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                    {' '}
                    {/* Darker text */}
                    {payment.classTitle}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {' '}
                    {/* Truncate long text */}
                    {payment.details?.courseName ||
                    payment.details?.batchNo ||
                    payment.details?.classNo ? (
                      [
                        payment.details?.courseName
                          ? `Course: ${payment.details.courseName}`
                          : null,
                        payment.details?.batchNo
                          ? `Batch: ${payment.details.batchNo}`
                          : null,
                        payment.details?.classNo
                          ? `Class: ${payment.details.classNo}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(', ')
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}{' '}
                    {/* Placeholder for empty details */}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateForDisplay(payment.startDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {' '}
                    {/* Bold amount */}৳ {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 shadow-sm transition-colors duration-200 ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-800 border-green-400'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {' '}
                    {/* Centered actions */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(payment)}
                        className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Edit Payment"
                      >
                        <PencilIcon className="h-4 w-4" />{' '}
                        {/* Icon-only button for edit */}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(payment._id as string)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-110 shadow-md"
                        title="Delete Payment"
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
              Are you sure you want to delete this payment record? This action
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
