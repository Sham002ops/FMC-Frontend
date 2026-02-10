import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  Clock,
  TrendingUp,
  UserPlus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import PendingRegistrationModal from '@/components/adminComponents/PendingRegistrationModal';
import Header1 from '@/components/Header';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  number: string;
  packageName: string;
  transactionId: string;
  requestedCoins: number;
  executiveRefode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  requestedBy: string;
  requestedByDetails?: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

interface RegistrationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  recentApprovedUsers: number;
}

const PendingRegistrations: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<PendingUser[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });
  const [selectedRegistration, setSelectedRegistration] = useState<PendingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [error, setError] = useState('');

  // ✅ Fetch registrations with pagination and filters
  const fetchRegistrations = useCallback(async (page = 1, limit = 10, status?: string) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Build query params
      const params: any = { page, limit };
      if (status && status !== 'ALL') {
        params.status = status;
      }

      const response = await axios.get(`${BackendUrl}/superadmin/pending-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log('✅ API Response:', response.data);

      if (response.data.success) {
        setRegistrations(response.data.registrations || []);
        setPagination(response.data.pagination);
      } else {
        setRegistrations([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching registrations:', err);
      setError(err.response?.data?.error || 'Failed to fetch registrations');
      setRegistrations([]);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/superadmin/pending-registrations/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('✅ Stats Response:', response.data);
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      setStats({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
        recentApprovedUsers: 0,
      });
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    fetchRegistrations(1, 10, statusFilter !== 'ALL' ? statusFilter : undefined);
    fetchStats();
  }, [statusFilter, fetchRegistrations, fetchStats]);

  // ✅ Handle page change
  const handlePageChange = (newPage: number) => {
    fetchRegistrations(newPage, pagination.limit, statusFilter !== 'ALL' ? statusFilter : undefined);
  };

  // ✅ Handle status filter change
  const handleStatusFilterChange = (newStatus: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setStatusFilter(newStatus);
    // Fetch will be triggered by useEffect watching statusFilter
  };

  // ✅ Refresh data
  const handleRefresh = () => {
    fetchRegistrations(pagination.page, pagination.limit, statusFilter !== 'ALL' ? statusFilter : undefined);
    fetchStats();
  };

  // ✅ View details
  const handleViewDetails = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/superadmin/pending-registrations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        setSelectedRegistration(response.data.registration);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      console.error('❌ Error fetching registration details:', err);
      alert(err.response?.data?.error || 'Failed to fetch details');
    }
  };

  // ✅ Process registration (Approve/Reject)
  const handleProcessRegistration = async (id: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const payload: any = { 
        action: action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
      };
      
      if (action === 'REJECT' && reason) {
        payload.rejectionReason = reason;
      }

      const response = await axios.post(
        `${BackendUrl}/superadmin/pending-registrations/${id}/process`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Refresh data
        await fetchRegistrations(pagination.page, pagination.limit, statusFilter !== 'ALL' ? statusFilter : undefined);
        await fetchStats();
        
        setIsModalOpen(false);
        setSelectedRegistration(null);

        // Show success message
        alert(response.data.message || `Registration ${action.toLowerCase()}d successfully!`);
      }
    } catch (err: any) {
      console.error('❌ Error processing registration:', err);
      alert(err.response?.data?.error || 'Failed to process registration');
    }
  };

  // ✅ Client-side search filter (on current page data)
  const filteredRegistrations = React.useMemo(() => {
    if (!Array.isArray(registrations)) {
      return [];
    }

    if (!searchTerm) {
      return registrations;
    }

    return registrations.filter(reg => {
      if (!reg) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        (reg.name?.toLowerCase() || '').includes(searchLower) ||
        (reg.email?.toLowerCase() || '').includes(searchLower) ||
        (reg.number || '').includes(searchTerm) ||
        (reg.transactionId?.toLowerCase() || '').includes(searchLower) ||
        (reg.executiveRefode?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [registrations, searchTerm]);

  // ✅ Export to CSV
  const exportToCSV = () => {
    if (!Array.isArray(filteredRegistrations) || filteredRegistrations.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Name', 
      'Email', 
      'Phone', 
      'Package', 
      'Transaction ID', 
      'Coins',
      'Executive Code',
      'Status', 
      'Requested At'
    ];
    
    const rows = filteredRegistrations.map(reg => [
      reg.name || '',
      reg.email || '',
      reg.number || '',
      reg.packageName || '',
      reg.transactionId || '',
      reg.requestedCoins || '',
      reg.executiveRefode || '',
      reg.status || '',
      reg.requestedAt ? new Date(reg.requestedAt).toLocaleString() : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="block lg:hidden">
        <MobileSidebar />
      </div>
        <Header1 />

      {/* Main Content */}
      <div className="flex-1 lg:ml-16">
      
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky  mt-20 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Registrations</h1>
                <p className="text-sm text-gray-600 mt-1">Review and approve new user registrations</p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Registrations"
                value={stats.total}
                icon={<UserPlus className="text-blue-600" />}
                color="blue"
              />
              <StatsCard
                title="Pending Review"
                value={stats.pending}
                icon={<Clock className="text-yellow-600" />}
                color="yellow"
              />
              <StatsCard
                title="Approved"
                value={stats.approved}
                icon={<CheckCircle className="text-green-600" />}
                color="green"
              />
              <StatsCard
                title="Rejected"
                value={stats.rejected}
                icon={<XCircle className="text-red-600" />}
                color="red"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Recent Approvals (7 Days)</p>
                    <p className="text-3xl font-bold mt-1">{stats.recentApprovedUsers}</p>
                  </div>
                  <TrendingUp size={40} className="opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Current Page</p>
                    <p className="text-3xl font-bold mt-1">{pagination.page} / {pagination.totalPages}</p>
                  </div>
                  <Calendar size={40} className="opacity-80" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone, transaction ID, or executive code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Export Button */}
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex items-center gap-2"
                disabled={filteredRegistrations.length === 0}
              >
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-sm text-red-600 hover:text-red-700 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Processing />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <UserPlus className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations found</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search'
                  : statusFilter !== 'ALL'
                  ? `No ${statusFilter.toLowerCase()} registrations`
                  : 'New registrations will appear here'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Executive Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="text-blue-600" size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                                <div className="text-sm text-gray-500">{registration.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Phone size={14} className="text-gray-400" />
                              {registration.number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Package size={14} className="text-purple-600" />
                              <span className="text-sm font-medium text-gray-900">{registration.packageName}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {registration.requestedCoins} coins
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {registration.executiveRefode}
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={registration.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(registration.requestedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            <div className="text-xs text-gray-400">
                              {new Date(registration.requestedAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Button
                              onClick={() => handleViewDetails(registration.id)}
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 mx-auto"
                            >
                              <Eye size={16} />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                          <p className="text-sm text-gray-600">{registration.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={registration.status} />
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {registration.number}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package size={14} />
                        {registration.packageName} ({registration.requestedCoins} coins)
                      </div>
                      <div className="text-xs text-gray-500">
                        Executive: <code className="bg-gray-100 px-1 py-0.5 rounded">{registration.executiveRefode}</code>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(registration.requestedAt).toLocaleString()}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewDetails(registration.id)}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white border rounded-lg p-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.totalRecords)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalRecords}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || loading}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedRegistration && (
        <PendingRegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRegistration(null);
          }}
          registration={selectedRegistration}
          onProcess={handleProcessRegistration}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'red';
}> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white">{icon}</div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PendingRegistrations;
