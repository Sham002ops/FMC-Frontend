import React from 'react';
import { Users, CheckCircle, Ban, Filter } from 'lucide-react';

interface Props {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  filteredCount: number;
}

const UserStatsCards: React.FC<Props> = ({
  totalUsers,
  activeUsers,
  bannedUsers,
  filteredCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 font-medium">Total Users</p>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        <p className="text-xs text-gray-500 mt-1">All registered users</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 font-medium">Active</p>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
        <p className="text-xs text-gray-500 mt-1">
          {totalUsers > 0
            ? `${Math.round((activeUsers / totalUsers) * 100)}% of total`
            : '0% of total'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 font-medium">Banned</p>
          <div className="p-2 bg-red-100 rounded-lg">
            <Ban className="w-4 h-4 text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600">{bannedUsers}</p>
        <p className="text-xs text-gray-500 mt-1">
          {totalUsers > 0
            ? `${Math.round((bannedUsers / totalUsers) * 100)}% of total`
            : '0% of total'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 font-medium">Filtered</p>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Filter className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-600">{filteredCount}</p>
        <p className="text-xs text-gray-500 mt-1">Currently showing</p>
      </div>
    </div>
  );
};

export default UserStatsCards;
