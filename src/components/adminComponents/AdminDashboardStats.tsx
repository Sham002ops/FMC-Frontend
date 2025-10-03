import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Processing } from '@/components/ui/icons/Processing';
import { Box, CircleDollarSign, Contact, IdCard, IdCardIcon, LucideIdCard, Package, User, Users } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  infaPackageUsers: number;
  goldPackageUsers: number;
  goldPlusPackageUsers: number;
  elitePackageUsers: number;
  supremePackageUsers: number;
  totalExecutives: number;
  bannedUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalRequests: number;
  pendingRequests: number;
  totalRevenue: number;
}

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  validityDays: number;
  features: string[];
}

const AdminDashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    infaPackageUsers: 0,
    goldPackageUsers: 0,
    goldPlusPackageUsers: 0,
    elitePackageUsers: 0,
    supremePackageUsers: 0,
    totalExecutives: 0,
    bannedUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, executivesRes, productsRes, requestsRes, packagesRes] = await Promise.all([
        axios.get(`${BackendUrl}/admin/getallusers`, { headers }),
        axios.get(`${BackendUrl}/executive/get-executives`, { headers }),
        axios.get(`${BackendUrl}/goods/admin/products`, { headers }),
        axios.get(`${BackendUrl}/goods/admin/requests`, { headers }),
        axios.get(`${BackendUrl}/package/allpackages`, { headers }),
      ]);

      const users = usersRes.data.AllUsers || [];
      const executives = executivesRes.data || [];
      const products = productsRes.data.products || [];
      const requests = requestsRes.data.requests || [];
      const packages: Package[] = packagesRes.data || [];

      const infaPackage = packages.find((p) => p.name === 'Infa');
      const goldPackage = packages.find((p) => p.name === 'Gold');
      const goldPlusPackage = packages.find((p) => p.name === 'Gold+');
      const elitePackage = packages.find((p) => p.name === 'Elite');
      const supremePackage = packages.find((p) => p.name === 'Supreme');

      const infaUsers = users.filter((u: any) => u.packageId === infaPackage?.id).length;
      const goldUsers = users.filter((u: any) => u.packageId === goldPackage?.id).length;
      const goldPlusUsers = users.filter((u: any) => u.packageId === goldPlusPackage?.id).length;
      const eliteUsers = users.filter((u: any) => u.packageId === elitePackage?.id).length;
      const supremeUsers = users.filter((u: any) => u.packageId === supremePackage?.id).length;

      const bannedUsers = users.filter((u: any) => u.isBanned).length;
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const pendingRequests = requests.filter((r: any) => r.status === 'PENDING').length;
      
      const totalRevenue = requests
        .filter((r: any) => ['APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(r.status))
        .reduce((sum: number, r: any) => sum + (r.totalCoins || 0), 0);

      setStats({
        totalUsers: users.length,
        infaPackageUsers: infaUsers,
        goldPackageUsers: goldUsers,
        goldPlusPackageUsers: goldPlusUsers,
        elitePackageUsers: eliteUsers,
        supremePackageUsers: supremeUsers,
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
        <button
          onClick={fetchDashboardStats}
          className="ml-4 text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 pb-4">
      {/* Hero Stats - Most Important Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers}
          icon={<Users/>}
          gradient="from-blue-500 to-blue-600"
        />
        <MetricCard
          label="Total Revenue"
          value={stats.totalRevenue.toLocaleString()}
          suffix=" coins"
          icon= {<CircleDollarSign/>}
          gradient="from-green-500 to-emerald-600"
        />
        <MetricCard
          label="Active Products"
          value={stats.activeProducts}
          suffix={`/${stats.totalProducts}`}
          icon= {<Package/>}
          gradient="from-purple-500 to-purple-600"
        />
        <MetricCard
          label="Executives"
          value={stats.totalExecutives}
          icon={<Contact/>}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Package Distribution - Compact Cards */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Package Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <PackageChip label="Infa" count={stats.infaPackageUsers} color="bg-green-100 text-green-700 border-green-300" />
          <PackageChip label="Gold" count={stats.goldPackageUsers} color="bg-yellow-100 text-yellow-700 border-yellow-300" />
          <PackageChip label="Gold+" count={stats.goldPlusPackageUsers} color="bg-orange-100 text-orange-700 border-orange-300" />
          <PackageChip label="Elite" count={stats.elitePackageUsers} color="bg-purple-100 text-purple-700 border-purple-300" />
          <PackageChip label="Supreme" count={stats.supremePackageUsers} color="bg-slate-800 text-yellow-400 border-slate-600" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <QuickStat
          label="Pending Requests"
          value={stats.pendingRequests}
          total={stats.totalRequests}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <QuickStat
          label="Banned Users"
          value={stats.bannedUsers}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <QuickStat
          label="Inactive Products"
          value={stats.totalProducts - stats.activeProducts}
          color="text-gray-600"
          bgColor="bg-gray-50"
        />
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

// Compact Metric Card for Hero Stats
interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: string | React.ReactNode;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, suffix, icon, gradient }) => {
  return (
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
};

// Package Distribution Chip
interface PackageChipProps {
  label: string;
  count: number;
  color: string;
}

const PackageChip: React.FC<PackageChipProps> = ({ label, count, color }) => {
  return (
    <div className={`${color} border rounded-lg px-3 py-2 text-center`}>
      <div className="text-xs font-medium opacity-75">{label}</div>
      <div className="text-lg sm:text-xl font-bold mt-0.5">{count}</div>
    </div>
  );
};

// Quick Stat Component
interface QuickStatProps {
  label: string;
  value: number;
  total?: number;
  color: string;
  bgColor: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ label, value, total, color, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-3 sm:p-4 border border-gray-200`}>
      <div className="text-xs sm:text-sm text-gray-600 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</span>
        {total !== undefined && (
          <span className="text-xs text-gray-500">of {total}</span>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardStats;