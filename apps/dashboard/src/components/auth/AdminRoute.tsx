'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * A client-side component that acts as a guard for admin-only routes.
 * It prevents rendering of its children until it has confirmed that the
 * currently logged-in user has the 'ADMIN' role.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render if the user is an admin.
 * @returns {JSX.Element | null} The children components or a loading/redirect state.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  // 1. Get user and authentication loading status from our global AuthContext.
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 2. Introduce a local state to track if admin verification is complete and successful.
  // This is the key to preventing premature rendering of children.
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // This effect runs whenever the authentication status changes.
    // We wait until the initial auth check is complete (`!isAuthLoading`).
    if (!isAuthLoading) {
      if (!user) {
        // CASE 1: No user is logged in. Redirect to the login page.
        // We don't toast here as it's an expected flow.
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        // CASE 2: A user is logged in, but they are NOT an admin.
        // Show an error toast and redirect them to the main dashboard.
        toast.error("Access Forbidden: Admin privileges required.");
        router.push('/dashboard');
      } else {
        // CASE 3: The user is logged in AND they are an admin.
        // The verification is successful. We can now allow children to be rendered.
        setIsVerified(true);
      }
    }
  }, [user, isAuthLoading, router]);

  // 3. This is the gatekeeper.
  // If the verification process is not yet complete (`isVerified` is false),
  // we render a loading state and, crucially, DO NOT render the `{children}`.
  if (!isVerified) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Verifying Admin Access...</h2>
            <p className="text-gray-500 mt-2">Please wait.</p>
            {/* Optional: Add a visual spinner component here */}
          </div>
      </div>
    );
  }

  // 4. Only if `isVerified` is true, we render the actual page content passed as children.
  return <>{children}</>;
}