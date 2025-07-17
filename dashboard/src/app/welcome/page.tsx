'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== 'MEMBER') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;
  if (user.role !== 'MEMBER') return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        Welcome to OpsBoard!
      </h1>
      <p className="text-lg text-gray-700 max-w-xl">
        You currently have limited access. To get access to the full features of
        this application, please contact{' '}
        <span className="font-semibold text-indigo-600">
          CPS Academy Managers
        </span>
        .
      </p>
    </div>
  );
}
