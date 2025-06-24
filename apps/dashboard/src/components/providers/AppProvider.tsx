'use client';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}