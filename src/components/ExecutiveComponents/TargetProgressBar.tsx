import React from 'react';
import { Target, Award } from 'lucide-react';

interface Props {
  current: number;
  target: number;
  label: string;
}

export const TargetProgressBar: React.FC<Props> = ({ current, target, label }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-lg">
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{label}</h3>
            <p className="text-sm text-gray-500">Monthly Target</p>
          </div>
        </div>
        {percentage >= 100 && (
          <Award className="w-8 h-8 text-yellow-500" />
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900">{current}</span>
          <span className="text-sm text-gray-500">of {target} target</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percentage >= 100 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : percentage >= 75 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold text-gray-700">{percentage.toFixed(1)}%</span>
          {remaining > 0 && (
            <span className="text-sm text-gray-500">{remaining} to go</span>
          )}
          {percentage >= 100 && (
            <span className="text-sm font-semibold text-green-600">🎉 Target Achieved!</span>
          )}
        </div>
      </div>
    </div>
  );
};
