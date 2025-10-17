import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import ExeSidebar from '@/components/ExeSideBar';
import ExecutiveMobileSidebar from '@/components/MobExeSidebar';
import { 
  Search, 
  X, 
  Users, 
  Package, 
  DollarSign, 
  Filter,
  Download,
  RefreshCw,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageName: string | null;
  executiveRefode: string | null;
  role: string;
  createdAt?: string;
}

const AllRefUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allRefUsers, setAllRefUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'coins'>('date');

  // Calculate stats
  const stats = {
    total: allRefUsers.length,
    thisMonth: allRefUsers.filter(u => {
      if (!u.createdAt) return false;
      const userDate = new Date(u.createdAt);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length,
    totalRevenue: allRefUsers.reduce((sum, u) => sum + (u.coins || 0), 0),
    packages: [...new Set(allRefUsers.map(u => u.packageName).filter(Boolean))].length
  };

  const fetchAllRefUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BackendUrl}/executive/get-ref-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Fetched Users: ", response.data);
      setAllRefUsers(response.data.AllRefUsers || []);
      setFilteredUsers(response.data.AllRefUsers || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setAllRefUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRefUsers();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let result = [...allRefUsers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.packageName?.toLowerCase().includes(query))
      );
    }

    // Package filter
    if (packageFilter !== 'all') {
      result = result.filter(user => user.packageName === packageFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'coins') return (b.coins || 0) - (a.coins || 0);
      if (sortBy === 'date' && a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    setFilteredUsers(result);
  }, [searchQuery, packageFilter, sortBy, allRefUsers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllRefUsers();
    setRefreshing(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPackageFilter('all');
    setSortBy('date');
  };

  const exportToCSV = () => {
    let csv = 'Name,Email,Package,Coins,Joined Date,Referral Code\n';
    filteredUsers.forEach(user => {
      csv += `${user.name},${user.email},${user.packageName || 'None'},${user.coins},${
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
      },${user.executiveRefode || 'N/A'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referred-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniquePackages = [...new Set(allRefUsers.map(u => u.packageName).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <ExeSidebar />
        </div>
        <div className="block lg:hidden">
          <ExecutiveMobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <Header1 />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-28 lg:pl-24 sm:pt-24 px-4 sm:px-6 md:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              All Referred Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your referrals
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">This Month</p>
                <p className="text-2xl font-bold text-green-600">{stats.thisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Coins</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Packages</p>
                <p className="text-2xl font-bold text-purple-600">{stats.packages}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or package..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Package Filter */}
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                >
                  <option value="all">All Packages</option>
                  {uniquePackages.map(pkg => (
                    <option key={pkg} value={pkg || ''}>{pkg || 'No Package'}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'coins')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="date">Recent First</option>
                <option value="name">Name A-Z</option>
                <option value="coins">Coins High-Low</option>
              </select>

              {(searchQuery || packageFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Info */}
          {(searchQuery || packageFilter !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {filteredUsers.length} of {allRefUsers.length} users</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Search: "{searchQuery}"
                </span>
              )}
              {packageFilter !== 'all' && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Package: {packageFilter}
                </span>
              )}
            </div>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              {searchQuery || packageFilter !== 'all' ? 'No users match your filters' : 'No referred users yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery || packageFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start referring users to see them here'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">User</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">Package</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">Coins</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">Joined</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.packageName ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            <Package className="w-3 h-3" />
                            {user.packageName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No package</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-yellow-600">{user.coins.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-gray-700 text-xs">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                          {user.createdAt && (
                            <span className="text-gray-400 text-xs">
                              {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Package</p>
                      {user.packageName ? (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {user.packageName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Coins</p>
                      <p className="font-semibold text-yellow-600">{user.coins.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Joined</p>
                      <p className="text-sm text-gray-700">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllRefUsers;
