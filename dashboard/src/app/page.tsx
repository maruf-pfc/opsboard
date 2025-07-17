'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role === 'MEMBER') {
        router.replace('/welcome');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  return <div>Loading...</div>;
}
