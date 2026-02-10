// components/adminComponents/export/ExportModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, Download, FileSpreadsheet, CheckCircle, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { BackendUrl } from '@/Config';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: any;
  userGrowthTrend: Array<{ date: string; users: number; newUsers: number }>;
  salesTrend: any[];
  timeRange: string;
}

interface ExecutiveReferralData {
  executiveName: string;
  executiveEmail: string;
  referralCode: string;
  totalReferrals: number;
  referralsInPeriod: number;
  totalRevenue: number;
  revenueInPeriod: number;
  users: Array<{
    name: string;
    email: string;
    package: string;
    coins: number;
    joinedDate: string;
  }>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  userGrowthTrend,
  salesTrend,
  timeRange
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case '1y': return 'Last Year';
      default: return timeRange;
    }
  };

  const getDaysFromRange = (): number => {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  };

  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const fetchExecutiveName = async (refCode: string): Promise<string> => {
    if (!refCode) return 'No Referral';
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/admin/executive/${refCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.executiveName || 'Unknown Executive';
    } catch {
      return 'Unknown Executive';
    }
  };

  const getExecutiveReferralData = async (allUsers: any[]): Promise<ExecutiveReferralData[]> => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - getDaysFromRange());

    const executiveMap = new Map<string, any[]>();
    
    for (const user of allUsers) {
      if (user.executiveRefode) {
        if (!executiveMap.has(user.executiveRefode)) {
          executiveMap.set(user.executiveRefode, []);
        }
        executiveMap.get(user.executiveRefode)!.push(user);
      }
    }

    const executiveData: ExecutiveReferralData[] = [];

    for (const [refCode, users] of executiveMap.entries()) {
      try {
        const token = localStorage.getItem('token');
        
        const execResponse = await axios.get(`${BackendUrl}/admin/executive/${refCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const executiveName = execResponse.data.executiveName || 'Unknown';
        const executiveEmail = execResponse.data.executiveEmail || 'N/A';

        const usersInPeriod = users.filter(u => {
          const joinDate = new Date(u.joinedAt);
          return joinDate >= cutoffDate;
        });

        const totalRevenue = users.reduce((sum, u) => sum + (u.coins || 0), 0);
        const revenueInPeriod = usersInPeriod.reduce((sum, u) => sum + (u.coins || 0), 0);

        executiveData.push({
          executiveName,
          executiveEmail,
          referralCode: refCode,
          totalReferrals: users.length,
          referralsInPeriod: usersInPeriod.length,
          totalRevenue,
          revenueInPeriod,
          users: users.map(u => ({
            name: u.name,
            email: u.email,
            package: u.packageName || 'None',
            coins: u.coins,
            joinedDate: u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'
          }))
        });
      } catch (error) {
        console.error(`Error fetching executive ${refCode}:`, error);
      }
    }

    return executiveData.sort((a, b) => b.referralsInPeriod - a.referralsInPeriod);
  };

  const exportComprehensiveData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all users
      const usersResponse = await axios.get(`${BackendUrl}/admin/getallusers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allUsers = usersResponse.data.AllUsers || [];
      
      // Get executive referral data
      const executiveData = await getExecutiveReferralData(allUsers);
      
      // Fetch executive names for individual users
      const usersWithExecutives = await Promise.all(
        allUsers.map(async (user: any) => {
          const executiveName = user.executiveRefode 
            ? await fetchExecutiveName(user.executiveRefode)
            : 'No Referral';
          return { ...user, executiveName };
        })
      );

      let csv = '';
      
      // ========== HEADER ==========
      csv += `FINITE MARSHALL CLUB - Comprehensive Analytics Report\n`;
      csv += `Generated: ${new Date().toLocaleString()}\n`;
      csv += `Report Period: ${getTimeRangeLabel()}\n`;
      csv += `\n\n`;

      // ========== SUMMARY METRICS ==========
      csv += `EXECUTIVE SUMMARY\n`;
      csv += `Metric,Value\n`;
      csv += `Total Revenue (All Time),₹${stats.revenue.total.toLocaleString()}\n`;
      csv += `Current Revenue,₹${stats.revenue.current.toLocaleString()}\n`;
      csv += `Revenue This Month,₹${stats.revenue.thisMonth.toLocaleString()}\n`;
      csv += `Revenue Last Month,₹${stats.revenue.lastMonth.toLocaleString()}\n`;
      csv += `Revenue Growth,${stats.revenue.growth.toFixed(2)}%\n`;
      csv += `Total Users,${stats.users.total}\n`;
      csv += `New Users (${getTimeRangeLabel()}),${stats.users.new}\n`;
      csv += `User Growth,${stats.users.growth.toFixed(2)}%\n`;
      csv += `Active Subscribers,${stats.packages.stats.reduce((sum: number, p: any) => sum + p.currentActiveUsers, 0)}\n`;
      csv += `Total Executives,${executiveData.length}\n`;
      csv += `\n\n`;

      // ========== EXECUTIVE PERFORMANCE ==========
      csv += `EXECUTIVE REFERRAL PERFORMANCE (${getTimeRangeLabel()})\n`;
      csv += `Rank,Executive Name,Email,Referral Code,Total Referrals (All Time),Referrals in Period,Total Revenue (₹),Revenue in Period (₹),Avg Revenue per User\n`;
      
      executiveData.forEach((exec, index) => {
        const avgRevenue = exec.totalReferrals > 0 ? (exec.totalRevenue / exec.totalReferrals).toFixed(2) : '0';
        csv += `${index + 1},${escapeCSV(exec.executiveName)},${escapeCSV(exec.executiveEmail)},${exec.referralCode},${exec.totalReferrals},${exec.referralsInPeriod},${exec.totalRevenue},${exec.revenueInPeriod},${avgRevenue}\n`;
      });
      csv += `\n\n`;

      // ========== DETAILED EXECUTIVE REFERRALS ==========
      csv += `DETAILED EXECUTIVE REFERRAL BREAKDOWN\n\n`;
      
      executiveData.forEach((exec) => {
        csv += `Executive: ${exec.executiveName} (${exec.referralCode})\n`;
        csv += `Email: ${exec.executiveEmail}\n`;
        csv += `Total Referrals: ${exec.totalReferrals} | Referrals in ${getTimeRangeLabel()}: ${exec.referralsInPeriod}\n`;
        csv += `Total Revenue: ₹${exec.totalRevenue.toLocaleString()} | Revenue in Period: ₹${exec.revenueInPeriod.toLocaleString()}\n\n`;
        
        csv += `User Name,Email,Package,Coins,Joined Date\n`;
        exec.users.forEach((user) => {
          csv += `${escapeCSV(user.name)},${escapeCSV(user.email)},${escapeCSV(user.package)},${user.coins},${user.joinedDate}\n`;
        });
        csv += `\n\n`;
      });

      // ========== PACKAGE PERFORMANCE ==========
      csv += `PACKAGE PERFORMANCE\n`;
      csv += `Rank,Package Name,Price (₹),Active Users,Total Purchases,Current Revenue (₹),Total Revenue (₹),% of Total\n`;
      
      const sortedPackages = [...stats.packages.stats].sort((a: any, b: any) => b.currentRevenue - a.currentRevenue);
      sortedPackages.forEach((pkg: any, index: number) => {
        const revenuePercentage = stats.revenue.current > 0 
          ? ((pkg.currentRevenue / stats.revenue.current) * 100).toFixed(2)
          : '0.00';
        
        csv += `${index + 1},${escapeCSV(pkg.packageName)},${pkg.priceInCoins},${pkg.currentActiveUsers},${pkg.totalPurchases},${pkg.currentRevenue},${pkg.totalRevenue},${revenuePercentage}%\n`;
      });
      csv += `\n\n`;

      // ========== USER GROWTH TREND ==========
      csv += `USER GROWTH TREND (${getTimeRangeLabel()})\n`;
      csv += `Date,Total Users,New Users\n`;
      userGrowthTrend.forEach((item) => {
        csv += `${item.date},${item.users},${item.newUsers}\n`;
      });
      csv += `\n\n`;

      // ========== SALES TREND ==========
      csv += `PACKAGE SALES TREND (${getTimeRangeLabel()})\n`;
      csv += `Date,Total Revenue (₹),Packages Sold\n`;
      salesTrend.forEach((item) => {
        csv += `${item.date},${item.revenue},${item.packagesSold}\n`;
      });
      csv += `\n\n`;

      // ========== ALL USERS DETAILED ==========
      csv += `ALL USERS DETAILED LIST\n`;
      csv += `Name,Email,Package,Coins,Referred By Executive,Joined Date,Status\n`;
      
      usersWithExecutives.forEach((user: any) => {
        csv += `${escapeCSV(user.name)},${escapeCSV(user.email)},${escapeCSV(user.packageName || 'None')},${user.coins || 0},${escapeCSV(user.executiveName)},${user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'},${user.role || 'USER'}\n`;
      });

      // ✅ CREATE BLOB & CALCULATE FILE SIZE
      const fileName = `FMC-Analytics-${getTimeRangeLabel().replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const fileSize = blob.size;

      // ✅ LOG EXPORT TO BACKEND (async, non-blocking)
      axios.post(
        `${BackendUrl}/export-logs/log`,
        {
          entity: 'Analytics',
          fileName,
          recordCount: allUsers.length + stats.packages.stats.length + executiveData.length,
          fileSize,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => {
        console.error('Failed to log export:', err);
        // Don't block download if logging fails
      });

      // ✅ DOWNLOAD CSV
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Analytics exported successfully!');
      onClose();

    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Analytics</h2>
              <p className="text-sm text-gray-600">Download comprehensive report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Report includes:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Executive summary & KPIs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Executive performance & referrals
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Package performance metrics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                User growth & sales trends
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Complete user list with details
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span>
              Period: <strong>{getTimeRangeLabel()}</strong>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={exportComprehensiveData}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
