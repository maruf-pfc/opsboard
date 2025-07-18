'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { TaskStatsCards } from '@/components/dashboard/TaskStatsCards'; // Assuming this component is responsive
import { UserStatsCards } from '@/components/dashboard/UserStatsCards'; // Assuming this component is responsive
import { RecentTasksList } from '@/components/dashboard/RecentTasksList'; // Assuming this component is responsive
import { UpcomingClassesList } from '@/components/dashboard/UpcomingClassesList'; // Assuming this component is responsive
import { AdminPaymentStats } from '@/components/dashboard/AdminPaymentStats'; // Assuming this component is responsive
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
  ChartBarSquareIcon, // Using a more relevant icon for charts
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
        console.error('Error fetching dashboard stats:', error);
        toast.error('Could not load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Display a loading state while dashboard data is being fetched
  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Gathering your workspace insights.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for the monthly payment chart
  const paymentData = stats.payments?.monthlyAnalytics || [];

  const barData = {
    labels: paymentData.map((m) => m._id), // Month labels (e.g., "2023-10")
    datasets: [
      {
        label: 'Total Paid',
        data: paymentData.map((m) => m.totalPaid),
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Tailwind indigo-500 with slight transparency
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 8, // Rounded bars
        barThickness: 'flex' as const, // Adjusts bar width based on available space
        maxBarThickness: 50, // Maximum width for bars
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container
    plugins: {
      legend: {
        display: true, // Display legend
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
          color: '#374151', // gray-700
        },
      },
      title: {
        display: false, // Title is handled by h2 outside the chart
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: {
          size: 14,
          family: 'Inter, sans-serif',
        },
        titleFont: {
          size: 16,
          family: 'Inter, sans-serif',
          weight: 'bold' as const,
        },
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '৳' + context.parsed.y.toLocaleString();
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: '#4B5563', // gray-600
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB', // gray-200
        },
        ticks: {
          callback: function (value: any) {
            return '৳' + value.toLocaleString();
          },
          color: '#4B5563', // gray-600
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow-sm leading-tight">
            Welcome back,{' '}
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {user?.name}!
            </span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-2xl">
            Here's a comprehensive summary of what's happening across your
            workspace.
          </p>
        </div>
        {/* Quick Stats Cards (Total Users, Total Tasks, Total Paid) */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200 min-w-[200px] flex-1 sm:flex-none">
            <UserGroupIcon className="h-9 w-9 opacity-80" />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {stats.users.total}
              </div>
              <div className="text-base font-medium opacity-80">
                Total Users
              </div>
            </div>
          </div>
          {/* Total Tasks Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200 min-w-[200px] flex-1 sm:flex-none">
            <ClipboardDocumentListIcon className="h-9 w-9 opacity-80" />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {stats.tasks.total}
              </div>
              <div className="text-base font-medium opacity-80">
                Total Tasks
              </div>
            </div>
          </div>
          {/* Total Paid Card (Admin Only) */}
          {user?.role === 'ADMIN' && stats.payments && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl hover:scale-105 transition-transform duration-200 min-w-[200px] flex-1 sm:flex-none">
              <CurrencyDollarIcon className="h-9 w-9 opacity-80" />
              <div>
                <div className="text-3xl font-bold leading-tight">
                  ৳{stats.payments.paidAmount.toLocaleString()}
                </div>
                <div className="text-base font-medium opacity-80">
                  Total Paid
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Cards (Task and User) - Now in a vertical stack (3 rows implicitly) */}
      <div className="flex flex-col gap-8">
        {' '}
        {/* Changed to flex-col for vertical stacking */}
        {/* Task Stats Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <TaskStatsCards stats={stats.tasks} />
        </div>
        {/* User Stats Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <UserStatsCards stats={stats.users} />
        </div>
      </div>

      {/* Monthly Payment Analytics Chart (Admin Only) - Now in its own row */}
      {user?.role === 'ADMIN' && stats.payments && (
        <div className="w-full">
          {' '}
          {/* Full width div */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 h-full flex flex-col hover:shadow-3xl transition-shadow duration-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <ChartBarSquareIcon className="h-7 w-7 text-indigo-500" />
              Monthly Payment Analytics
            </h2>
            <div className="flex-1 min-h-[250px] flex items-center justify-center">
              {paymentData.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <CurrencyDollarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-center">
                    No payment data available yet.
                  </p>
                  <p className="text-sm text-center mt-1">
                    Payment analytics will appear here once records are logged.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin-only Payment Summary Stats */}
      {user?.role === 'ADMIN' && stats.payments && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <AdminPaymentStats stats={stats.payments} />
        </div>
      )}

      {/* Two-column layout for Recent and High Priority Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <RecentTasksList tasks={stats.tasks.recent} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <RecentTasksList
            tasks={stats.tasks.highPriority}
            title="High Priority Tasks"
          />
        </div>
      </div>

      {/* Upcoming Classes List (if applicable) */}
      {stats.classes.upcoming && stats.classes.upcoming.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <UpcomingClassesList classes={stats.classes.upcoming} />
        </div>
      )}
    </div>
  );
}
