import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Processing } from '@/components/ui/icons/Processing';
import { Contact, Package as PackageIcon, Users, Video } from 'lucide-react'; // use Video icon for webinars

interface DashboardStats {
  totalUsers: number;
  totalExecutives: number;
  bannedUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalRequests: number;
  pendingRequests: number;
  totalRevenue: number; // kept in state but no longer displayed
}

interface Pkg {
  id: string;
  name: string;
  priceInCoins: number;
  validityDays: number;
  features: string[];
}

const AdminDashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExecutives: 0,
    bannedUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]); // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Added webinars call
      const [usersRes, executivesRes, productsRes, requestsRes, packagesRes, webinarsRes] = await Promise.all([
        axios.get(`${BackendUrl}/admin/getallusers`, { headers }),
        axios.get(`${BackendUrl}/executive/get-executives`, { headers }),
        axios.get(`${BackendUrl}/goods/admin/products`, { headers }),
        axios.get(`${BackendUrl}/goods/admin/requests`, { headers }),
        axios.get(`${BackendUrl}/package/allpackages`, { headers }),
        axios.get(`${BackendUrl}/webinar`, { headers }), // adjust if public
      ]);

      const usersData = usersRes.data?.AllUsers || [];
      const executives = executivesRes.data || [];
      const products = productsRes.data?.products || [];
      const requests = requestsRes.data?.requests || [];
      const pkgs = Array.isArray(packagesRes.data?.packages)
        ? packagesRes.data.packages
        : Array.isArray(packagesRes.data)
        ? packagesRes.data
        : [];

      // Shape webinars payload flexibly
      const webinarsData = Array.isArray(webinarsRes.data)
        ? webinarsRes.data
        : (webinarsRes.data?.webinars || webinarsRes.data || []);

      setPackages(pkgs);
      setWebinars(webinarsData);

      const bannedUsers = usersData.filter((u: any) => u.isBanned).length;
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const pendingRequests = requests.filter((r: any) => r.status === 'PENDING').length;

      const totalRevenue = requests
        .filter((r: any) => ['APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(r.status))
        .reduce((sum: number, r: any) => sum + (r.totalCoins || 0), 0);

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalExecutives: executives.length,
        bannedUsers,
        totalProducts: products.length,
        activeProducts,
        totalRequests: requests.length,
        pendingRequests,
        totalRevenue,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Package counting (unchanged)
  const packageCountsById = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of users) {
      const pid = u.packageId;
      if (pid) counts[pid] = (counts[pid] || 0) + 1;
    }
    return counts;
  }, [users]);

  const packageCountsByName = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of users) {
      const pname = u.package?.name || u.packageName;
      if (pname) counts[pname] = (counts[pname] || 0) + 1;
    }
    return counts;
  }, [users]);

  // Webinar metrics
  const totalWebinars = webinars.length;
  const now = new Date();
  const activeWebinars = webinars.filter((w: any) => {
    const d = new Date(w.date);
    return Number.isFinite(d.getTime()) && d >= now;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Processing />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
        <button onClick={fetchDashboardStats} className="ml-4 text-red-600 underline hover:text-red-800">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 pb-4">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Users" value={stats.totalUsers} icon={<Users/>} gradient="from-blue-500 to-blue-600" />
        {/* Replaced revenue with webinars */}
        <MetricCard label="Active Webinars" value={activeWebinars} suffix={`/${totalWebinars}`} icon={<Video/>} gradient="from-green-500 to-emerald-600" />
        <MetricCard label="Active Products" value={stats.activeProducts} suffix={`/${stats.totalProducts}`} icon={<PackageIcon/>} gradient="from-purple-500 to-purple-600" />
        <MetricCard label="Executives" value={stats.totalExecutives} icon={<Contact/>} gradient="from-orange-500 to-orange-600" />
      </div>

      {/* Package Distribution from live data */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Package Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {packages.map((p) => {
            const byId = packageCountsById[p.id] || 0;
            const byName = packageCountsByName[p.name] || 0;
            const count = byId || byName;
            return (
              <PackageChip
                key={p.id}
                label={p.name}
                count={count}
                color="bg-slate-50 text-slate-800 border-slate-200"
              />
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <QuickStat label="Pending Requests" value={stats.pendingRequests} total={stats.totalRequests} color="text-orange-600" bgColor="bg-orange-50" />
        <QuickStat label="Banned Users" value={stats.bannedUsers} color="text-red-600" bgColor="bg-red-50" />
        <QuickStat label="Inactive Products" value={stats.totalProducts - stats.activeProducts} color="text-gray-600" bgColor="bg-gray-50" />
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={fetchDashboardStats} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, suffix, icon, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-lg p-3 sm:p-4 text-white shadow-md`}>
    <div className="flex items-start justify-between mb-1">
      <span className="text-xs sm:text-sm font-medium opacity-90">{label}</span>
      <span className="text-lg sm:text-xl">{icon}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</span>
      {suffix && <span className="text-xs sm:text-sm opacity-80">{suffix}</span>}
    </div>
  </div>
);

interface PackageChipProps { label: string; count: number; color: string; }
const PackageChip: React.FC<PackageChipProps> = ({ label, count, color }) => (
  <div className={`${color} border rounded-lg px-3 py-2 text-center`}>
    <div className="text-xs font-medium opacity-75">{label}</div>
    <div className="text-lg sm:text-xl font-bold mt-0.5">{count}</div>
  </div>
);

interface QuickStatProps { label: string; value: number; total?: number; color: string; bgColor: string; }
const QuickStat: React.FC<QuickStatProps> = ({ label, value, total, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-3 sm:p-4 border border-gray-200`}>
    <div className="text-xs sm:text-sm text-gray-600 mb-1">{label}</div>
    <div className="flex items-baseline gap-2">
      <span className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</span>
      {total !== undefined && <span className="text-xs text-gray-500">of {total}</span>}
    </div>
  </div>
);

export default AdminDashboardStats;
