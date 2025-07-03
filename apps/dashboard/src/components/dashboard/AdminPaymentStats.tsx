import {
  BanknotesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
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

export function AdminPaymentStats({ stats }: { stats: any }) {
  const lastMonth =
    stats.monthlyAnalytics && stats.monthlyAnalytics.length > 0
      ? stats.monthlyAnalytics[0]
      : null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Payment Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Pending Payments"
          value={stats.pendingCount}
          icon={ExclamationTriangleIcon}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Total Amount Due"
          value={`$${stats.dueAmount.toFixed(2)}`}
          icon={BanknotesIcon}
          colorClass="bg-orange-500"
        />
        <StatCard
          title="Total Paid"
          value={`$${stats.paidAmount.toFixed(2)}`}
          icon={BanknotesIcon}
          colorClass="bg-green-500"
        />
      </div>
      {lastMonth && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Payment Analytics (Last 1 Month)
          </h3>
          <ul className="space-y-1">
            <li>
              {lastMonth._id}:{' '}
              <span className="font-bold">
                ${lastMonth.totalPaid.toFixed(2)}
              </span>{' '}
              ({lastMonth.count} payments)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
