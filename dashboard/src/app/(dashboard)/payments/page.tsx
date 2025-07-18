'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import { PaymentTable } from '@/components/payments/PaymentTable'; // Assuming PaymentTable is already responsive and beautiful
import { PaymentModal } from '@/components/payments/PaymentModal'; // Assuming PaymentModal is already responsive and beautiful
import { AdminRoute } from '@/components/auth/AdminRoute'; // Assuming AdminRoute handles server-side or initial client-side auth checks
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Interface for payment data
export interface IPayment {
  _id: string;
  trainer: { _id: string; name: string; profileImage?: string };
  name: string;
  details?: {
    courseName?: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
    batchNo?: string;
    classNo?: string;
  };
  classTitle: string;
  amount: number;
  status: 'Pending' | 'Paid';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  startDate?: string;
  dueDate?: string;
  assignedTo?: { _id: string; name: string; profileImage?: string };
  reportedTo?: { _id: string; name: string; profileImage?: string };
  notes?: string;
  paidAt?: string;
  createdAt: string;
  date?: string; // This field might be redundant if createdAt/startDate are used
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<IPayment | null>(null);

  const { user, isLoading: isAuthLoading } = useAuth(); // Renamed isLoading to isAuthLoading to avoid conflict
  const router = useRouter();

  // Role-based access control and redirection
  useEffect(() => {
    if (!isAuthLoading && user) {
      // If user is not ADMIN or MANAGER, redirect to dashboard
      if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
        router.replace('/dashboard');
      }
    }
  }, [user, isAuthLoading, router]);

  // Display loading state for authentication or if user is not loaded
  if (isAuthLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-semibold text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mr-3"></div>
        Loading authentication...
      </div>
    );
  }

  // Display access denied message if user does not have required roles
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-red-50 p-6 rounded-lg shadow-md mx-auto max-w-md text-center">
        <p className="text-xl font-bold text-red-700">Access Denied!</p>
        <p className="text-red-600 mt-2">
          You do not have the necessary permissions to view this page. Please
          contact an administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  // Function to fetch payment records
  const fetchPayments = async () => {
    setIsPaymentsLoading(true);
    try {
      const { data } = await api.get('/payments');
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payment records.');
    } finally {
      setIsPaymentsLoading(false);
    }
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Handlers for modal open/close
  const handleModalOpen = (payment: IPayment | null = null) => {
    setPaymentToEdit(payment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setPaymentToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {' '}
      {/* Adjusted padding and spacing */}
      {/* AdminRoute wrapper (assuming it's a component that renders children if authorized) */}
      <AdminRoute>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 sm:mb-0">
            Payment Records
          </h1>
          <button
            onClick={() => handleModalOpen()}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" />
            Log New Payment
          </button>
        </div>

        {isPaymentsLoading ? (
          <div className="flex justify-center items-center py-10 text-lg font-semibold text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mr-3"></div>
            Loading payment records...
          </div>
        ) : (
          <PaymentTable
            payments={payments}
            onEdit={handleModalOpen}
            onUpdate={fetchPayments}
          />
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={fetchPayments}
          paymentToEdit={paymentToEdit}
        />
      </AdminRoute>
    </div>
  );
}
