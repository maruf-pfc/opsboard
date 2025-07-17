import {
  CheckBadgeIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const gradients: Record<string, string> = {
  todo: 'from-gray-400 via-gray-500 to-gray-600',
  inprogress: 'from-blue-400 via-blue-500 to-blue-600',
  inreview: 'from-purple-400 via-purple-500 to-purple-600',
  completed: 'from-green-400 via-green-500 to-green-600',
  blocked: 'from-red-400 via-red-500 to-red-600',
  high: 'from-pink-400 via-pink-500 to-pink-600',
  normal: 'from-gray-300 via-gray-400 to-gray-500',
  low: 'from-blue-200 via-blue-300 to-blue-400',
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradientKey,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  gradientKey: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.05 }}
    className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-xl"
  >
    <div
      className={`p-4 rounded-full bg-gradient-to-tr ${gradients[gradientKey]} shadow-lg flex items-center justify-center mb-3`}
    >
      <Icon className="h-8 w-8 text-white" />
    </div>
    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
      {title}
    </p>
    <p className="text-2xl font-extrabold text-gray-800 mt-1">{value}</p>
  </motion.div>
);

export function TaskStatsCards({ stats }: { stats: any }) {
  return (
    <div className="space-y-6 w-full">
      {/* Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <StatCard
          title="To Do"
          value={stats.byStatus.TODO}
          icon={ClockIcon}
          gradientKey="todo"
        />
        <StatCard
          title="In Progress"
          value={stats.byStatus.IN_PROGRESS}
          icon={CheckBadgeIcon}
          gradientKey="inprogress"
        />
        <StatCard
          title="In Review"
          value={stats.byStatus.IN_REVIEW}
          icon={DocumentMagnifyingGlassIcon}
          gradientKey="inreview"
        />
        <StatCard
          title="Completed"
          value={stats.byStatus.COMPLETED}
          icon={CheckCircleIcon}
          gradientKey="completed"
        />
        <StatCard
          title="Blocked"
          value={stats.byStatus.BLOCKED}
          icon={NoSymbolIcon}
          gradientKey="blocked"
        />
      </div>

      {/* Priority Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
        <StatCard
          title="High Priority"
          value={stats.byPriority.HIGH}
          icon={ArrowUpIcon}
          gradientKey="high"
        />
        <StatCard
          title="Normal Priority"
          value={stats.byPriority.NORMAL}
          icon={MinusIcon}
          gradientKey="normal"
        />
        <StatCard
          title="Low Priority"
          value={stats.byPriority.LOW}
          icon={ArrowDownIcon}
          gradientKey="low"
        />
      </div>
    </div>
  );
}
