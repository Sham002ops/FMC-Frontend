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
  user: User;
  actionLoading: string | null;
  onView: (user: User) => void;
  onBanToggle: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCardMobile: React.FC<Props> = ({
  user,
  actionLoading,
  onView,
  onBanToggle,
  onDelete,
}) => {
  const isProtected = user.role === 'SUPER_ADMIN';

  return (
    <div
      className={`bg-white p-5 rounded-lg shadow-sm border relative ${
        isProtected ? 'border-yellow-300 bg-yellow-50/20' : 'border-gray-200'
      }`}
    >
      {/* Action Buttons - Top Right */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          title="View"
          onClick={() => onView(user)}
          className="p-2 rounded-lg bg-blue-100"
        >
          <Eye className="w-4 h-4 text-blue-600" />
        </button>
        <button
          title={
            isProtected
              ? 'Cannot ban/unban SuperAdmin'
              : user.isBanned
              ? 'Unban'
              : 'Ban'
          }
          disabled={actionLoading === user.id || isProtected}
          onClick={() => onBanToggle(user)}
          className={`p-2 rounded-lg ${
            user.isBanned ? 'bg-green-100' : 'bg-red-100'
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
        <button
          title={isProtected ? 'Cannot delete SuperAdmin' : 'Delete'}
          disabled={actionLoading === user.id || isProtected}
          onClick={() => onDelete(user)}
          className={`p-2 rounded-lg bg-gray-100 ${
            isProtected || actionLoading === user.id
              ? 'opacity-40 cursor-not-allowed'
              : ''
          }`}
        >
          <Trash2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* User Info */}
      <div className="pr-24 mb-3">
        <div className="flex items-center gap-2 mb-1">
          {isProtected && (
            <ShieldAlert className="w-5 h-5 text-yellow-600" />
          )}
          <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
        </div>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Coins:</span>
          <span className="ml-2 font-medium text-gray-900">{user.coins}</span>
        </div>
        <div>
          <span className="text-gray-500">Role:</span>
          <span className="ml-2 font-medium text-gray-900 uppercase">
            {user.role}
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Package:</span>
          <span className="ml-2 font-medium text-gray-900">
            {user.packageName || '-'}
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Status:</span>
          <span
            className={`ml-2 font-medium ${
              user.isBanned ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {user.isBanned ? 'Banned' : 'Active'}
          </span>
        </div>
      </div>

      {isProtected && (
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Protected account - Cannot be modified or deleted
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCardMobile;
