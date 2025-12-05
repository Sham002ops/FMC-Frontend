import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { Pencil, Trash2, Eye, Ban, CheckCircle, Search, X, Filter, Download, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageName: string | null;
  executiveRefode: string | null;
  role: string;
  joinedAt?: string;
  isBanned?: boolean;
}

type SortField = 'name' | 'email' | 'coins' | 'joinedAt';
type SortOrder = 'asc' | 'desc';

const AllUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ New filters
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('joinedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const token = localStorage.getItem("token");

  // Get all users
  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BackendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = response.data.users || [];
      setAllUsers(users);
      applyFiltersAndSort(users, searchQuery, filterRole, filterStatus, sortField, sortOrder);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Could not fetch users';
      setError(errorMsg);
      toast.error(errorMsg);
      setAllUsers([]);
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  // ✅ Enhanced filter and sort logic
  const applyFiltersAndSort = (
    users: User[],
    search: string,
    role: string,
    status: string,
    field: SortField,
    order: SortOrder
  ) => {
    let filtered = [...users];

    // Search filter
    if (search.trim()) {
      const lowercaseQuery = search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        user.packageName?.toLowerCase().includes(lowercaseQuery) ||
        user.executiveRefode?.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Role filter
    if (role !== 'ALL') {
      filtered = filtered.filter(user => user.role === role);
    }

    // Status filter
    if (status === 'ACTIVE') {
      filtered = filtered.filter(user => !user.isBanned);
    } else if (status === 'BANNED') {
      filtered = filtered.filter(user => user.isBanned);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];

      if (field === 'joinedAt') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else if (field === 'coins') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  // ✅ Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSort(allUsers, query, filterRole, filterStatus, sortField, sortOrder);
  };

  // ✅ Handle filter change
  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setFilterRole(value);
      applyFiltersAndSort(allUsers, searchQuery, value, filterStatus, sortField, sortOrder);
    } else {
      setFilterStatus(value);
      applyFiltersAndSort(allUsers, searchQuery, filterRole, value, sortField, sortOrder);
    }
  };

  // ✅ Handle sort
  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(allUsers, searchQuery, filterRole, filterStatus, field, newOrder);
  };

  // ✅ Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setSortField('joinedAt');
    setSortOrder('desc');
    applyFiltersAndSort(allUsers, '', 'ALL', 'ALL', 'joinedAt', 'desc');
  };

  // ✅ Export to CSV
  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warning('No users to export');
      return;
    }

    const csvHeaders = ['Name', 'Email', 'Role', 'Coins', 'Package', 'Executive Ref', 'Status', 'Joined At'];
    const csvRows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.role,
      user.coins,
      user.packageName || '-',
      user.executiveRefode || '-',
      user.isBanned ? 'Banned' : 'Active',
      user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`Exported ${filteredUsers.length} users to CSV`);
  };

  // Ban/Unban user
  const handleBanToggle = async (user: User) => {
    const action = user.isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    setActionLoading(user.id);
    setError(null);
    try {
      await axios.patch(
        `${BackendUrl}/admin/user/${user.id}/ban`,
        { isBanned: !user.isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`User ${action}ned successfully`);
      fetchAllUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update ban status';
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setActionLoading(null);
  };

  // Delete user
  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This will also delete all associated referrals.`)) {
      return;
    }

    setActionLoading(user.id);
    setError(null);

    try {
      const response = await axios.delete(`${BackendUrl}/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const deletedData = response.data.deletedData;

      if (deletedData) {
        toast.success(
          `✅ Deleted ${deletedData.userName} and ${deletedData.referralsDeleted} referral(s)`,
          { autoClose: 5000 }
        );
      } else {
        toast.success('✅ User deleted successfully');
      }

      fetchAllUsers();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete user';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <Header1 />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-28 lg:pl-24 sm:pt-24 px-4 sm:px-6 md:px-8 pb-8">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              All Users
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and monitor all registered users
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
              onClick={exportToCSV}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              onClick={fetchAllUsers}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {allUsers.filter(u => !u.isBanned).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Banned</p>
            <p className="text-2xl font-bold text-red-600">
              {allUsers.filter(u => u.isBanned).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Filtered</p>
            <p className="text-2xl font-bold text-blue-600">{filteredUsers.length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, role, package..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MENTOR">Mentor</option>
              <option value="EXECUTIVE">Executive</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BANNED">Banned</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{allUsers.length}</span> users
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">
              {searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL'
                ? 'No users found matching your filters'
                : 'No users found'}
            </p>
            {(searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('email')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('coins')}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Coins {sortField === 'coins' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Executive Ref.
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      onClick={() => handleSort('joinedAt')}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Joined {sortField === 'joinedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                          {user.coins}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.packageName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.executiveRefode || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : user.role === 'MENTOR'
                              ? 'bg-green-100 text-green-700'
                              : user.role === 'EXECUTIVE'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title={user.isBanned ? 'Unban User' : 'Ban User'}
                            disabled={actionLoading === user.id}
                            onClick={() => handleBanToggle(user)}
                            className={`p-2 rounded-lg transition ${
                              user.isBanned
                                ? 'bg-green-100 hover:bg-green-200'
                                : 'bg-red-100 hover:bg-red-200'
                            } ${actionLoading === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {user.isBanned ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Ban className="w-4 h-4 text-red-600" />
                            )}
                          </button>
                          <button
                            title="Delete User"
                            disabled={actionLoading === user.id}
                            onClick={() => handleDelete(user)}
                            className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition ${
                              actionLoading === user.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 relative"
                >
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      title={user.isBanned ? 'Unban' : 'Ban'}
                      disabled={actionLoading === user.id}
                      onClick={() => handleBanToggle(user)}
                      className={`p-2 rounded-lg ${
                        user.isBanned ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {user.isBanned ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Ban className="w-4 h-4 text-red-600" />
                      )}
                    </button>
                    <button
                      title="Delete"
                      disabled={actionLoading === user.id}
                      onClick={() => handleDelete(user)}
                      className="p-2 rounded-lg bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="pr-20">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Coins:</span>
                      <span className="ml-2 font-medium text-gray-900">{user.coins}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <span className="ml-2 font-medium text-gray-900 uppercase">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Package:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {user.packageName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-2 font-medium ${
                          user.isBanned ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Joined: {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'}
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

export default AllUsers;
