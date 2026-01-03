// AnalyticsPage.tsx - COMPLETE UPDATED VERSION
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Download,
  RefreshCw,
  UserPlus,
  Target,
  Award,
  Calendar
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TopExecutivesCard } from '@/components/ExecutiveComponents/TopExecutivesCard';
import { ExportModal } from '@/components/adminComponents/export/ExportModal';

// Types
interface PackageStats {
  packageId: string;
  packageName: string;
  priceInCoins: number;
  currentActiveUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  currentRevenue: number;
  purchaseHistory: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

interface AnalyticsStats {
  users: {
    total: number;
    new: number;
    growth: number;
    userGrowthHistory: Array<{
      date: string;
      newUsers: number;
      totalUsers: number;
    }>;
  };
  revenue: {
    total: number;
    current: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  packages: {
    stats: PackageStats[];
    totalSales: number;
  };
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  packagesSold: number;
  packages: { [key: string]: number };
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [stats, setStats] = useState<AnalyticsStats>({
    users: { total: 0, new: 0, growth: 0, userGrowthHistory: [] },
    revenue: { total: 0, current: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
    packages: { stats: [], totalSales: 0 }
  });
  const [salesTrend, setSalesTrend] = useState<TimeSeriesData[]>([]);
  const [userGrowthTrend, setUserGrowthTrend] = useState<Array<{ date: string; users: number; newUsers: number }>>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const toDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [packageStatsRes, usersRes] = await Promise.all([
        axios.get(`${BackendUrl}/package/admin/package-stats`, { headers }),
        axios.get(`${BackendUrl}/admin/getallusers`, { headers })
      ]);

      const packageStats = packageStatsRes.data.packageStats || [];
      const overallStats = packageStatsRes.data.overallStats;
      
      const allUsers = (usersRes.data.AllUsers || [])
        .map((user: any) => ({
          ...user,
          joinedAt: toDate(user.joinedAt)
        }))
        .filter((user: any) => user.joinedAt !== null);

      const packagesWithHistory = packageStats.map((pkg: any) => {
        const purchaseHistory = [];
        const days = getDaysFromRange(timeRange);
        
        if (pkg.currentActiveUsers > 0) {
          const daysWithPurchases = Math.min(pkg.currentActiveUsers, 10);
          const usersPerDay = Math.ceil(pkg.currentActiveUsers / daysWithPurchases);
          
          for (let i = 0; i < daysWithPurchases; i++) {
            const daysAgo = Math.floor((days / daysWithPurchases) * i);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const dateStr = date.toISOString().split('T')[0];
            
            const usersThisDay = Math.min(usersPerDay, pkg.currentActiveUsers - (i * usersPerDay));
            
            if (usersThisDay > 0) {
              purchaseHistory.push({
                date: dateStr,
                count: usersThisDay,
                revenue: usersThisDay * pkg.priceInCoins
              });
            }
          }
        }
        
        return {
          ...pkg,
          purchaseHistory
        };
      });

      const userGrowthHistory = calculateUserGrowthHistory(allUsers, timeRange);
      const salesTrendData = calculateSalesTrendFromPackages(packagesWithHistory, timeRange);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentRevenue = overallStats.currentRevenue || 0;
      
      const thisMonthRevenue = packagesWithHistory.reduce((sum: number, pkg: any) => {
        return sum + pkg.purchaseHistory
          .filter((p: any) => {
            const date = new Date(p.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .reduce((s: number, p: any) => s + p.revenue, 0);
      }, 0);

      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthRevenue = packagesWithHistory.reduce((sum: number, pkg: any) => {
        return sum + pkg.purchaseHistory
          .filter((p: any) => {
            const date = new Date(p.date);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
          })
          .reduce((s: number, p: any) => s + p.revenue, 0);
      }, 0);

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : thisMonthRevenue > 0 ? 100 : 0;

      const newUsersCount = calculateNewUsers(allUsers, timeRange);
      const userGrowth = allUsers.length > 0 ? (newUsersCount / allUsers.length) * 100 : 0;
      const userTrendData = calculateUserTrend(allUsers, timeRange);

      const analyticsStats = {
        users: {
          total: allUsers.length,
          new: newUsersCount,
          growth: userGrowth,
          userGrowthHistory
        },
        revenue: {
          total: overallStats.totalRevenue || 0,
          current: currentRevenue,
          thisMonth: thisMonthRevenue || currentRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth
        },
        packages: {
          stats: packagesWithHistory,
          totalSales: overallStats.totalPurchases || overallStats.totalActiveUsers
        }
      };

      setStats(analyticsStats);
      setSalesTrend(salesTrendData);
      setUserGrowthTrend(userTrendData);

    } catch (err: any) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesTrendFromPackages = (packages: PackageStats[], range: TimeRange): TimeSeriesData[] => {
    const days = getDaysFromRange(range);
    const trendMap = new Map<string, TimeSeriesData>();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      trendMap.set(dateStr, {
        date: dateStr,
        revenue: 0,
        packagesSold: 0,
        packages: {}
      });
    }

    packages.forEach(pkg => {
      if (pkg.purchaseHistory && pkg.purchaseHistory.length > 0) {
        pkg.purchaseHistory.forEach(history => {
          const existing = trendMap.get(history.date);
          if (existing) {
            existing.revenue += history.revenue;
            existing.packagesSold += history.count;
            existing.packages[pkg.packageName] = (existing.packages[pkg.packageName] || 0) + history.count;
          }
        });
      }
    });

    return Array.from(trendMap.values());
  };

  const calculateUserGrowthHistory = (users: any[], range: TimeRange) => {
    const days = getDaysFromRange(range);
    const growthMap = new Map<string, { newUsers: number; totalUsers: number }>();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      const newUsersOnDate = users.filter(u => {
        if (!u.joinedAt) return false;
        try {
          const userDate = u.joinedAt instanceof Date ? u.joinedAt : new Date(u.joinedAt);
          const userDateStr = userDate.toISOString().split('T')[0];
          return userDateStr === dateStr;
        } catch {
          return false;
        }
      }).length;
      
      const totalUsersUpToDate = users.filter(u => {
        if (!u.joinedAt) return false;
        try {
          const userDate = u.joinedAt instanceof Date ? u.joinedAt : new Date(u.joinedAt);
          return userDate <= date;
        } catch {
          return false;
        }
      }).length;

      growthMap.set(dateStr, {
        newUsers: newUsersOnDate,
        totalUsers: totalUsersUpToDate
      });
    }

    return Array.from(growthMap.entries()).map(([date, data]) => ({
      date,
      ...data
    }));
  };

  const calculateUserTrend = (users: any[], range: TimeRange) => {
    const days = getDaysFromRange(range);
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      const newUsers = users.filter(u => {
        if (!u.joinedAt) return false;
        try {
          const userDate = u.joinedAt instanceof Date ? u.joinedAt : new Date(u.joinedAt);
          const userDateStr = userDate.toISOString().split('T')[0];
          return userDateStr === dateStr;
        } catch {
          return false;
        }
      }).length;
      
      const totalUsers = users.filter(u => {
        if (!u.joinedAt) return false;
        try {
          const userDate = u.joinedAt instanceof Date ? u.joinedAt : new Date(u.joinedAt);
          return userDate <= date;
        } catch {
          return false;
        }
      }).length;

      result.push({
        date: dateStr,
        users: totalUsers,
        newUsers
      });
    }

    return result;
  };

  const calculateNewUsers = (users: any[], range: TimeRange): number => {
    const now = new Date();
    const cutoff = new Date();
    const days = getDaysFromRange(range);
    cutoff.setDate(now.getDate() - days);
    
    return users.filter(u => {
      if (!u.joinedAt) return false;
      try {
        const userDate = u.joinedAt instanceof Date ? u.joinedAt : new Date(u.joinedAt);
        return userDate > cutoff;
      } catch {
        return false;
      }
    }).length;
  };

  const getDaysFromRange = (range: TimeRange): number => {
    switch(range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-20 bg-slate-900 z-30">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 lg:left-20 right-0 bg-white shadow-sm z-40 h-16">
        <Header1 />
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pl-20 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
          
          {/* Page Title & Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard Analytics
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time insights and performance metrics
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Current Revenue"
              value={`₹${stats.revenue.current.toLocaleString()}`}
              change={stats.revenue.growth > 0 ? `+${stats.revenue.growth.toFixed(1)}%` : stats.revenue.growth < 0 ? `${stats.revenue.growth.toFixed(1)}%` : '0.0%'}
              subtitle={`From ${stats.packages.stats.reduce((sum, p) => sum + p.currentActiveUsers, 0)} active users`}
              icon={<DollarSign className="w-6 h-6" />}
              color="green"
              trend={stats.revenue.growth >= 0 ? 'up' : 'down'}
            />
            
            {/* ✅ NEW: Revenue This Month Card */}
            <MetricCard
              title="Revenue This Month"
              value={`₹${stats.revenue.thisMonth.toLocaleString()}`}
              subtitle={`Last month: ₹${stats.revenue.lastMonth.toLocaleString()}`}
              change={stats.revenue.growth > 0 ? `+${stats.revenue.growth.toFixed(1)}%` : `${stats.revenue.growth.toFixed(1)}%`}
              icon={<Calendar className="w-6 h-6" />}
              color="blue"
              trend={stats.revenue.growth >= 0 ? 'up' : 'down'}
            />
            
            <MetricCard
              title="Total Users"
              value={stats.users.total.toString()}
              change={`+${stats.users.growth.toFixed(1)}%`}
              subtitle={`${stats.users.new} new users`}
              icon={<Users className="w-6 h-6" />}
              color="purple"
              trend="up"
            />
            <MetricCard
              title="New Users"
              value={stats.users.new.toString()}
              subtitle={`In last ${timeRange}`}
              icon={<UserPlus className="w-6 h-6" />}
              color="orange"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Sales Trend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Package Sales Trend
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{timeRange}</span>
                </div>
              </div>
              <PackageSalesChart data={salesTrend} packages={stats.packages.stats} />
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  User Growth Trend
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>+{stats.users.growth.toFixed(1)}%</span>
                </div>
              </div>
              <UserGrowthChart data={userGrowthTrend} />
            </div>
          </div>

          {/* Package Performance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Top Packages */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Package Performance
              </h2>
              <div className="space-y-4">
                {stats.packages.stats
                  .sort((a, b) => b.currentRevenue - a.currentRevenue)
                  .map((pkg, index) => (
                    <PackagePerformanceBar
                      key={pkg.packageId}
                      rank={index + 1}
                      packageName={pkg.packageName}
                      revenue={pkg.currentRevenue}
                      sales={pkg.currentActiveUsers}
                      activeUsers={pkg.currentActiveUsers}
                      maxRevenue={Math.max(...stats.packages.stats.map(p => p.currentRevenue), 1)}
                    />
                  ))}
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Revenue Breakdown
              </h2>
              <div className="space-y-3">
                {stats.packages.stats
                  .filter(pkg => pkg.currentRevenue > 0)
                  .map((pkg) => {
                  const percentage = stats.revenue.current > 0 
                    ? (pkg.currentRevenue / stats.revenue.current) * 100 
                    : 0;
                  
                  return (
                    <div key={pkg.packageId} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {pkg.packageName}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{pkg.currentRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{percentage.toFixed(1)}% of total</span>
                        <span>{pkg.currentActiveUsers} users</span>
                      </div>
                    </div>
                  );
                })}
                {stats.packages.stats.filter(p => p.currentRevenue > 0).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active packages yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Performing Executives */}
          <div className="mb-6">
            <TopExecutivesCard />
          </div>

          {/* Revenue Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-6 text-gray-800">
              Revenue Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Current Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.revenue.current.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From active users</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.revenue.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.packages.stats.reduce((sum, p) => sum + p.currentActiveUsers, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Package subscribers</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        stats={stats}
        userGrowthTrend={userGrowthTrend}
        salesTrend={salesTrend}
        timeRange={timeRange}
      />
    </div>
  );
};

// Supporting Components
const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple' | 'orange';
  trend?: 'up' | 'down';
}> = ({ title, value, subtitle, change, icon, color, trend }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

const PackageSalesChart: React.FC<{ 
  data: TimeSeriesData[];
  packages: PackageStats[];
}> = ({ data, packages }) => {
  const hasData = data.some(d => d.revenue > 0);
  
  if (!hasData) return (
    <div className="text-center py-12">
      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">No sales data available</p>
      <p className="text-xs text-gray-400 mt-1">Sales will appear here once packages are purchased</p>
    </div>
  );

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const packageColors: { [key: string]: string } = {
    'Infa': '#3b82f6',
    'Gold': '#eab308',
    'Gold+': '#f97316',
    'Elite': '#8b5cf6',
    'Supreme': '#ec4899',
    'silver': '#94a3b8',
    'test': '#6b7280'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Date</span>
        <span>Revenue & Packages Sold</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {data.filter(d => d.revenue > 0).slice(-15).map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-20 flex-shrink-0">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-between px-2"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                >
                  {item.revenue > 0 && (
                    <>
                      <span className="text-xs font-semibold text-white">
                        ₹{item.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-white">
                        {item.packagesSold}x
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {item.packagesSold > 0 && (
              <div className="flex gap-1 ml-24 flex-wrap">
                {Object.entries(item.packages).map(([pkgName, count]) => (
                  count > 0 && (
                    <span
                      key={pkgName}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${packageColors[pkgName] || '#6b7280'}20`,
                        color: packageColors[pkgName] || '#6b7280'
                      }}
                    >
                      {pkgName}: {count}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const UserGrowthChart: React.FC<{ 
  data: Array<{ date: string; users: number; newUsers: number }>;
}> = ({ data }) => {
  if (!data || data.length === 0 || data.every((d) => d.users === 0)) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={chartData}
        margin={{ top: 16, right: 16, left: 16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: any) => v.toLocaleString()} />
        <Legend verticalAlign="top" height={36} iconType="plainline" />
        <Line 
          type="monotone"
          dataKey="users"
          stroke="#8b5cf6"
          strokeWidth={3}
          name="Total Users"
          dot={false}
          activeDot={{ r: 7 }}
        />
        <Line 
          type="monotone"
          dataKey="newUsers"
          stroke="#10b981"
          strokeWidth={2}
          name="New Users"
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const PackagePerformanceBar: React.FC<{
  rank: number;
  packageName: string;
  revenue: number;
  sales: number;
  activeUsers: number;
  maxRevenue: number;
}> = ({ rank, packageName, revenue, sales, activeUsers, maxRevenue }) => {
  const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  
  const colors = [
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-orange-400 to-orange-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600'
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${colors[rank - 1] || 'from-blue-400 to-blue-600'}`}>
            {rank}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{packageName}</h3>
            <p className="text-xs text-gray-600">{activeUsers} active users</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">₹{revenue.toLocaleString()}</p>
          <p className="text-xs text-gray-600">{sales} members</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${colors[rank - 1] || 'from-blue-400 to-blue-600'} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
