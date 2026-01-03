import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { Trash2, Eye, Ban, CheckCircle, Search, X, Filter, Download, RefreshCw, Phone, MapPin, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  coins: number;
  dateOfBirth?: string;
  packageName: string | null;
  executiveRefode: string | null;
  role: string;
  joinedAt?: string;
  isBanned?: boolean;
}

type SortField = 'name' | 'email' | 'coins';
type SortOrder = 'asc' | 'desc';

const AllUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [executiveName, setExecutiveName] = useState<string | null>(null);
  const [loadingExecutive, setLoadingExecutive] = useState(false);
  
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const token = localStorage.getItem("token");

  // Fetch executive name by referral code
  const fetchExecutiveName = async (refCode: string) => {
    if (!refCode) return null;
    setLoadingExecutive(true);
    try {
      const response = await axios.get(`${BackendUrl}/admin/executive/${refCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExecutiveName(response.data.executiveName || 'Unknown');
    } catch (err) {
      setExecutiveName('Not found');
    } finally {
      setLoadingExecutive(false);
    }
  };

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

  const applyFiltersAndSort = (
    users: User[],
    search: string,
    role: string,
    status: string,
    field: SortField,
    order: SortOrder
  ) => {
    let filtered = [...users];

    if (search.trim()) {
      const lowercaseQuery = search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        user.packageName?.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (role !== 'ALL') {
      filtered = filtered.filter(user => user.role === role);
    }

    if (status === 'ACTIVE') {
      filtered = filtered.filter(user => !user.isBanned);
    } else if (status === 'BANNED') {
      filtered = filtered.filter(user => user.isBanned);
    }

    filtered.sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];

      if (field === 'coins') {
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSort(allUsers, query, filterRole, filterStatus, sortField, sortOrder);
  };

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setFilterRole(value);
      applyFiltersAndSort(allUsers, searchQuery, value, filterStatus, sortField, sortOrder);
    } else {
      setFilterStatus(value);
      applyFiltersAndSort(allUsers, searchQuery, filterRole, value, sortField, sortOrder);
    }
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(allUsers, searchQuery, filterRole, filterStatus, field, newOrder);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setSortField('name');
    setSortOrder('asc');
    applyFiltersAndSort(allUsers, '', 'ALL', 'ALL', 'name', 'asc');
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warning('No users to export');
      return;
    }

    const csvHeaders = ['Name', 'Email', 'Phone', 'Date of Birth', 'Address', 'PIN Code', 'Role', 'Coins', 'Package', 'Executive Ref', 'Status', 'Joined At'];
    const csvRows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.number || '-',
      user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-',
      user.address || '-',
      user.pinCode || '-',
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setExecutiveName(null);
    if (user.executiveRefode) {
      fetchExecutiveName(user.executiveRefode);
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-20 bg-slate-900 z-30">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 lg:left-20 right-0 bg-white shadow-sm z-40 h-16">
        <Header1 />
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pl-20 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
          
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Users
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and monitor all registered users
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
                onClick={exportToCSV}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
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
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, package..."
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

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

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

              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
              </select>

              {(searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}

              <div className="sm:ml-auto text-sm text-gray-600">
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
              {/* Desktop Table - Simplified */}
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              title="View Details"
                              onClick={() => handleViewUser(user)}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
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
                        title="View"
                        onClick={() => handleViewUser(user)}
                        className="p-2 rounded-lg bg-blue-100"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
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

                    <div className="pr-24 mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
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
                      <div className="col-span-2">
                        <span className="text-gray-500">Package:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {user.packageName || '-'}
                        </span>
                      </div>
                      <div className="col-span-2">
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
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Enhanced User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                    <p className="font-medium text-gray-900 break-all">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">User Role</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      selectedUser.role === 'MENTOR' ? 'bg-green-100 text-green-700' :
                      selectedUser.role === 'EXECUTIVE' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Account Status</label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedUser.isBanned ? <><Ban className="w-3 h-3" /> Banned</> : <><CheckCircle className="w-3 h-3" /> Active</>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <p className="font-medium text-gray-900">{selectedUser.number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Full Address
                    </label>
                    <p className="font-medium text-gray-900">{selectedUser.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">PIN / ZIP Code</label>
                    <p className="font-medium text-gray-900">{selectedUser.pinCode || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pl-2 border-gray-200 pt-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date of Birth
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedUser.dateOfBirth 
                          ? new Date(selectedUser.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not provided'}
                      </p>
                      {selectedUser.dateOfBirth && (
                        <p className="text-xs text-gray-500 mt-1">
                          Age: {Math.floor((new Date().getTime() - new Date(selectedUser.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                        </p>
                      )}
                    </div>
                </div>

              {/* Account Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Total Coins</label>
                    <p className="font-bold text-2xl text-blue-600">{selectedUser.coins}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Package Subscribed</label>
                    <p className="font-medium text-gray-900">{selectedUser.packageName || 'None'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Executive Referral Code</label>
                    <p className="font-medium text-gray-900">{selectedUser.executiveRefode || 'None'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Referred By (Executive Name)</label>
                    {loadingExecutive ? (
                      <p className="text-sm text-gray-500 italic">Loading...</p>
                    ) : (
                      <p className="font-medium text-gray-900">{executiveName || (selectedUser.executiveRefode ? 'Fetching...' : 'No referral')}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Member Since</label>
                    <p className="font-medium text-gray-900">
                      {selectedUser.joinedAt ? new Date(selectedUser.joinedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 rounded-b-lg">
              <button
                onClick={() => {
                  handleDelete(selectedUser);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition"
              >
                Delete User
              </button>
              <button
                onClick={() => {
                  handleBanToggle(selectedUser);
                  setSelectedUser(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedUser.isBanned
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
