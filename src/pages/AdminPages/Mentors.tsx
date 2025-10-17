import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';
import { Users, Trash2, Ban, CheckCircle, Search } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  isBanned: boolean;
  coins: number;
}

const AllMentors: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllMentors();
  }, []);

  const fetchAllMentors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/admin/get-mentors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentors(response.data.AllMentors || []);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to fetch mentors');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BackendUrl}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentors(mentors.filter(m => m.id !== id));
      alert('Mentor deleted successfully');
    } catch (err) {
      console.error('Error deleting mentor:', err);
      alert('Failed to delete mentor');
    }
  };

  const handleBanToggle = async (mentor: Mentor) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BackendUrl}/admin/user/${mentor.id}/ban`,
        { isBanned: !mentor.isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMentors(
        mentors.map(m =>
          m.id === mentor.id ? { ...m, isBanned: !m.isBanned } : m
        )
      );
    } catch (err) {
      console.error('Error updating ban status:', err);
      alert('Failed to update mentor status');
    }
  };

  const filteredMentors = mentors.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="block lg:hidden">
        <MobileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              All Mentors
            </h1>
            <p className="text-gray-600 text-sm">
              Manage all mentors in the system
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mentors List */}
          {filteredMentors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No mentors found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coins
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMentors.map((mentor) => (
                      <tr key={mentor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {mentor.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {mentor.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mentor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {mentor.isBanned ? (
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
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {mentor.coins}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {new Date(mentor.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleBanToggle(mentor)}
                              className={`p-2 rounded-lg transition ${
                                mentor.isBanned
                                  ? 'bg-green-100 hover:bg-green-200'
                                  : 'bg-red-100 hover:bg-red-200'
                              }`}
                              title={mentor.isBanned ? 'Unban' : 'Ban'}
                            >
                              {mentor.isBanned ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Ban className="w-4 h-4 text-red-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(mentor.id, mentor.name)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                              title="Delete"
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
              <div className="sm:hidden space-y-4">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                          {mentor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-gray-500">{mentor.email}</p>
                        </div>
                      </div>
                      {mentor.isBanned ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600">Coins</p>
                        <p className="text-lg font-bold text-gray-800">
                          {mentor.coins}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600">Joined</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(mentor.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBanToggle(mentor)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
                          mentor.isBanned
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {mentor.isBanned ? (
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
                        onClick={() => handleDelete(mentor.id, mentor.name)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllMentors;
