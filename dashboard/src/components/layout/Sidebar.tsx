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
    <div className="flex flex-col flex-grow bg-gray-800 overflow-y-auto h-full shadow-xl">
      {' '}
      {/* Added shadow-xl */}
      {/* Logo and Title Section */}
      <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-700 bg-gray-900">
        {' '}
        {/* Darker background for header */}
        <Link href="/dashboard" className="flex items-center gap-2 py-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md">
            {' '}
            {/* More prominent logo styling */}
            <CheckBadgeIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            CPS Task Manager
          </h1>{' '}
          {/* Enhanced typography */}
        </Link>
      </div>
      {/* Navigation Section */}
      {user?.role === 'MEMBER' ? null : ( // Hide navigation for MEMBER role
        <nav className="mt-5 flex-1 flex flex-col px-4">
          {' '}
          {/* Added px-4 for overall padding */}
          <div className="flex-1 space-y-2">
            {' '}
            {/* Increased space-y for better visual separation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname.startsWith(item.href)
                    ? 'bg-indigo-700 text-white shadow-md' // Active state with indigo background and shadow
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white', // Hover state
                  'group flex items-center px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer' // General link styling
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon
                  className={classNames(
                    pathname.startsWith(item.href)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-300', // Icon color changes with active/hover
                    'mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200' // Increased icon margin
                  )}
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
                    ? 'bg-indigo-700 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer'
                )}
                onClick={() => setMobileOpen(false)}
              >
                <UsersIcon
                  className={classNames(
                    pathname.startsWith('/users')
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-300',
                    'mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200'
                  )}
                />
                Users
              </Link>
            )}
          </div>
          {/* User Profile and Logout Section */}
          <div className="border-t border-gray-700 p-4 mt-6">
            {' '}
            {/* Added mt-6 for separation */}
            <div className="flex items-center gap-3 mb-4">
              {' '}
              {/* Added mb-4 for spacing */}
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-md" // Larger, bordered image
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold text-white border-2 border-indigo-500 shadow-md">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-white">
                <p className="font-semibold text-base">{user?.name}</p>{' '}
                {/* Larger text */}
                <p className="text-sm text-gray-400">{user?.email}</p>{' '}
                {/* Larger text */}
              </div>
            </div>
            {/* My Profile Button */}
            {user && (
              <Link
                href={`/users/${user._id}`}
                className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-2.5 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 cursor-pointer shadow-lg transform hover:-translate-y-0.5" // Enhanced button styling
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </Link>
            )}
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full mt-3 group flex items-center justify-center gap-3 px-4 py-2.5 text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 cursor-pointer shadow-md" // Enhanced button styling
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
        className="md:hidden fixed top-4 left-4 z-40 bg-gray-800 p-2 rounded-lg text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" // Added focus ring and transition
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-60" // Darker, more prominent overlay
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }} // Smoother transition
            className="relative w-64 bg-gray-800 h-full shadow-lg z-50 rounded-r-xl" // Added rounded-r-xl
          >
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1" // Styled close button
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-7 w-7" /> {/* Slightly larger icon */}
            </button>
            {sidebarContent}
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      {/* Removed framer-motion animations for desktop sidebar as it's fixed and always visible */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {sidebarContent}
      </div>
    </>
  );
}
