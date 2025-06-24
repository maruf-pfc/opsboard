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
        recent: any[]; // Define more specific type later
    };
    users: {
        total: number;
        newThisMonth: number;
    };
    classes: {
        upcoming: any[]; // Define more specific type later
    };
    payments?: { // Optional for non-admins
        pendingCount: number;
        pendingAmount: number;
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
                toast.error("Could not load dashboard statistics.");
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
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600 mt-1">Here's a summary of what's happening across your workspace.</p>
            </div>
            
            {/* Main Stats Cards */}
            <TaskStatsCards stats={stats.tasks} />
            <UserStatsCards stats={stats.users} />
            
            {/* Admin-only Stats */}
            {user?.role === 'ADMIN' && stats.payments && <AdminPaymentStats stats={stats.payments} />}

            {/* Two-column layout for lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentTasksList tasks={stats.tasks.recent} />
                <UpcomingClassesList classes={stats.classes.upcoming} />
            </div>
        </div>
    );
}