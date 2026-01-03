import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Processing } from '../../components/ui/icons/Processing';
import { X, Users, DollarSign, TrendingUp, Calendar, Package } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  packageName: string | null;
  packagePrice: number;
  joinedAt: string;
}

interface Stats {
  totalUsers: number;
  totalRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
}

interface Executive {
  id: string;
  name: string;
  email: string;
  referralCode: string;
}

interface Props {
  executiveId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveStatsModal: React.FC<Props> = ({ executiveId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen && executiveId) {
      fetchStats();
    }
  }, [isOpen, executiveId]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${BackendUrl}/executive/${executiveId}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExecutive(data.executive);
      setStats(data.stats);
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load executive statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          {executive && (
            <div>
              <h2 className="text-2xl font-bold mb-2">{executive.name}</h2>
              <p className="text-blue-100 text-sm">{executive.email}</p>
              <p className="text-xs text-blue-200 mt-1">
                Referral Code: <span className="font-mono bg-white/20 px-2 py-1 rounded">{executive.referralCode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Processing />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchStats}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                    <p className="text-sm text-blue-700">Total Referrals</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-700">Total Revenue</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">₹{stats.monthRevenue.toLocaleString()}</p>
                    <p className="text-sm text-purple-700">This Month</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">₹{stats.yearRevenue.toLocaleString()}</p>
                    <p className="text-sm text-orange-700">This Year</p>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Referred Users</h3>
                </div>
                
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No referred users yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-600">Package</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-600">Revenue</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-600">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                            <td className="px-4 py-3 text-center">
                              {user.packageName ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  <Package className="w-3 h-3" />
                                  {user.packageName}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold text-green-600">
                              ₹{user.packagePrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-gray-500">
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
