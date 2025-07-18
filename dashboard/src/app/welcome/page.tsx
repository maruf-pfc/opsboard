'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Lightbulb, Mail, Users } from 'lucide-react'; // Importing icons for visual appeal

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Effect to redirect non-member users to the dashboard
  useEffect(() => {
    if (!isLoading && user && user.role !== 'MEMBER') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  // Display a loading state while authentication is in progress or user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  // If the user's role is not 'MEMBER' after loading, this page is not for them.
  // The useEffect above should handle the redirect, but this acts as a fallback.
  if (user.role !== 'MEMBER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 max-w-4xl w-full text-center transform transition-all duration-300 hover:scale-[1.01]">
        
        {/* Header Section */}
        <div className="mb-8">
          <Lightbulb className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-indigo-600">CPS Task Manager!</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey with efficient task management starts here.
          </p>
        </div>

        {/* Access Information Section */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 sm:p-6 mb-8 rounded-lg text-left shadow-inner">
          <div className="flex items-start">
            <Users className="flex-shrink-0 w-6 h-6 text-indigo-700 mt-1 mr-3" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-2">Limited Access</h2>
              <p className="text-base sm:text-lg text-gray-700">
                You currently have <span className="font-semibold text-indigo-700">limited access</span> to the application's features.
                To unlock the full potential and gain comprehensive access, please reach out to our dedicated team.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 sm:p-6 rounded-lg text-left shadow-inner">
          <div className="flex items-start">
            <Mail className="flex-shrink-0 w-6 h-6 text-purple-700 mt-1 mr-3" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">How to Get Full Access</h2>
              <p className="text-base sm:text-lg text-gray-700">
                Please contact the{' '}
                <span className="font-semibold text-purple-700">CPS Academy Managers</span>{' '}
                to request full access. They will guide you through the process.
              </p>
              <div className="mt-4">
                <a
                  href="mailto:smm@cpsacademy.io" // Replace with actual email
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Managers
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
