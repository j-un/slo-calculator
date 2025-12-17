import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useSloContext } from '../contexts/SloProvider';

const SloCompositionChart = () => {
  const { chartData } = useSloContext();
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 w-full text-left text-sm font-medium text-gray-500">
        Composition
      </h3>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={0}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) =>
                value !== undefined ? `${value}%` : ''
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SloCompositionChart;
