import React from 'react';
import { Clock, User, CheckCircle } from 'lucide-react';

interface RecentUser {
  id: string;
  name: string;
  email: string;
  packageName: string | null;
  createdAt: string;
}

interface Props {
  users: RecentUser[];
}

export const RecentActivityFeed: React.FC<Props> = ({ users }) => {
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-purple-100 rounded-lg">
          <Clock className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500">Latest referrals</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <div 
              key={user.id}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              <div className="text-right flex-shrink-0">
                {user.packageName && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded mb-1">
                    {user.packageName}
                  </span>
                )}
                <p className="text-xs text-gray-500">{getTimeAgo(user.createdAt)}</p>
              </div>

              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
