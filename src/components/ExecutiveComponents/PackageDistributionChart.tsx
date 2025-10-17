import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Package } from 'lucide-react';

interface Props {
  distribution: Record<string, number>;
}

export const PackageDistributionChart: React.FC<Props> = ({ distribution }) => {
  const data = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-100 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Package Distribution</h3>
          <p className="text-sm text-gray-500">Referrals by package type</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No package data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700">{entry.name}</span>
                <span className="text-sm font-semibold text-gray-900 ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
