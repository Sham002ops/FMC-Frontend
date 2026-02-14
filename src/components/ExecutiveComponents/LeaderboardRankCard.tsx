import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface Props {
  rank: number;
  totalExecutives: number;
  growth: number;
}

export const LeaderboardRankCard: React.FC<Props> = ({ rank, totalExecutives, growth }) => {
  const getRankBadge = () => {
    if (rank === 1) {
      return { 
        icon: Trophy, 
        color: 'from-yellow-400 to-orange-500', 
        textColor: 'text-white',
        badge: '🏆',
        title: 'Top Performer'
      };
    }
    if (rank === 2) {
      return { 
        icon: Award, 
        color: 'from-gray-300 to-gray-400', 
        textColor: 'text-slate-900',
        badge: '🥈',
        title: 'Runner Up'
      };
    }
    if (rank === 3) {
      return { 
        icon: Award, 
        color: 'from-orange-300 to-orange-400', 
        textColor: 'text-slate-900',
        badge: '🥉',
        title: 'Third Place'
      };
    }
    if (rank <= 10) {
      return { 
        icon: Award, 
        color: 'from-blue-400 to-indigo-500', 
        textColor: 'text-white',
        badge: '⭐',
        title: 'Top 10'
      };
    }
    return { 
      icon: TrendingUp, 
      color: 'from-purple-500 to-indigo-600', 
      textColor: 'text-white',
      badge: '📈',
      title: 'Keep Going!'
    };
  };

  const badge = getRankBadge();

  return (
    <div className={`bg-gradient-to-br ${badge.color} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`${badge.textColor} text-sm font-medium mb-1 opacity-90`}>
            Your Rank
          </p>
          <div className="flex items-center gap-2">
            <span className="text-5xl">{badge.badge}</span>
            <h2 className={`text-4xl font-bold ${badge.textColor}`}>
              Top {rank}
            </h2>
          </div>
          <p className={`${badge.textColor} text-xs mt-1 opacity-75`}>
            {badge.title}
          </p>
        </div>
        
        {/* Icon Badge */}
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <badge.icon className={`w-8 h-8 ${badge.textColor}`} />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {/* Total Executives */}
        <div className={`flex justify-between items-center pb-3 border-b border-white/20`}>
          <span className={`text-sm ${badge.textColor} opacity-80`}>
            Out of
          </span>
          <span className={`text-xl font-bold ${badge.textColor}`}>
            {totalExecutives} executives
          </span>
        </div>

        {/* Growth This Month */}
        <div className={`pt-1`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${badge.textColor}`} />
              <span className={`text-sm ${badge.textColor} opacity-80`}>
                This month
              </span>
            </div>
            <span className={`text-lg font-bold ${badge.textColor}`}>
              {growth > 0 ? `+${growth.toFixed(1)}%` : growth === 0 ? '0%' : `${growth.toFixed(1)}%`}
            </span>
          </div>
          
          {/* Growth Bar */}
          {growth !== 0 && (
            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full ${growth > 0 ? 'bg-green-400' : 'bg-red-400'} transition-all duration-500`}
                style={{ width: `${Math.min(Math.abs(growth), 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      {rank === 1 && (
        <div className={`mt-4 pt-4 border-t border-white/20`}>
          <p className={`text-xs ${badge.textColor} opacity-80 text-center font-medium`}>
            🎉 You're the top executive! Keep it up!
          </p>
        </div>
      )}
      {rank > 1 && rank <= 3 && (
        <div className={`mt-4 pt-4 border-t border-white/20`}>
          <p className={`text-xs ${badge.textColor} opacity-80 text-center font-medium`}>
            So close to #1! You're doing great!
          </p>
        </div>
      )}
      {rank > 3 && rank <= 10 && (
        <div className={`mt-4 pt-4 border-t border-white/20`}>
          <p className={`text-xs ${badge.textColor} opacity-80 text-center font-medium`}>
            Great work! You're in the top 10!
          </p>
        </div>
      )}
    </div>
  );
};
