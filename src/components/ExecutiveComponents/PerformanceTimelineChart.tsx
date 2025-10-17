import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TimelineData {
  date: string;
  totalUsers: number;
  newUsers: number;
}

interface Props {
  data: TimelineData[];
}

export const PerformanceTimelineChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance Timeline</h3>
          <p className="text-sm text-gray-500">Last 30 days growth</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Active</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#888" />
          <YAxis tick={{ fontSize: 12 }} stroke="#888" allowDecimals={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalUsers" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Total Referrals"
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#10b981" 
            strokeWidth={2}
            name="New Today"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
