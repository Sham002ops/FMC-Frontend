import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { 
  Eye, Search, X, Filter, Download, RefreshCw, 
  Phone, MapPin, Calendar, User, Trash2, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';

interface DeletedUser {
  id: string;
  originalUserId: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  dateOfBirth?: string;
  joinedAt: string;
  role: string;
  coins: number;
  packageName?: string;
  executiveRefode?: string;
  deletedAt: string;
  deletedBy: string;
  deletedByRole: string;
  deletionReason?: string;
  deleterName?: string;      // ✅ NEW
  deleterEmail?: string;     // ✅ NEW
}

type SortField = 'name' | 'email' | 'deletedAt' | 'role';
type SortOrder = 'asc' | 'desc';

const DeletedUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allDeletedUsers, setAllDeletedUsers] = useState<DeletedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DeletedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<DeletedUser | null>(null);
  
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterDeletedByRole, setFilterDeletedByRole] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('deletedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage] = useState(10);
  
  const token = localStorage.getItem("token");

  const fetchDeletedUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        sortBy: sortField,
        sortOrder: sortOrder,
      });

      if (filterRole !== 'ALL') {
        params.append('role', filterRole);
      }

      const response = await axios.get(`${BackendUrl}/admin/deleted-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { data, pagination } = response.data;
      
      setAllDeletedUsers(data || []);
      setFilteredUsers(data || []);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(pagination.totalRecords || 0);
      setCurrentPage(pagination.page || 1);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Could not fetch deleted users';
      setError(errorMsg);
      toast.error(errorMsg);
      setAllDeletedUsers([]);
      setFilteredUsers([]);
    }
    
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: 'role' | 'deletedByRole', value: string) => {
    if (type === 'role') {
      setFilterRole(value);
    } else {
      setFilterDeletedByRole(value);
    }
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterDeletedByRole('ALL');
    setSortField('deletedAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warning('No deleted users to export');
      return;
    }

    const csvHeaders = [
      'Original User ID', 'Name', 'Email', 'Phone', 'Role', 'Coins', 'Package',
      'Joined At', 'Deleted At', 'Deleted By', 'Deleted By Role', 'Deletion Reason'
    ];
    
    const csvRows = filteredUsers.map(user => [
      user.originalUserId,
      user.name,
      user.email,
      user.number || '-',
      user.role,
      user.coins,
      user.packageName || '-',
      new Date(user.joinedAt).toLocaleDateString(),
      new Date(user.deletedAt).toLocaleDateString(),
      user.deleterName || 'Unknown',
      user.deletedByRole,
      user.deletionReason || 'No reason provided'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `deleted_users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`Exported ${filteredUsers.length} deleted users to CSV`);
  };

  const handleViewUser = (user: DeletedUser) => {
    setSelectedUser(user);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, [currentPage, sortField, sortOrder, filterRole, searchQuery]);

  if (loading && filteredUsers.length === 0) {
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-8 h-8 text-red-600" />
                Deleted Users
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View audit trail of deleted user accounts
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
                onClick={fetchDeletedUsers}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Deleted</p>
              <p className="text-2xl font-bold text-red-600">{totalRecords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredUsers.filter(u => u.role === 'USER').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {filteredUsers.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">This Page</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
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
                placeholder="Search by name or email..."
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

              {(searchQuery || filterRole !== 'ALL') && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}

              <div className="sm:ml-auto text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
                <span className="font-semibold">{totalRecords}</span> deleted users
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {searchQuery || filterRole !== 'ALL'
                  ? 'No deleted users found matching your filters'
                  : 'No deleted users found'}
              </p>
              {(searchQuery || filterRole !== 'ALL') && (
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
                        onClick={() => handleSort('role')}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th
                        onClick={() => handleSort('deletedAt')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Deleted At {sortField === 'deletedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deleted By
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.packageName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(user.deletedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        {/* ✅ UPDATED: Show deleter name + role */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {user.deleterName || 'Unknown'}
                            </span>
                            <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                              user.deletedByRole === 'ADMIN'
                                ? 'bg-red-100 text-red-700'
                                : user.deletedByRole === 'SUPER_ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.deletedByRole}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            title="View Details"
                            onClick={() => handleViewUser(user)}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
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
                    <div className="absolute top-3 right-3">
                      <button
                        title="View"
                        onClick={() => handleViewUser(user)}
                        className="p-2 rounded-lg bg-blue-100"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    <div className="pr-16 mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
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
                      <div className="col-span-2">
                        <span className="text-gray-500">Deleted:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(user.deletedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* ✅ UPDATED: Show deleter name */}
                      <div className="col-span-2">
                        <span className="text-gray-500">Deleted By:</span>
                        <div className="mt-1 flex flex-col gap-1">
                          <span className="font-medium text-gray-900">
                            {user.deleterName || 'Unknown'}
                          </span>
                          <span className="text-xs text-red-600">
                            Role: {user.deletedByRole}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trash2 className="w-6 h-6" />
                Deleted User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Deletion Information */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-700 uppercase mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Deletion Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-red-600 mb-1">Deleted At</label>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedUser.deletedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {/* ✅ UPDATED: Show deleter details */}
                  <div>
                    <label className="block text-xs text-red-600 mb-1">Deleted By</label>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {selectedUser.deleterName || 'Unknown Admin'}
                      </p>
                      {selectedUser.deleterEmail && (
                        <p className="text-xs text-gray-600">{selectedUser.deleterEmail}</p>
                      )}
                      <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-700">
                        {selectedUser.deletedByRole}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-red-600 mb-1">Deletion Reason</label>
                    <p className="font-medium text-gray-900">
                      {selectedUser.deletionReason || 'No reason provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-red-600 mb-1">Original User ID</label>
                    <p className="font-mono text-xs text-gray-600">{selectedUser.originalUserId}</p>
                  </div>
                </div>
              </div>

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
                    <label className="block text-xs text-gray-500 mb-1">Coins Balance</label>
                    <p className="font-bold text-xl text-blue-600">{selectedUser.coins}</p>
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

              {/* Account History */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Account History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                    <p className="font-medium text-gray-900">
                      {selectedUser.dateOfBirth 
                        ? new Date(selectedUser.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not provided'}
                    </p>
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
                    <label className="block text-xs text-gray-500 mb-1">Member Since</label>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedUser.joinedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200 rounded-b-lg">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
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

export default DeletedUsers;
