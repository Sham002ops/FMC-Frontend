import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { Search, X, Ban, CheckCircle, Trash2, Eye } from 'lucide-react';
import { ExecutiveStatsModal } from '../../components/ExecutiveComponents/ExecutiveStatsModal';

interface Executive {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  isBanned: boolean;
  joinedAt?: string;
}

const AllExecutive: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allExecutives, setAllExecutives] = useState<Executive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<Executive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
      setFilteredExecutives(data);
    } catch (err) {
      console.error('Error fetching executives:', err);
      setError('Failed to fetch executives');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredExecutives(allExecutives);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allExecutives.filter(exec =>
      exec.name.toLowerCase().includes(lowercaseQuery) ||
      exec.email.toLowerCase().includes(lowercaseQuery) ||
      exec.referralCode.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredExecutives(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredExecutives(allExecutives);
  };

  const handleBanToggle = async (executive: Executive) => {
    setActionLoading(executive.id);
    setError(null);
    try {
      await axios.patch(
        `${BackendUrl}/executive/${executive.id}/ban`,
        { isBanned: !executive.isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExecutives();
    } catch (err) {
      setError('Failed to update ban status');
    }
    setActionLoading(null);
  };

  const handleDelete = async (executive: Executive) => {
    if (!window.confirm(`Are you sure you want to delete ${executive.name}?`)) return;
    setActionLoading(executive.id);
    setError(null);
    try {
      await axios.delete(`${BackendUrl}/executive/${executive.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExecutives();
    } catch (err) {
      setError('Failed to delete executive');
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <Header1 />
      </header>

      <main className="flex-1 flex flex-col pt-28 lg:pl-24 sm:pt-24 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            All Executives
          </h1>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition w-full sm:w-auto"
            onClick={fetchExecutives}
          >
            Refresh
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or referral code..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found <span className="font-semibold">{filteredExecutives.length}</span> executive{filteredExecutives.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {filteredExecutives.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              {searchQuery ? 'No executives found matching your search' : 'No executives found'}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ✅ Desktop Table - Hidden on mobile/small tablets */}
            <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Referral Code</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExecutives.map(exec => (
                    <tr key={exec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium">{exec.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{exec.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-semibold rounded-full">
                          {exec.referralCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {exec.isBanned ? (
                          <span className="inline-flex items-center gap-1 text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            <Ban className="w-4 h-4" />
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {exec.joinedAt ? new Date(exec.joinedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            title="View Stats & Revenue"
                            onClick={() => handleViewStats(exec.id)}
                            className="p-2 rounded bg-blue-100 hover:bg-blue-200 transition"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>

                          <button
                            title={exec.isBanned ? 'Unban Executive' : 'Ban Executive'}
                            disabled={actionLoading === exec.id}
                            onClick={() => handleBanToggle(exec)}
                            className={`p-2 rounded transition ${
                              exec.isBanned ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
                            }`}
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
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
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

            {/* ✅ Card View - Shows on mobile and tablets (< 1024px) */}
            <div className="lg:hidden space-y-4">
              {filteredExecutives.map(exec => (
                <div key={exec.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                  {/* Header with Name and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{exec.name}</h3>
                      <p className="text-sm text-gray-600 mt-0.5 break-words">{exec.email}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="ml-3">
                      {exec.isBanned ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap">
                          <Ban className="w-3 h-3" />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Referral Code</p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-semibold rounded">
                        {exec.referralCode}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Joined</p>
                      <p className="text-sm text-gray-700">
                        {exec.joinedAt ? new Date(exec.joinedAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleViewStats(exec.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Stats
                    </button>
                    
                    <button
                      disabled={actionLoading === exec.id}
                      onClick={() => handleBanToggle(exec)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium ${
                        exec.isBanned 
                          ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {exec.isBanned ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Unban
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4" />
                          Ban
                        </>
                      )}
                    </button>
                    
                    <button
                      disabled={actionLoading === exec.id}
                      onClick={() => handleDelete(exec)}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

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
