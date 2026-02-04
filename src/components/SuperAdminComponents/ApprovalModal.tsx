// components/superadmin/ApprovalModal.tsx
import { useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Processing } from '@/components/ui/icons/Processing';

interface ApprovalModalProps {
  registration: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ApprovalModal = ({ registration, onClose, onSuccess }: ApprovalModalProps) => {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        `${BackendUrl}/superadmin/pending-registrations/${registration.id}/process`,
        { action: 'APPROVED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Registration approved successfully',
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to approve registration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        `${BackendUrl}/superadmin/pending-registrations/${registration.id}/process`,
        { action: 'REJECTED', rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Registration rejected',
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to reject registration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Registration Details</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600 text-sm">Full Name</Label>
                <p className="font-semibold text-gray-900">{registration.name}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Email</Label>
                <p className="font-semibold text-gray-900">{registration.email}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Phone</Label>
                <p className="font-semibold text-gray-900">{registration.number || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Package</Label>
                <p className="font-semibold text-purple-600">{registration.packageName}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Executive Code</Label>
                <p className="font-semibold text-gray-900">{registration.executiveRefode}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Requested Coins</Label>
                <p className="font-semibold text-green-600">{registration.requestedCoins}</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason Input */}
          <div>
            <Label>Rejection Reason (if rejecting)</Label>
            <Textarea
              placeholder="Provide a detailed reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {loading ? <Processing /> : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              {loading ? <Processing /> : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
