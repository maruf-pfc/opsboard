import Link from 'next/link';
import { format } from 'date-fns';

export function UpcomingClassesList({ classes }: { classes: any[] }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-full flex flex-col min-h-[220px] w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Classes
      </h2>
      <ul className="divide-y divide-gray-200">
        {classes.map((cls) => (
          <li key={cls._id} className="py-3">
            <p className="font-medium text-gray-900">{cls.title}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>With {cls.trainer.name}</span>
              <span>{format(new Date(cls.schedule), 'PP p')}</span>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/classes"
        className="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block cursor-pointer"
      >
        View Full Schedule →
      </Link>
    </div>
  );
}
