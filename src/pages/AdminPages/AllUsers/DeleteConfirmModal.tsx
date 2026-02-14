import React from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User | null;
  deletionReason: string;
  actionLoading: string | null;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({
  user,
  deletionReason,
  actionLoading,
  onReasonChange,
  onConfirm,
  onCancel,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-red-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Confirm User Deletion</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Warning:</span> You are about to permanently delete this user account.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">User to be deleted:</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Role: {user.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason for deletion <span className="text-red-600">*</span>
            </label>
            <textarea
              value={deletionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter the reason why this user is being deleted (e.g., Violated terms of service, Duplicate account, User requested deletion)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {deletionReason.length}/500 characters
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Note:</span> This action cannot be undone. The user's data will be moved to the deleted users archive.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={actionLoading === user.id}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!deletionReason.trim() || actionLoading === user.id}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
              !deletionReason.trim() || actionLoading === user.id
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {actionLoading === user.id ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
