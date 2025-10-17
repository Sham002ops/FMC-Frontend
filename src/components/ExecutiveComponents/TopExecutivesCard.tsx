import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Trophy, TrendingUp, Users, DollarSign, Award, Crown } from 'lucide-react';

interface ExecutivePerformance {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalUsers: number;
  totalRevenue: number;
  monthUsers: number;
  monthRevenue: number;
}

export const TopExecutivesCard: React.FC = () => {
  const [executives, setExecutives] = useState<ExecutivePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopExecutives();
  }, []);

  const fetchTopExecutives = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${BackendUrl}/executive/top-executives`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExecutives(data.executives);
    } catch (err) {
      console.error('Error fetching top executives:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topThree = executives.slice(0, 3);
  const hasData = executives.some(e => e.totalRevenue > 0 || e.totalUsers > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Top Performing Executives</h2>
            <p className="text-sm text-gray-500">MVP executives of the month</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No executive data available yet</p>
          <p className="text-xs text-gray-400 mt-1">Performance data will appear once users are referred</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Top Performing Executives</h2>
              <p className="text-sm text-white/90">MVP executives of the month</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold">Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {topThree.map((exec, index) => (
            <ExecutiveCard
              key={exec.id}
              executive={exec}
              rank={index + 1}
            />
          ))}
        </div>

        {/* Rest of the executives */}
        {executives.length > 3 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Other Performers</h3>
            {executives.slice(3, 8).map((exec, index) => (
              <ExecutiveRow
                key={exec.id}
                executive={exec}
                rank={index + 4}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        {executives.length > 8 && (
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All {executives.length} Executives →
          </button>
        )}
      </div>
    </div>
  );
};

// Top 3 Executive Card (Podium Style)
const ExecutiveCard: React.FC<{
  executive: ExecutivePerformance;
  rank: number;
}> = ({ executive, rank }) => {
  const rankStyles = {
    1: {
      border: 'border-yellow-400 shadow-yellow-200',
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      icon: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      badge: 'bg-yellow-400 text-yellow-900'
    },
    2: {
      border: 'border-gray-400 shadow-gray-200',
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      icon: 'bg-gradient-to-br from-gray-400 to-gray-500',
      badge: 'bg-gray-400 text-gray-900'
    },
    3: {
      border: 'border-orange-400 shadow-orange-200',
      bg: 'bg-gradient-to-br from-orange-50 to-red-50',
      icon: 'bg-gradient-to-br from-orange-400 to-red-500',
      badge: 'bg-orange-400 text-orange-900'
    }
  };

  const style = rankStyles[rank as 1 | 2 | 3];

  return (
    <div className={`relative border-2 ${style.border} ${style.bg} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all`}>
      {/* Rank Badge */}
      <div className="absolute -top-3 -right-3">
        <div className={`${style.icon} w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
          {rank === 1 ? (
            <Crown className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white font-bold text-lg">#{rank}</span>
          )}
        </div>
      </div>

      {/* Executive Info */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 text-lg truncate">{executive.name}</h3>
        <p className="text-xs text-gray-600 truncate">{executive.email}</p>
        <span className="inline-block mt-1 text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          {executive.referralCode}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <DollarSign className="w-4 h-4 text-green-600" />
            Revenue
          </span>
          <span className="font-bold text-gray-900">
            ₹{executive.totalRevenue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4 text-blue-600" />
            Referrals
          </span>
          <span className="font-bold text-gray-900">{executive.totalUsers}</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>This Month</span>
            <span className="font-semibold">
              ₹{executive.monthRevenue.toLocaleString()} • {executive.monthUsers} users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Row for executives ranked 4+
const ExecutiveRow: React.FC<{
  executive: ExecutivePerformance;
  rank: number;
}> = ({ executive, rank }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
      {/* Rank */}
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
        #{rank}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{executive.name}</h4>
        <p className="text-xs text-gray-500 truncate">{executive.email}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-right">
          <p className="font-bold text-gray-900">₹{executive.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{executive.totalUsers} users</p>
        </div>
      </div>
    </div>
  );
};
