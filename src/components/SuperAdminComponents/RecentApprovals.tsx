// components/superadmin/RecentApprovals.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Processing } from '@/components/ui/icons/Processing';

const RecentApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentApprovals();
  }, []);

  const fetchRecentApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/superadmin/manage-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter users approved in last 7 days
      const recentlyApproved = res.data.AllUsers.filter(user => 
        user.approvedAt && new Date(user.approvedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      setApprovals(recentlyApproved);
    } catch (err) {
      console.error('Error fetching recent approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 flex justify-center">
        <Processing />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
        <h3 className="text-xl font-bold">Recent Approvals (Last 7 Days)</h3>
      </div>
      <div className="p-6">
        {approvals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No recent approvals</p>
        ) : (
          <div className="space-y-4">
            {approvals.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-700 mb-1">
                    {user.packageName}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(user.approvedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentApprovals;
