import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Header1 from '@/components/Header';
import { Processing } from '@/components/ui/icons/Processing';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Download,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Database,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ExportLog {
  id: string;
  entity: string;
  fileName: string;
  recordCount: number;
  fileSize?: number;
  exportedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface ExportStats {
  totalExports: number;
  exportsLast24h: number;
  exportsLast7days: number;
  exportsLast30days: number;
  totalRecordsExported: number;
  byEntity: Array<{ entity: string; count: number }>;
  topExporters: Array<{
    user: { id: string; name: string; email: string; role: string };
    exportCount: number;
  }>;
}

const ExportLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ExportLog[]>([]);
  const [stats, setStats] = useState<ExportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    entity: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(filters.entity && { entity: filters.entity }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const res = await axios.get(
        `${BackendUrl}/export-logs/logs?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs(res.data.logs);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch export logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/export-logs/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
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

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
          <Header1 />
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20 lg:pt-28 lg:pl-28 px-3 sm:px-6 md:px-8 overflow-auto pb-8">
          {/* Page Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Export Logs</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track all CSV exports and data downloads from the system
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <>
              {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 5 columns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Exports"
                  value={stats.totalExports}
                  icon={<Download className="text-blue-600" size={24} />}
                />
                <StatCard
                  title="Last 24h"
                  value={stats.exportsLast24h}
                  icon={<TrendingUp className="text-green-600" size={24} />}
                />
                <StatCard
                  title="Last 7 Days"
                  value={stats.exportsLast7days}
                  icon={<Calendar className="text-purple-600" size={24} />}
                />
                <StatCard
                  title="Last 30 Days"
                  value={stats.exportsLast30days}
                  icon={<Database className="text-indigo-600" size={24} />}
                />
                <StatCard
                  title="Total Records"
                  value={stats.totalRecordsExported.toLocaleString()}
                  icon={<FileText className="text-orange-600" size={24} />}
                  className="col-span-2 sm:col-span-1"
                />
              </div>

              {/* By Entity & Top Exporters - Stack on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* By Entity */}
                <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Exports by Entity
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {stats.byEntity.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Database size={18} className="text-indigo-600 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base text-gray-900 truncate">
                            {item.entity}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Exporters */}
                <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Top Exporters
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {stats.topExporters.slice(0, 5).map((exp, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-700 font-bold text-xs sm:text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                              {exp.user.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {exp.user.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                          {exp.exportCount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Filters - Collapsible on mobile */}
          <div className="bg-white rounded-xl shadow-sm border mb-4 sm:mb-6">
            {/* Filter Header - Mobile Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full p-4 sm:p-6 flex items-center justify-between lg:cursor-default"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <div className="lg:hidden">
                {showFilters ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </div>
            </button>

            {/* Filter Content */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block px-4 pb-4 sm:px-6 sm:pb-6`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm">Entity Type</Label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={filters.entity}
                    onChange={(e) =>
                      setFilters({ ...filters, entity: e.target.value })
                    }
                  >
                    <option value="">All Entities</option>
                    <option value="AuditLogs">Audit Logs</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Users">Users</option>
                    <option value="Packages">Packages</option>
                    <option value="Orders">Orders</option>
                    <option value="Webinars">Webinars</option>
                    <option value="Tasks">Tasks</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    type="date"
                    className="text-sm"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    type="date"
                    className="text-sm"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logs - Desktop Table / Mobile Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <Processing />
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 sm:p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No export logs found
              </h3>
              <p className="text-sm text-gray-600">
                Export logs will appear here once data is exported
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          Timestamp
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          Entity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          File Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          Records
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          Size
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                          Exported By
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                              <span>{formatDate(log.exportedAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{log.entity}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-400 flex-shrink-0" />
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
                                {log.fileName}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            {log.recordCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            {formatFileSize(log.fileSize)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium truncate">{log.user.name}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {log.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards - Hidden on desktop */}
              <div className="md:hidden space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-lg shadow-sm border p-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {log.entity}
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(log.exportedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-1">
                        <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                          {log.fileName}
                        </code>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-gray-500 mb-0.5">Records</div>
                        <div className="font-semibold text-gray-900">
                          {log.recordCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-gray-500 mb-0.5">Size</div>
                        <div className="font-semibold text-gray-900">
                          {formatFileSize(log.fileSize)}
                        </div>
                      </div>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <User size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {log.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {log.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-full sm:w-auto px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-full sm:w-auto px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// ✅ Reusable Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}> = ({ title, value, icon, className }) => {
  return (
    <div className={`bg-white p-3 sm:p-5 rounded-xl shadow-sm border ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
            {value}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ExportLogsPage;
