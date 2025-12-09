import { BarChart2 } from 'lucide-react';
import { formatNumber, formatPercentage } from '../utils/calculations';
import { useSloContext } from '../contexts/SloProvider';

const ErrorBudgetOverview = () => {
  const { ebRatio, allowedFailures, windowDays } = useSloContext();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
        <BarChart2 className="mr-2 h-5 w-5 text-indigo-500" />
        Error Budget Overview
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="block text-xs font-bold tracking-wide text-gray-500 uppercase">
            Allowed Error Ratio
          </span>
          <span className="mt-2 block text-3xl font-bold text-gray-900">
            {formatPercentage(ebRatio, 4)}
          </span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="block text-xs font-bold tracking-wide text-gray-500 uppercase">
            Allowed Error Events
          </span>
          <span className="mt-2 block text-3xl font-bold text-gray-900">
            {formatNumber(allowedFailures, 0)}
          </span>
          <span className="text-xs text-gray-500">per {windowDays} days</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorBudgetOverview;
