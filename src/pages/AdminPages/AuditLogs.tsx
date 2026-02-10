import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Header1 from '@/components/Header';
import { Processing } from '@/components/ui/icons/Processing';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Filter, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  changes: {
    before?: any;
    after?: any;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface AuditStats {
  totalLogs: number;
  byEntity: { entity: string; count: number }[];
  byAction: { action: string; count: number }[];
  recentActivity: AuditLog[];
}

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    entity: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [page, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(filters.entity && { entity: filters.entity }),
        ...(filters.action && { action: filters.action }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const res = await axios.get(`${BackendUrl}/audit/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(res.data.logs);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch audit logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/audit/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  // ✅ Helper to escape CSV fields
  const escapeCsvField = (field: any): string => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // ✅ Helper to format changes for CSV
  const formatChanges = (changes: any): string => {
    if (!changes) return '';
    
    const parts: string[] = [];
    
    if (changes.before && Object.keys(changes.before).length > 0) {
      parts.push(`Before: ${JSON.stringify(changes.before)}`);
    }
    
    if (changes.after && Object.keys(changes.after).length > 0) {
      parts.push(`After: ${JSON.stringify(changes.after)}`);
    }
    
    return parts.join(' | ');
  };

  // ✅ Categorized CSV Export with Logging
  const exportToCSV = async () => {
    try {
      // Group logs by Entity and Action
      const categorizedLogs: Record<string, Record<string, AuditLog[]>> = {};

      logs.forEach((log) => {
        const entity = log.entity || 'Unknown';
        const action = log.action || 'UNKNOWN';

        if (!categorizedLogs[entity]) {
          categorizedLogs[entity] = {};
        }

        if (!categorizedLogs[entity][action]) {
          categorizedLogs[entity][action] = [];
        }

        categorizedLogs[entity][action].push(log);
      });

      // Build CSV content with categories
      const csvLines: string[] = [];

      // Add header
      csvLines.push('Category,Date,Entity,Action,Entity ID,User Name,User Email,Changes');
      csvLines.push(''); // Empty line for readability

      // Add data by category
      Object.keys(categorizedLogs).sort().forEach((entity) => {
        Object.keys(categorizedLogs[entity]).sort().forEach((action) => {
          const categoryLogs = categorizedLogs[entity][action];
          
          // Add category header
          const categoryName = `${entity} / ${action}`;
          csvLines.push(`"${categoryName}"`);
          
          // Add logs for this category
          categoryLogs.forEach((log) => {
            const row = [
              '', // Category column (empty for data rows)
              escapeCsvField(formatDate(log.createdAt)),
              escapeCsvField(log.entity),
              escapeCsvField(log.action),
              escapeCsvField(log.entityId),
              escapeCsvField(log.user?.name || 'System'),
              escapeCsvField(log.user?.email || ''),
              escapeCsvField(formatChanges(log.changes)),
            ];
            csvLines.push(row.join(','));
          });

          // Add empty line after each category
          csvLines.push('');
        });
      });

      // Create CSV content
      const csvContent = csvLines.join('\n');
      const fileName = `audit-logs-categorized-${new Date().toISOString().split('T')[0]}.csv`;
      const fileSize = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }).size;

      // ✅ Log export to backend (async, non-blocking)
      const token = localStorage.getItem('token');
      axios.post(
        `${BackendUrl}/export-logs/log`,
        {
          entity: 'AuditLogs',
          fileName,
          recordCount: logs.length,
          fileSize,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => {
        console.error('Failed to log export:', err);
        // Don't block download if logging fails
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: `Exported ${logs.length} audit logs in ${Object.keys(categorizedLogs).length} categories`,
      });

    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

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

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
          <Header1 />
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-28 lg:pl-28 px-4 sm:px-6 md:px-8 overflow-auto pb-8">
          {/* Page Title */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-gray-600 mt-1">Track all system changes and user activity</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                disabled={logs.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Logs</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogs}</p>
              </div>
              {stats.byAction.map((item) => (
                <div key={item.action} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500">{item.action}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Entity</Label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={filters.entity}
                  onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                >
                  <option value="">All Entities</option>
                  <option value="User">User</option>
                  <option value="Package">Package</option>
                  <option value="Task">Task</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Order">Order</option>
                  <option value="Executive">Executive</option>
                  <option value="YogaSchedule">Yoga Schedule</option>
                </select>
              </div>
              <div>
                <Label>Action</Label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="EXPORT">Export</option>
                </select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Logs Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Processing />
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">
                {filters.entity || filters.action || filters.startDate || filters.endDate
                  ? 'Try adjusting your filters'
                  : 'Audit logs will appear here as actions are performed'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Entity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Changes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {formatDate(log.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="font-medium">
                            {log.entity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{log.user?.name || 'System'}</p>
                              <p className="text-xs text-gray-500">{log.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
                              View Changes
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-w-md">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline">{log.entity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(log.createdAt)}
                    </p>
                    <p className="text-sm text-gray-900 font-medium mb-2">
                      By: {log.user?.name || 'System'}
                    </p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-indigo-600 font-medium">
                        View Changes
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
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

export default AuditLogsPage;
