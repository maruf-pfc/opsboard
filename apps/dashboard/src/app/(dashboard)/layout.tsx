'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role === 'MEMBER') {
      router.replace('/welcome');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;
  if (user.role === 'MEMBER') return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 w-full md:pl-64">
          <div className="py-6 px-2 sm:px-4 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
