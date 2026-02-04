// components/superadmin/RegistrationStatsChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RegistrationStatsChartProps {
  stats: any;
}

const RegistrationStatsChart = ({ stats }: RegistrationStatsChartProps) => {
  const data = [
    { name: 'Pending', count: stats?.pending || 0, fill: '#f59e0b' },
    { name: 'Approved', count: stats?.approved || 0, fill: '#10b981' },
    { name: 'Rejected', count: stats?.rejected || 0, fill: '#ef4444' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Registration Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegistrationStatsChart;
