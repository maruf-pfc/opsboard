"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role === "MEMBER") {
      router.replace("/welcome");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
        <p className="text-gray-600 mt-1">
          View and manage all users in the system.
        </p>
      </div>
      {/* Removed Go to My Profile button; now in sidebar */}
      <UserManagementTable />
    </div>
  );
}
