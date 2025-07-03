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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's a summary of what's happening across your workspace.
        </p>
      </div>

      {/* Main Stats Cards */}
      <TaskStatsCards stats={stats.tasks} />
      <UserStatsCards stats={stats.users} />

      {/* Admin-only Stats */}
      {user?.role === 'ADMIN' && stats.payments && (
        <AdminPaymentStats stats={stats.payments} />
      )}

      {/* Priority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Task Priority Overview
          </h2>
          <ul className="space-y-2">
            <li>
              High Priority:{' '}
              <span className="font-bold">{stats.tasks.byPriority.HIGH}</span>
            </li>
            <li>
              Normal Priority:{' '}
              <span className="font-bold">{stats.tasks.byPriority.NORMAL}</span>
            </li>
            <li>
              Low Priority:{' '}
              <span className="font-bold">{stats.tasks.byPriority.LOW}</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            User Roles
          </h2>
          <ul className="space-y-2">
            <li>
              Managers:{' '}
              <span className="font-bold">{stats.users.managers}</span>
            </li>
            <li>
              Trainers:{' '}
              <span className="font-bold">{stats.users.trainers}</span>
            </li>
          </ul>
        </div>
        {user?.role === 'ADMIN' && stats.payments && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Payment Analytics (Last 6 Months)
            </h2>
            <ul className="space-y-2">
              {stats.payments.monthlyAnalytics.map((m) => (
                <li key={m._id}>
                  {m._id}:{' '}
                  <span className="font-bold">${m.totalPaid.toFixed(2)}</span> (
                  {m.count} payments)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Two-column layout for lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentTasksList tasks={stats.tasks.recent} />
        <RecentTasksList
          tasks={stats.tasks.highPriority}
          title="High Priority Tasks"
        />
      </div>
    </div>
  );
}
