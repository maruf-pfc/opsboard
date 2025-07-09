'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export interface IPayment {
  _id: string;
  trainer: { _id: string; name: string; role?: string; profileImage?: string };
  amount: number;
  status: 'Pending' | 'Paid';
  notes?: string;
  paidAt?: string;
  createdAt: string;
  details?: {
    courseName?: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
    batchNo?: string;
    classNo?: string;
  };
  date?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<IPayment | null>(null);

  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);
  if (isLoading || !user) return <div>Loading...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return (
      <div className="text-center text-red-500 font-bold mt-10">
        Access Denied: Only ADMIN and MANAGER can view this page.
      </div>
    );
  }

  const fetchPayments = async () => {
    setIsPaymentsLoading(true);
    try {
      const { data } = await api.get('/payments');
      console.log('Fetched payments:', data); // DEBUG LOG
      setPayments(data);
    } catch (error) {
      toast.error('Failed to fetch payments.');
    } finally {
      setIsPaymentsLoading(false);
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
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 cursor-pointer"
            >
              <PlusIcon className="h-5 w-5" />
              Create Payment
            </button>
          </div>

          {isPaymentsLoading ? (
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
