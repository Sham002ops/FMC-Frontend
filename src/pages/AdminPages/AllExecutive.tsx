import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { Search, X, Ban, CheckCircle, Trash2, Eye, RefreshCw, Filter } from 'lucide-react';
import { ExecutiveStatsModal } from '../../components/ExecutiveComponents/ExecutiveStatsModal';
import { toast } from 'react-toastify';

interface Executive {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  isBanned: boolean;
  joinedAt?: string;
}

type SortField = 'name' | 'email' | 'referralCode';
type SortOrder = 'asc' | 'desc';

const AllExecutive: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allExecutives, setAllExecutives] = useState<Executive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<Executive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BackendUrl}/executive/get-executives`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllExecutives(data);
      applyFiltersAndSort(data, searchQuery, filterStatus, sortField, sortOrder);
      toast.success('Executives loaded successfully');
    } catch (err) {
      console.error('Error fetching executives:', err);
      setError('Failed to fetch executives');
      toast.error('Failed to fetch executives');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (
    executives: Executive[],
    search: string,
    status: string,
    field: SortField,
    order: SortOrder
  ) => {
    let filtered = [...executives];

    // Search filter
    if (search.trim()) {
      const lowercaseQuery = search.toLowerCase();
      filtered = filtered.filter(exec =>
        exec.name.toLowerCase().includes(lowercaseQuery) ||
        exec.email.toLowerCase().includes(lowercaseQuery) ||
        exec.referralCode.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Status filter
    if (status === 'ACTIVE') {
      filtered = filtered.filter(exec => !exec.isBanned);
    } else if (status === 'BANNED') {
      filtered = filtered.filter(exec => exec.isBanned);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = String(a[field] || '').toLowerCase();
      let bVal = String(b[field] || '').toLowerCase();

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredExecutives(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSort(allExecutives, query, filterStatus, sortField, sortOrder);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    applyFiltersAndSort(allExecutives, searchQuery, value, sortField, sortOrder);
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(allExecutives, searchQuery, filterStatus, field, newOrder);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterStatus('ALL');
    setSortField('name');
    setSortOrder('asc');
    applyFiltersAndSort(allExecutives, '', 'ALL', 'name', 'asc');
  };

  const handleBanToggle = async (executive: Executive) => {
    const action = executive.isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} ${executive.name}?`)) return;

    setActionLoading(executive.id);
    setError(null);
    try {
      await axios.patch(
        `${BackendUrl}/executive/${executive.id}/ban`,
        { isBanned: !executive.isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Executive ${action}ned successfully`);
      fetchExecutives();
    } catch (err) {
      setError('Failed to update ban status');
      toast.error('Failed to update ban status');
    }
    setActionLoading(null);
  };

  const handleDelete = async (executive: Executive) => {
    if (!window.confirm(`Are you sure you want to delete ${executive.name}? This action cannot be undone.`)) return;
    
    setActionLoading(executive.id);
    setError(null);
    try {
      await axios.delete(`${BackendUrl}/executive/${executive.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Executive deleted successfully');
      fetchExecutives();
    } catch (err) {
      setError('Failed to delete executive');
      toast.error('Failed to delete executive');
    }
    setActionLoading(null);
  };

  const handleViewStats = (executiveId: string) => {
    setSelectedExecutiveId(executiveId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchExecutives();
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
      <header className="fixed top-0 left-0 lg:left-20 right-0 bg-white shadow-sm z-50 h-16">
        <Header1 />
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pl-20 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
          
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Executives
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and monitor executive accounts
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
              onClick={fetchExecutives}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Executives</p>
              <p className="text-2xl font-bold text-gray-900">{allExecutives.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {allExecutives.filter(e => !e.isBanned).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Banned</p>
              <p className="text-2xl font-bold text-red-600">
                {allExecutives.filter(e => e.isBanned).length}
              </p>
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
                placeholder="Search by name, email, or referral code..."
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
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
              </select>

              {(searchQuery || filterStatus !== 'ALL') && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}

              <div className="sm:ml-auto text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredExecutives.length}</span> of{' '}
                <span className="font-semibold">{allExecutives.length}</span> executives
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {filteredExecutives.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {searchQuery || filterStatus !== 'ALL'
                  ? 'No executives found matching your filters'
                  : 'No executives found'}
              </p>
              {(searchQuery || filterStatus !== 'ALL') && (
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
                        onClick={() => handleSort('referralCode')}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Referral Code {sortField === 'referralCode' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    {filteredExecutives.map((exec) => (
                      <tr key={exec.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{exec.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {exec.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-semibold">
                            {exec.referralCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {exec.isBanned ? (
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
                              title="View Stats & Revenue"
                              onClick={() => handleViewStats(exec.id)}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              title={exec.isBanned ? 'Unban Executive' : 'Ban Executive'}
                              disabled={actionLoading === exec.id}
                              onClick={() => handleBanToggle(exec)}
                              className={`p-2 rounded-lg transition ${
                                exec.isBanned
                                  ? 'bg-green-100 hover:bg-green-200'
                                  : 'bg-red-100 hover:bg-red-200'
                              } ${actionLoading === exec.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {exec.isBanned ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Ban className="w-4 h-4 text-red-600" />
                              )}
                            </button>
                            <button
                              title="Delete Executive"
                              disabled={actionLoading === exec.id}
                              onClick={() => handleDelete(exec)}
                              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition ${
                                actionLoading === exec.id ? 'opacity-50 cursor-not-allowed' : ''
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
                {filteredExecutives.map((exec) => (
                  <div
                    key={exec.id}
                    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 relative"
                  >
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        title="View Stats"
                        onClick={() => handleViewStats(exec.id)}
                        className="p-2 rounded-lg bg-blue-100"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        title={exec.isBanned ? 'Unban' : 'Ban'}
                        disabled={actionLoading === exec.id}
                        onClick={() => handleBanToggle(exec)}
                        className={`p-2 rounded-lg ${
                          exec.isBanned ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {exec.isBanned ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-600" />
                        )}
                      </button>
                      <button
                        title="Delete"
                        disabled={actionLoading === exec.id}
                        onClick={() => handleDelete(exec)}
                        className="p-2 rounded-lg bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="pr-24 mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{exec.name}</h3>
                      <p className="text-sm text-gray-600 break-all">{exec.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Referral Code:</span>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-semibold rounded">
                            {exec.referralCode}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              exec.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {exec.isBanned ? <><Ban className="w-3 h-3" /> Banned</> : <><CheckCircle className="w-3 h-3" /> Active</>}
                          </span>
                        </div>
                      </div>
                      {exec.joinedAt && (
                        <div className="col-span-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-500">Joined: </span>
                          <span className="font-medium text-gray-900">
                            {new Date(exec.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Stats Modal */}
      {selectedExecutiveId && (
        <ExecutiveStatsModal
          executiveId={selectedExecutiveId}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedExecutiveId(null);
          }}
        />
      )}
    </div>
  );
};

export default AllExecutive;
