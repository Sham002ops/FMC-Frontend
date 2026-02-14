import React from 'react';
import { CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  show: boolean;
  deletedUserName: string;
  onClose: () => void;
}

const DeleteSuccessModal: React.FC<Props> = ({ show, deletedUserName, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Deleted Successfully!</h2>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold text-gray-900">{deletedUserName}</span> has been removed from the system.
          </p>
          <p className="text-sm text-gray-500">
            All user data has been archived and can be viewed in the deleted users section.
          </p>
        </div>

        {/* Info Box */}
        <div className="mx-6 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">View Deleted Users</p>
              <p className="text-xs text-blue-700">
                You can review all deleted users, including their deletion reasons and audit trail, in the Deleted Users page.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Stay Here
          </button>
          <button
            onClick={() => navigate('/admin/deleted-users')}
            className="flex-1 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-2"
          >
            View Deleted Users
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuccessModal;
