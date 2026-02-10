import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Package,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Gift,
  Cake,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  number: string;
  packageName: string;
  transactionId: string;
  requestedCoins: number;
  executiveRefode: string;
  address?: string;
  pinCode?: string;
  dateOfBirth?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  requestedByDetails?: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  registration: PendingUser;
  onProcess: (id: string, action: 'APPROVE' | 'REJECT', reason?: string) => Promise<void>;
}

const PendingRegistrationModal: React.FC<Props> = ({ isOpen, onClose, registration, onProcess }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this registration? This will create a new user account.')) return;

    setProcessing(true);
    try {
      await onProcess(registration.id, 'APPROVE');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this registration?')) return;

    setProcessing(true);
    try {
      await onProcess(registration.id, 'REJECT', rejectionReason);
    } finally {
      setProcessing(false);
      setShowRejectForm(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {registration.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
              <Clock className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-yellow-800">Pending Review</p>
                <p className="text-sm text-yellow-700">This registration is awaiting approval</p>
              </div>
            </div>
          )}

          {registration.status === 'APPROVED' && registration.processedAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-green-800">Approved</p>
                <p className="text-sm text-green-700">
                  Approved on {new Date(registration.processedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {registration.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="font-semibold text-red-800">Rejected</p>
              </div>
              {registration.processedAt && (
                <p className="text-sm text-red-700 mb-2">
                  Rejected on {new Date(registration.processedAt).toLocaleString()}
                </p>
              )}
              {registration.rejectionReason && (
                <div className="mt-3 p-3 bg-red-100 rounded">
                  <p className="text-sm font-medium text-red-900">Reason:</p>
                  <p className="text-sm text-red-800 mt-1">{registration.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={18} />
              User Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{registration.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 break-all">{registration.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{registration.number}</p>
                </div>
              </div>

              {registration.dateOfBirth && (
                <div className="flex items-start gap-3">
                  <Cake className="text-gray-400 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {new Date(registration.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {registration.address && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="text-gray-400 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {registration.address}
                      {registration.pinCode && ` - ${registration.pinCode}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package size={18} className="text-purple-600" />
              Package Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="text-purple-600 mt-1" size={16} />
                <div>
                  <p className="text-xs text-purple-700">Selected Package</p>
                  <p className="font-medium text-purple-900">{registration.packageName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="text-purple-600 mt-1" size={16} />
                <div>
                  <p className="text-xs text-purple-700">Requested Coins</p>
                  <p className="font-medium text-purple-900">{registration.requestedCoins} coins</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <CreditCard className="text-purple-600 mt-1" size={16} />
                <div>
                  <p className="text-xs text-purple-700">Transaction ID</p>
                  <code className="text-sm font-mono bg-purple-100 px-2 py-1 rounded text-purple-900">
                    {registration.transactionId}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Information */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Executive Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="text-blue-600 mt-1" size={16} />
                <div>
                  <p className="text-xs text-blue-700">Executive Code</p>
                  <code className="text-sm font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                    {registration.executiveRefode}
                  </code>
                </div>
              </div>

              {registration.requestedByDetails && (
                <>
                  <div className="flex items-start gap-3">
                    <User className="text-blue-600 mt-1" size={16} />
                    <div>
                      <p className="text-xs text-blue-700">Executive Name</p>
                      <p className="font-medium text-blue-900">{registration.requestedByDetails.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <Mail className="text-blue-600 mt-1" size={16} />
                    <div>
                      <p className="text-xs text-blue-700">Executive Email</p>
                      <p className="font-medium text-blue-900">{registration.requestedByDetails.email}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-600" size={16} />
                <span className="text-gray-600">Requested:</span>
                <span className="font-medium text-gray-900">
                  {new Date(registration.requestedAt).toLocaleString()}
                </span>
              </div>
              {registration.processedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-600">Processed:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(registration.processedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Form */}
          {showRejectForm && registration.status === 'PENDING' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-red-900 mb-2">
                Reason for Rejection *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this registration..."
                rows={4}
                className="w-full"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {processing ? 'Processing...' : 'Confirm Rejection'}
                </Button>
                <Button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  variant="outline"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {registration.status === 'PENDING' && !showRejectForm && (
          <div className="border-t p-6 bg-gray-50 flex gap-3 sticky bottom-0">
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              {processing ? 'Processing...' : 'Approve'}
            </Button>
            <Button
              onClick={() => setShowRejectForm(true)}
              disabled={processing}
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <XCircle size={18} />
              Reject
            </Button>
          </div>
        )}

        {registration.status !== 'PENDING' && (
          <div className="border-t p-6 bg-gray-50 sticky bottom-0">
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRegistrationModal;
