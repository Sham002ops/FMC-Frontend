import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { Pencil, Trash2, Eye, Ban, CheckCircle, Search, X } from 'lucide-react';

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

const AllUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // ✅ Add this
  const [searchQuery, setSearchQuery] = useState(''); // ✅ Add this
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem("token");

  // Get all users (READ)
  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BackendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []); // ✅ Initialize filtered list
    } catch (err) {
      setError('Could not fetch users');
      setAllUsers([]);
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  // ✅ Search filter function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allUsers.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery) ||
      user.packageName?.toLowerCase().includes(lowercaseQuery) ||
      user.executiveRefode?.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredUsers(filtered);
  };

  // ✅ Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredUsers(allUsers);
  };

  // Ban or unban user
  const handleBanToggle = async (user: User) => {
    setActionLoading(user.id);
    setError(null);
    try {
      await axios.patch(`${BackendUrl}/admin/user/${user.id}/ban`, 
        { isBanned: !user.isBanned }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllUsers();
    } catch (err) {
      setError('Failed to update ban status');
    }
    setActionLoading(null);
  };

  // Delete user
  const handleDelete = async (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(user.id);
    setError(null);
    try {
      await axios.delete(`${BackendUrl}/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
    setActionLoading(null);
  };

  useEffect(() => { fetchAllUsers(); }, []);

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
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <Header1 />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-28 lg:pl-24 sm:pt-24 px-4 sm:px-6 md:px-8">
        {/* Top section with title and actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            All Users
          </h1>
          <button 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition w-full sm:w-auto"
            onClick={fetchAllUsers}
          >
            Refresh
          </button>
        </div>

        {/* ✅ Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, role, package..."
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
              Found <span className="font-semibold">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
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
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Coins</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Package</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">Executive Ref.</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-gray-800">{user.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600 break-words">{user.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{user.coins}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user.packageName ?? "-"}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user.executiveRefode ?? "-"}</td>
                      <td className="px-4 py-2 text-center uppercase">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.isBanned ? (
                          <span className="flex items-center justify-center gap-1 text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                            <Ban className="w-4 h-4"/>&nbsp;Banned
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                            <CheckCircle className="w-4 h-4"/>&nbsp;Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center text-xs">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2 items-center justify-center">
                        <button
                          title={user.isBanned ? "Unban User" : "Ban User"}
                          disabled={actionLoading === user.id}
                          onClick={() => handleBanToggle(user)}
                          className={`p-2 rounded ${user.isBanned ? 'bg-green-100' : 'bg-red-100'} hover:bg-opacity-80 transition`}
                        >
                          {user.isBanned ? <CheckCircle className="w-4 h-4 text-green-600" /> 
                                         : <Ban className="w-4 h-4 text-red-600" />}
                        </button>
                        <button
                          title="Delete"
                          disabled={actionLoading === user.id}
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          title="View (not implemented)"
                          className="p-2 rounded bg-gray-50 hover:bg-blue-50 transition"
                          disabled
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          title="Edit (not implemented)"
                          className="p-2 rounded bg-gray-50 hover:bg-yellow-50 transition"
                          disabled
                        >
                          <Pencil className="w-4 h-4 text-yellow-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="sm:hidden space-y-4 mt-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 relative">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      title={user.isBanned ? "Unban User" : "Ban User"}
                      disabled={actionLoading === user.id}
                      onClick={() => handleBanToggle(user)}
                      className={`p-2 rounded ${user.isBanned ? 'bg-green-100' : 'bg-red-100'} hover:bg-opacity-80`}
                    >
                      {user.isBanned ? <CheckCircle className="w-4 h-4 text-green-600" /> 
                                    : <Ban className="w-4 h-4 text-red-600" />}
                    </button>
                    <button
                      title="Delete"
                      disabled={actionLoading === user.id}
                      onClick={() => handleDelete(user)}
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <h2 className="font-semibold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-600 text-sm mb-1"><strong>Email:</strong> {user.email}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Coins:</strong> {user.coins}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Package:</strong> {user.packageName ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Executive Refcode:</strong> {user.executiveRefode ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Status:</strong> 
                    <span className={`ml-1 ${user.isBanned ? 'text-red-600' : 'text-green-600'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm"><strong>Role:</strong> 
                    <span className={`ml-1 ${user.role === 'ADMIN' ? 'text-purple-600' : ''}`}>{user.role}</span>
                  </p>
                  <p className="text-gray-400 text-xs mt-2"><strong>Joined:</strong> {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "-"}</p>
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
