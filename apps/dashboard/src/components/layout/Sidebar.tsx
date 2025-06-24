"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  ChartBarIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  TrophyIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from '@/lib/utils';

// Define the navigation items in an array for easy mapping
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  { name: "Tasks", href: "/tasks", icon: CheckBadgeIcon },
  { name: "Classes", href: "/classes", icon: AcademicCapIcon },
  { name: "Problem Solving", href: "/videos", icon: VideoCameraIcon },
  { name: "Contests", href: "/contests", icon: TrophyIcon },
  { name: "Trainer Payments", href: "/payments", icon: CreditCardIcon },
  { name: "Email Marketing", href: "/marketing", icon: EnvelopeIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0"
    >
      <div className="flex flex-col flex-grow bg-gray-800 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">OpsBoard</h1>
          </Link>
        </div>

        <nav className="mt-5 flex-1 flex flex-col">
          <div className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname.startsWith(item.href)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}

            {/* Role-based link for Admins */}
            {user?.role === "ADMIN" && (
              <div className="pt-4 mt-4 border-t border-gray-700">
                <Link
                  href="/admin"
                  className={classNames(
                    pathname.startsWith("/admin")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <ShieldCheckIcon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  Admin Panel
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 group flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white rounded-md transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </motion.div>
  );
}
