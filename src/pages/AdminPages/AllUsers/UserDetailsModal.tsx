import React from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Package,
  Coins,
  UserCheck,
  AlertTriangle,
  Ban,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { Processing } from '@/components/ui/icons/Processing';

interface User {
  id: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  coins: number;
  dateOfBirth?: string;
  packageName: string | null;
  executiveRefode: string | null;
  role: string;
  joinedAt?: string;
  isBanned?: boolean;
}

interface Props {
  user: User | null;
  executiveName: string | null;
  loadingExecutive: boolean;
  onClose: () => void;
  onDelete: (user: User) => void;
  onBanToggle: (user: User) => void;
}

const UserDetailsModal: React.FC<Props> = ({
  user,
  executiveName,
  loadingExecutive,
  onClose,
  onDelete,
  onBanToggle,
}) => {
  if (!user) return null;

  const isProtected = user.role === 'SUPER_ADMIN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">User Details</h2>
            {isProtected && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-400/20 rounded-lg border border-yellow-300">
                <ShieldAlert className="w-4 h-4 text-yellow-100" />
                <span className="text-xs font-semibold text-yellow-100">PROTECTED</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Protected Account Warning */}
          {isProtected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900 text-sm">Protected Account</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This is a SuperAdmin account and cannot be modified, banned, or deleted.
                  All action buttons are disabled for security purposes.
                </p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                <p className="font-medium text-gray-900 break-all">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">User Role</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
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
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Account Status</label>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {user.isBanned ? (
                    <>
                      <Ban className="w-3 h-3" /> Banned
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3" /> Active
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <p className="font-medium text-gray-900">{user.number || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Full Address
                </label>
                <p className="font-medium text-gray-900">{user.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">PIN / ZIP Code</label>
                <p className="font-medium text-gray-900">{user.pinCode || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account & Package Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Account & Package Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Coins className="w-3 h-3" /> FMC Coins Balance
                </label>
                <p className="text-2xl font-bold text-blue-600">{user.coins}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Membership Package
                </label>
                <p className="font-medium text-gray-900">{user.packageName || 'No package assigned'}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date of Birth
                </label>
                <p className="font-medium text-gray-900">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined Date
                </label>
                <p className="font-medium text-gray-900">
                  {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Executive/Referral Information */}
          {user.executiveRefode && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Referral Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Executive Referral Code</label>
                    <p className="font-mono font-medium text-gray-900">{user.executiveRefode}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Referred By Executive</label>
                    {loadingExecutive ? (
                      <div className="flex items-center gap-2">
                        <Processing />
                        <span className="text-sm text-gray-500">Loading...</span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">{executiveName || 'Unknown'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={() => onBanToggle(user)}
            disabled={isProtected}
            title={isProtected ? 'Cannot ban/unban SuperAdmin' : undefined}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
              isProtected
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : user.isBanned
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {user.isBanned ? (
              <>
                <User className="w-4 h-4" />
                Unban User
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Ban User
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(user)}
            disabled={isProtected}
            title={isProtected ? 'Cannot delete SuperAdmin' : undefined}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
              isProtected
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
