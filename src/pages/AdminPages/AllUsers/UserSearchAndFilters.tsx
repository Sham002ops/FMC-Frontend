import React from 'react';
import { Search, X, Filter, Download, RefreshCw } from 'lucide-react';

interface Props {
  searchQuery: string;
  filterRole: string;
  filterStatus: string;
  filteredCount: number;
  totalCount: number;
  onSearch: (query: string) => void;
  onFilterChange: (type: 'role' | 'status', value: string) => void;
  onClearAll: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

const UserSearchAndFilters: React.FC<Props> = ({
  searchQuery,
  filterRole,
  filterStatus,
  filteredCount,
  totalCount,
  onSearch,
  onFilterChange,
  onClearAll,
  onExport,
  onRefresh,
}) => {
  return (
    <>
      {/* Action Buttons Row */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Search and Filters Card */}
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
            onChange={(e) => onSearch(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterRole}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="MENTOR">Mentor</option>
            <option value="EXECUTIVE">Executive</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>

          {(searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              Clear all
            </button>
          )}

          <div className="sm:ml-auto text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCount}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> users
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearchAndFilters;
