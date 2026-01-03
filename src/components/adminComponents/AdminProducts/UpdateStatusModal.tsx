// src/components/admin/products/UpdateStatusModal.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProductRequest } from './types';

interface UpdateStatusModalProps {
  request: ProductRequest;
  onClose: () => void;
  onUpdate: (
    requestId: string,
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
    adminNotes: string
  ) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ request, onClose, onUpdate }) => {
  const [status, setStatus] = useState<'PROCESSING' | 'SHIPPED' | 'DELIVERED'>(
    request.status === 'APPROVED' ? 'PROCESSING' : 
    request.status === 'PROCESSING' ? 'SHIPPED' : 'DELIVERED'
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!adminNotes.trim()) {
      alert('Please enter admin notes');
      return;
    }

    setLoading(true);
    await onUpdate(request.id, status, adminNotes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Update Status</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={request.product.images[0]}
                alt={request.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold text-gray-900">{request.product.name}</p>
                <p className="text-sm text-gray-600">User: {request.user.name}</p>
                <p className="text-sm text-gray-600">Current Status: {request.status}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes *
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              required
              placeholder="e.g., Shipped via FedEx. Tracking: 1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
