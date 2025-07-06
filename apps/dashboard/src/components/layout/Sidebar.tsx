'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  ChartBarIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  TrophyIcon,
  UsersIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { classNames } from '@/lib/utils';
import { useState } from 'react';

// Define the navigation items in an array for easy mapping
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'General Tasks', href: '/general-tasks', icon: CheckBadgeIcon },
  { name: 'Classes', href: '/classes', icon: AcademicCapIcon },
  {
    name: 'Contest Video Solutions',
    href: '/contest-video-solutions',
    icon: VideoCameraIcon,
  },
  {
    name: 'Programming Contests',
    href: '/programming-contests',
    icon: TrophyIcon,
  },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Email Marketing', href: '/email-marketing', icon: EnvelopeIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <div className="flex flex-col flex-grow bg-gray-800 overflow-y-auto h-full">
      <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <CheckBadgeIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">OpsBoard</h1>
        </Link>
      </div>
      {/* If user is MEMBER, hide all navigation and user info */}
      {user?.role === 'MEMBER' ? null : (
        <nav className="mt-5 flex-1 flex flex-col">
          <div className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname.startsWith(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer',
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
            {/* Users link for ADMIN, MANAGER, TRAINER */}
            {user && ['ADMIN', 'MANAGER', 'TRAINER'].includes(user.role) && (
              <Link
                href="/users"
                className={classNames(
                  pathname.startsWith('/users')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer',
                )}
                onClick={() => setMobileOpen(false)}
              >
                <UsersIcon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Users
              </Link>
            )}
          </div>
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center gap-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-white">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 group flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      )}
    </div>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-gray-800 p-2 rounded-lg text-white shadow-lg focus:outline-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="relative w-64 bg-gray-800 h-full shadow-lg z-50"
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            {sidebarContent}
          </motion.div>
        </div>
      )}
      {/* Desktop sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0"
      >
        {sidebarContent}
      </motion.div>
    </>
  );
}
