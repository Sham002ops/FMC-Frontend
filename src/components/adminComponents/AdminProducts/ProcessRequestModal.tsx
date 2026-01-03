// src/components/admin/products/ProcessRequestModal.tsx

import React, { useState } from 'react';
import { X, Shield, Tag } from 'lucide-react';
import { ProductRequest } from './types';
import { PACKAGE_COLORS } from './constants';

interface ProcessRequestModalProps {
  request: ProductRequest;
  onClose: () => void;
  onProcess: (requestId: string, action: 'APPROVED' | 'REJECTED', adminNotes: string) => void;
}

const ProcessRequestModal: React.FC<ProcessRequestModalProps> = ({ request, onClose, onProcess }) => {
  const [action, setAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const userPackage = request.user.packageName || 'None';
  const productPackages = request.product.availableForPackages;
  const hasPackageAccess = 
    request.product.restrictionType === 'ALL' || 
    (request.product.restrictionType === 'SPECIFIC' && productPackages.includes(userPackage));

  const handleSubmit = async () => {
    if (!adminNotes.trim()) {
      alert('Please enter admin notes');
      return;
    }

    setLoading(true);
    await onProcess(request.id, action, adminNotes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Process Request</h2>
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
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{request.product.name}</p>
                <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                <p className="text-sm text-emerald-600 font-semibold">
                  Total: {request.totalCoins} coins
                </p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {request.product.restrictionType === 'ALL' ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      <Shield className="w-3 h-3" />
                      All Packages
                    </span>
                  ) : (
                    productPackages.map((pkg) => {
                      const colors = PACKAGE_COLORS[pkg];
                      return (
                        <span
                          key={pkg}
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-semibold ${colors?.bg} ${colors?.text}`}
                        >
                          {pkg}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">User</p>
                <p className="text-sm text-gray-900">{request.user.name} ({request.user.email})</p>
              </div>
              
              {userPackage && userPackage !== 'None' && (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${PACKAGE_COLORS[userPackage]?.badge || 'bg-gray-500'} text-white`}>
                  <Tag className="w-3 h-3" />
                  {userPackage}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Current Balance:</strong> {request.user.coins} coins
              </p>
              <p className="text-sm text-gray-700">
                <strong>Product Stock:</strong> {request.product.stock} available
              </p>
            </div>
          </div>

          {!hasPackageAccess && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-orange-700 text-sm font-semibold mb-1">
                ⚠️ Package Restriction Warning
              </p>
              <p className="text-orange-600 text-xs">
                User's package ({userPackage}) does not have access to this product. 
                Required: {productPackages.join(', ')}
              </p>
            </div>
          )}

          {request.user.coins < request.totalCoins && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">
                ⚠️ Warning: User has insufficient coins! (Need {request.totalCoins}, Have {request.user.coins})
              </p>
            </div>
          )}

          {request.product.stock < request.quantity && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">
                ⚠️ Warning: Insufficient stock available! (Need {request.quantity}, Have {request.product.stock})
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Action *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="APPROVED"
                  checked={action === 'APPROVED'}
                  onChange={(e) => setAction('APPROVED')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm font-medium">✓ Approve</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="REJECTED"
                  checked={action === 'REJECTED'}
                  onChange={(e) => setAction('REJECTED')}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm font-medium">✗ Reject</span>
              </label>
            </div>
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
              placeholder={
                action === 'APPROVED'
                  ? 'e.g., Approved for processing. Will ship within 2 days.'
                  : 'e.g., Rejected due to insufficient stock / package restrictions.'
              }
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
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                action === 'APPROVED'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                action === 'APPROVED' ? '✓ Approve Request' : '✗ Reject Request'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessRequestModal;
