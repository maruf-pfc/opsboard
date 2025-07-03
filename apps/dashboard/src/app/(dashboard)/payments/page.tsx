'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { AdminRoute } from '@/components/auth/AdminRoute';

export interface IPayment {
  _id: string;
  trainer: { _id: string; name: string };
  amount: number;
  month: string;
  status: 'Pending' | 'Paid';
  notes?: string;
  paidAt?: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<IPayment | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/payments');
      setPayments(data);
    } catch (error) {
      toast.error('Failed to fetch payments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleModalOpen = (payment: IPayment | null = null) => {
    setPaymentToEdit(payment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setPaymentToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <AdminRoute>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
            <button
              onClick={() => handleModalOpen()}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5" />
              Create Payment
            </button>
          </div>

          {isLoading ? (
            <p>Loading payment records...</p>
          ) : (
            <PaymentTable
              payments={payments}
              onEdit={handleModalOpen}
              onUpdate={fetchPayments}
            />
          )}

          <PaymentModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onUpdate={fetchPayments}
            paymentToEdit={paymentToEdit}
          />
        </div>
      </AdminRoute>
    </div>
  );
}
