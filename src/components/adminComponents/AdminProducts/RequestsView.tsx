// src/components/admin/products/RequestsView.tsx

import React from 'react';
import { Filter, CheckCircle, Truck, Tag, Shield } from 'lucide-react';
import { ProductRequest } from './types';
import { PACKAGE_COLORS } from './constants';

interface RequestsViewProps {
  requests: ProductRequest[];
  requestStatusFilter: string;
  setRequestStatusFilter: (value: string) => void;
  onProcessRequest: (request: ProductRequest) => void;
  getStatusColor: (status: string) => string;
}

const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  requestStatusFilter,
  setRequestStatusFilter,
  onProcessRequest,
  getStatusColor
}) => {
  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <select
          value={requestStatusFilter}
          onChange={(e) => setRequestStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <img
                src={request.product.images[0]}
                alt={request.product.name}
                className="w-full lg:w-32 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.product.name}</h3>
                    <p className="text-sm text-gray-600">{request.product.heading}</p>
                    
                    {/* Product Package Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {request.product.restrictionType === 'ALL' ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          <Shield className="w-3 h-3" />
                          All Packages
                        </span>
                      ) : (
                        request.product.availableForPackages.map((pkg) => {
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="text-sm font-semibold">{request.user.name}</p>
                    <p className="text-xs text-gray-600">{request.user.email}</p>
                    
                    {/* User Package Badge */}
                    {request.user.packageName && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 font-semibold ${PACKAGE_COLORS[request.user.packageName]?.bg} ${PACKAGE_COLORS[request.user.packageName]?.text}`}>
                        <Tag className="w-3 h-3" />
                        {request.user.packageName}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm font-semibold">{request.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Coins</p>
                    <p className="text-sm font-semibold text-emerald-600">{request.totalCoins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User Balance</p>
                    <p className="text-sm font-semibold">{request.user.coins} coins</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-900">{request.deliveryAddress}</p>
                  <p className="text-sm text-gray-900 mt-1">Phone: {request.phoneNumber}</p>
                </div>

                {request.notes && (
                  <div className="mb-4 bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs text-gray-700 mb-1">User Notes:</p>
                    <p className="text-sm text-gray-900">{request.notes}</p>
                  </div>
                )}

                {request.adminNotes && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-xs text-blue-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-blue-900">{request.adminNotes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {request.status === 'PENDING' && (
                    <button
                      onClick={() => onProcessRequest(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Process
                    </button>
                  )}
                  {['APPROVED', 'PROCESSING', 'SHIPPED'].includes(request.status) && (
                    <button
                      onClick={() => onProcessRequest(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Truck className="w-4 h-4" />
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsView;
