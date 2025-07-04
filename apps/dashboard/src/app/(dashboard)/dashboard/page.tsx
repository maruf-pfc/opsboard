'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { TaskStatsCards } from '@/components/dashboard/TaskStatsCards';
import { UserStatsCards } from '@/components/dashboard/UserStatsCards';
import { RecentTasksList } from '@/components/dashboard/RecentTasksList';
import { UpcomingClassesList } from '@/components/dashboard/UpcomingClassesList';
import { AdminPaymentStats } from '@/components/dashboard/AdminPaymentStats';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Define the shape of the data we expect from the API
export interface IDashboardStats {
  tasks: {
    total: number;
    byStatus: {
      TODO: number;
      IN_PROGRESS: number;
      IN_REVIEW: number;
      COMPLETED: number;
      BLOCKED: number;
    };
    byPriority: {
      HIGH: number;
      NORMAL: number;
      LOW: number;
    };
    recent: any[];
    highPriority: any[];
  };
  users: {
    total: number;
    newThisMonth: number;
    managers: number;
    trainers: number;
  };
  classes: {
    upcoming: any[];
  };
  payments?: {
    pendingCount: number;
    pendingAmount: number;
    paidCount: number;
    paidAmount: number;
    dueAmount: number;
    monthlyAnalytics: { _id: string; totalPaid: number; count: number }[];
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/stats');
        setStats(data);
      } catch (error) {
        toast.error('Could not load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return <div>Loading dashboard...</div>;
  }

  const paymentData = stats.payments?.monthlyAnalytics || [];
  const barData = {
    labels: paymentData.map((m) => m._id),
    datasets: [
      {
        label: 'Total Paid',
        data: paymentData.map((m) => m.totalPaid),
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // indigo-500
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              {user?.name}!
            </span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium">
            Here's a summary of what's happening across your workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-start md:justify-end">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl px-7 py-5 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200">
            <UserGroupIcon className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {stats.users.total}
              </div>
              <div className="text-base font-medium opacity-80">
                Total Users
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl px-7 py-5 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200">
            <ClipboardDocumentListIcon className="h-10 w-10 opacity-80" />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {stats.tasks.total}
              </div>
              <div className="text-base font-medium opacity-80">
                Total Tasks
              </div>
            </div>
          </div>
          {user?.role === 'ADMIN' && stats.payments && (
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-2xl px-7 py-5 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200">
              <CurrencyDollarIcon className="h-10 w-10 opacity-80" />
              <div>
                <div className="text-3xl font-bold leading-tight">
                  ${stats.payments.paidAmount.toLocaleString()}
                </div>
                <div className="text-base font-medium opacity-80">
                  Total Paid
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Cards & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Task and User Stats stacked vertically */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <TaskStatsCards stats={stats.tasks} />
          <UserStatsCards stats={stats.users} />
        </div>

        {/* Right Side: Admin-only Payment Chart */}
        {user?.role === 'ADMIN' && stats.payments && (
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-full flex flex-col hover:shadow-3xl transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-500" />
                Payment Analytics (Last 6 Months)
              </h2>
              <div className="flex-1 min-h-[250px]">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin-only Stats */}
      {user?.role === 'ADMIN' && stats.payments && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AdminPaymentStats stats={stats.payments} />
        </div>
      )}

      {/* Two-column layout for lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <RecentTasksList tasks={stats.tasks.recent} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <RecentTasksList
            tasks={stats.tasks.highPriority}
            title="High Priority Tasks"
          />
        </div>
      </div>
    </div>
  );
}
