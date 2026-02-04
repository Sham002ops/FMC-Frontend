// components/superadmin/SuperAdminStats.tsx
import { CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

interface SuperAdminStatsProps {
  stats: any;
}

const SuperAdminStats = ({ stats }: SuperAdminStatsProps) => {
  const statCards = [
    {
      title: 'Pending Requests',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: XCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'Recent Approvals',
      value: stats?.recentApprovedUsers || 0,
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      subtitle: 'Last 7 days'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <h3 className={`text-3xl sm:text-4xl font-bold ${card.textColor}`}>
                {card.value}
              </h3>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
            <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl shadow-md`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="w-full bg-white/50 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${card.color} animate-pulse`}
              style={{ width: '70%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminStats;
