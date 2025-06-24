'use client';
// Follows the same pattern as ClassesPage and VideosPage
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function ContestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Upcoming Contests</h1>
      <div className="mt-8 flow-root">
        <ul role="list" className="-mb-8">
            {/* Placeholder List Item */}
            <li>
                <div className="relative pb-8">
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                        <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                <TrophyIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                                <p className="text-sm text-gray-800 font-semibold">Weekly Coding Challenge #12</p>
                                <p className="text-sm text-gray-500">Scheduled for Jan 15, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            {/* You would map over contest data here */}
        </ul>
      </div>
    </div>
  );
}