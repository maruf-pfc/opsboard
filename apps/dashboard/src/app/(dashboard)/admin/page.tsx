'use client';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

export default function AdminPage() {
  return (
    // The AdminRoute component acts as a protective shell.
    <AdminRoute>
      {/* 
        Everything inside here will ONLY be rendered after AdminRoute 
        has confirmed the user is an admin. This prevents UserManagementTable
        from making its API call too early.
      */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage users, view statistics, and configure the application.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <UserManagementTable />
        </div>
      </div>
    </AdminRoute>
  );
}