// components/superadmin/PendingRegistrationsTable.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ApprovalModal from './ApprovalModal';

interface PendingRegistrationsTableProps {
  registrations: any[];
  onRefresh: () => void;
}

const PendingRegistrationsTable = ({ registrations, onRefresh }: PendingRegistrationsTableProps) => {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (registration: any) => {
    setSelectedRegistration(registration);
    setModalOpen(true);
  };

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">All Clear!</h3>
        <p className="text-gray-500">No pending registration requests at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">User Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Package</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Executive</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Requested</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{reg.name}</p>
                      <p className="text-sm text-gray-500">{reg.email}</p>
                      {reg.number && (
                        <p className="text-xs text-gray-400">{reg.number}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {reg.packageName}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{reg.executiveRefode}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(reg.requestedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(reg)}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ApprovalModal
          registration={selectedRegistration}
          onClose={() => {
            setModalOpen(false);
            setSelectedRegistration(null);
          }}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default PendingRegistrationsTable;
