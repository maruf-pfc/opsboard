'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Effect to handle user role-based redirections
  useEffect(() => {
    if (!isLoading && user) {
      // If the user is a MEMBER, redirect them to the welcome page
      if (user.role === 'MEMBER') {
        router.replace('/welcome');
        return; // Exit early as redirection is happening
      }

      // If the current page is 'payments' and the user is NOT an ADMIN,
      // redirect them to the dashboard. This prevents unauthorized access.
      if (pathname.includes('payments') && user.role !== 'ADMIN') {
        router.replace('/dashboard');
        return; // Exit early as redirection is happening
      }
    }
  }, [user, isLoading, router, pathname]); // Dependencies for the effect

  // Display a visually appealing loading state while authentication is in progress or user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // If, after loading, the user's role is still 'MEMBER',
  // this acts as a final guard. The useEffect above should handle the redirect,
  // but this ensures no member sees the dashboard content.
  if (user.role === 'MEMBER') {
    return null;
  }

  return (
    // ProtectedRoute wraps the entire layout to ensure only authenticated users can access
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
        {/* Sidebar component - assumed to be a fixed-width sidebar on medium screens and up.
            Its internal responsiveness (e.g., collapsing on mobile) should be handled within Sidebar. */}
        <Sidebar />

        {/* Main content area, takes remaining width */}
        {/* This div now handles the offset for the fixed sidebar */}
        <div className="flex-1 flex flex-col md:ml-64">
          <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8">
            {' '}
            {/* Main content has internal padding */}
            {/* Wrapper for the main content to give it a card-like appearance */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 h-full">
              {children} {/* Renders the actual page content */}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
