// src/components/admin/products/StatsView.tsx

import React from 'react';
import { Package, Truck, ClockAlert, CheckCircle, Tag } from 'lucide-react';
import { Stats, ProductRequest } from './types';
import { PACKAGE_COLORS } from './constants';

interface StatsViewProps {
  stats: Stats;
  requests: ProductRequest[];
}

const StatsView: React.FC<StatsViewProps> = ({ stats, requests }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle={`${stats.activeProducts} active`}
          icon={<Package className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          subtitle={`${stats.pendingRequests} pending`}
          icon={<Truck className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Needs attention"
          icon={<ClockAlert className='w-6 h-6'/>}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue}`}
          subtitle="coins earned"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Requests</h2>
        <div className="space-y-3">
          {requests.slice(0, 5).map(request => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={request.product.images[0]}
                  alt={request.product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{request.product.name}</p>
                  <p className="text-xs text-gray-600">{request.user.name}</p>
                  {request.user.packageName && (
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full mt-1 ${PACKAGE_COLORS[request.user.packageName]?.bg} ${PACKAGE_COLORS[request.user.packageName]?.text}`}>
                      <Tag className="w-2.5 h-2.5" />
                      {request.user.packageName}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'yellow' | 'green';
}> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};

export default StatsView;
