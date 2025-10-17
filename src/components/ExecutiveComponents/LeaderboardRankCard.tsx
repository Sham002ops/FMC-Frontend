import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface Props {
  rank: number;
  totalExecutives: number;
  growth: number;
}

export const LeaderboardRankCard: React.FC<Props> = ({ rank, totalExecutives, growth }) => {
  const percentile = Math.round(((totalExecutives - rank) / totalExecutives) * 100);
  
  const getRankBadge = () => {
    if (rank === 1) return { icon: Trophy, color: 'from-yellow-400 to-orange-500 text-white', text: '🏆 #1 Executive' };
    if (rank <= 3) return { icon: Award, color: 'from-gray-300 to-gray-400 text-slate-900', text: `🥈 Top 3` };
    if (rank <= 10) return { icon: Award, color: 'from-orange-400 to-red-500 text-white', text: `🥉 Top 10` };
    return { icon: TrendingUp, color: 'from-blue-500 to-indigo-600 text-white', text: `#${rank}` };
  };

  const badge = getRankBadge();

  return (
    <div className={`bg-gradient-to-br ${badge.color} rounded-xl shadow-lg p-6 `}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className=" text-sm font-medium mb-1">Your Rank</p>
          <h2 className="text-4xl font-bold">{badge.text}</h2>
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <badge.icon className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm ">Percentile</span>
          <span className="text-lg font-bold">{percentile}th</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm ">Out of</span>
          <span className="text-lg font-bold">{totalExecutives} executives</span>
        </div>
        <div className="pt-3 border-t border-white/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              {growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`} this month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
