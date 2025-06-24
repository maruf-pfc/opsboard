import {
  CheckBadgeIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  NoSymbolIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md flex items-center"
  >
    <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export function TaskStatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      <StatCard
        title="To Do"
        value={stats.byStatus.TODO}
        icon={ClockIcon}
        colorClass="bg-gray-500"
      />
      <StatCard
        title="In Progress"
        value={stats.byStatus.IN_PROGRESS}
        icon={CheckBadgeIcon}
        colorClass="bg-blue-500"
      />
      <StatCard
        title="In Review"
        value={stats.byStatus.IN_REVIEW}
        icon={DocumentMagnifyingGlassIcon}
        colorClass="bg-purple-500"
      />
      <StatCard
        title="Completed"
        value={stats.byStatus.COMPLETED}
        icon={CheckCircleIcon}
        colorClass="bg-green-500"
      />
      <StatCard
        title="Blocked"
        value={stats.byStatus.BLOCKED}
        icon={NoSymbolIcon}
        colorClass="bg-red-500"
      />
    </div>
  );
}
