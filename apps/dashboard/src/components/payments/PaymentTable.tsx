import { IPayment } from "@/app/(dashboard)/payments/page";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { classNames } from "@/lib/utils";

type PaymentTableProps = {
  payments: IPayment[];
  onEdit: (payment: IPayment) => void;
  onUpdate: () => void;
};

export function PaymentTable({
  payments,
  onEdit,
  onUpdate,
}: PaymentTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this payment record?")) {
      try {
        await api.delete(`/payments/${id}`);
        toast.success("Record deleted!");
        onUpdate();
      } catch (error) {
        toast.error("Failed to delete record.");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Trainer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Paid On
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {payment.trainer.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.month}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={classNames(
                    payment.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800",
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  )}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {payment.paidAt
                  ? format(new Date(payment.paidAt), "PP")
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(payment)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(payment._id)}
                  className="text-red-600 hover:text-red-900"
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
