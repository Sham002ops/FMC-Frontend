import React from 'react';
import { Eye, Ban, CheckCircle, Trash2, ShieldAlert } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageName: string | null;
  role: string;
  isBanned?: boolean;
}

interface Props {
  users: User[];
  sortField: string;
  sortOrder: 'asc' | 'desc';
  actionLoading: string | null;
  onSort: (field: any) => void;
  onView: (user: User) => void;
  onBanToggle: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTableDesktop: React.FC<Props> = ({
  users,
  sortField,
  sortOrder,
  actionLoading,
  onSort,
  onView,
  onBanToggle,
  onDelete,
}) => {
  // ✅ Check if user is SUPER_ADMIN
  const isSuperAdmin = (role: string) => role === 'SUPER_ADMIN';

  return (
    <div className="hidden md:block overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => onSort('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => onSort('email')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => onSort('coins')}
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
          {users.map((user) => {
            const isProtected = isSuperAdmin(user.role);

            return (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 transition ${
                  isProtected ? 'bg-yellow-50/30' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {isProtected && (
                      <ShieldAlert className="w-4 h-4 text-yellow-600"  />
                    )}
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
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
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : user.role === 'ADMIN'
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
                    {/* View Button - Always Enabled */}
                    <button
                      title="View Details"
                      onClick={() => onView(user)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>

                    {/* Ban/Unban Button - Disabled for SUPER_ADMIN */}
                    <button
                      title={
                        isProtected
                          ? 'Cannot ban/unban SuperAdmin'
                          : user.isBanned
                          ? 'Unban User'
                          : 'Ban User'
                      }
                      disabled={actionLoading === user.id || isProtected}
                      onClick={() => onBanToggle(user)}
                      className={`p-2 rounded-lg transition ${
                        user.isBanned
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-red-100 hover:bg-red-200'
                      } ${
                        isProtected || actionLoading === user.id
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {user.isBanned ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Ban className="w-4 h-4 text-red-600" />
                      )}
                    </button>

                    {/* Delete Button - Disabled for SUPER_ADMIN */}
                    <button
                      title={
                        isProtected
                          ? 'Cannot delete SuperAdmin'
                          : 'Delete User'
                      }
                      disabled={actionLoading === user.id || isProtected}
                      onClick={() => onDelete(user)}
                      className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition ${
                        isProtected || actionLoading === user.id
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTableDesktop;
