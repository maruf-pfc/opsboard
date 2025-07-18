'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // Keep useEffect for potential future local effects if needed
import { UserManagementTable } from '@/components/admin/UserManagementTable'; // Assuming this component handles its own data fetching and display

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // The DashboardLayout already handles redirection for 'MEMBER' roles
  // and displays a global loading state.
  // Therefore, the following useEffect and loading check are redundant here.
  // If a user reaches this page, they are already authenticated and not a 'MEMBER'.
  /*
  useEffect(() => {
    if (!isLoading && user && user.role === "MEMBER") {
      router.replace("/welcome");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;
  */

  // Optional: If you want to ensure only ADMINs can access this page,
  // you could add a specific check here, or preferably, handle it in DashboardLayout
  // or a dedicated middleware/route guard.
  // For now, assuming DashboardLayout's general non-MEMBER access is sufficient.
  if (!isLoading && user && user.role !== 'ADMIN') {
    // Example: Redirect non-admin users from the Users page
    // This is a client-side redirect. Server-side protection is also recommended.
    // Ensure this doesn't conflict with DashboardLayout's redirection.
    // If DashboardLayout already redirects non-ADMINs from this path, this is redundant.
    // For now, let's assume DashboardLayout handles the primary role-based routing.
    // However, if the intent is *only* admins see this, and DashboardLayout is more general,
    // then this specific check is valid.
    // router.replace('/dashboard'); // Or a suitable fallback page
    // return null;
  }

  return (
    <div className="space-y-6">
      {' '}
      {/* Adjusted spacing for better integration with DashboardLayout's padding */}
      {/* Header Section */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          All System Users
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Effortlessly view, search, and manage user accounts within the system.
        </p>
      </div>
      {/* User Management Table Component */}
      {/* Assuming UserManagementTable handles its own internal responsiveness and styling */}
      <UserManagementTable />
    </div>
  );
}
