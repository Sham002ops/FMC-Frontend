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

    // Group users by executive referral code
    const executiveMap = new Map<string, any[]>();
    
    for (const user of allUsers) {
      if (user.executiveRefode) {
        if (!executiveMap.has(user.executiveRefode)) {
          executiveMap.set(user.executiveRefode, []);
        }
        executiveMap.get(user.executiveRefode)!.push(user);
      }
    }

    // Fetch executive details and calculate stats
    const executiveData: ExecutiveReferralData[] = [];

    for (const [refCode, users] of executiveMap.entries()) {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch executive info
        const execResponse = await axios.get(`${BackendUrl}/admin/executive/${refCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const executiveName = execResponse.data.executiveName || 'Unknown';
        const executiveEmail = execResponse.data.executiveEmail || 'N/A';

        // Filter users in selected period
        const usersInPeriod = users.filter(u => {
          const joinDate = new Date(u.joinedAt);
          return joinDate >= cutoffDate;
        });

        // Calculate revenue
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

    // Sort by referrals in period (descending)
    return executiveData.sort((a, b) => b.referralsInPeriod - a.referralsInPeriod);
  };

  const exportComprehensiveData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all users
      const usersResponse = await axios.get(`${BackendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allUsers = usersResponse.data.users || [];
      
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

      // ========== EXECUTIVE PERFORMANCE (FILTERED) ==========
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
      csv += `Date,Total Users,New Users,Growth %\n`;
      
      userGrowthTrend.forEach((item, index) => {
        const growthPercent = index > 0 && userGrowthTrend[0].users > 0
          ? (((item.users - userGrowthTrend[0].users) / userGrowthTrend[0].users) * 100).toFixed(2)
          : '0.00';
        
        csv += `${item.date},${item.users},${item.newUsers},${growthPercent}%\n`;
      });
      csv += `\n\n`;

      // ========== SALES TREND ==========
      csv += `SALES TREND (${getTimeRangeLabel()})\n`;
      csv += `Date,Revenue (₹),Packages Sold,Package Details\n`;
      
      const filteredSales = salesTrend.filter(item => item.revenue > 0 || item.packagesSold > 0);
      filteredSales.forEach((item) => {
        const packageBreakdown = Object.entries(item.packages)
          .filter(([_, count]) => count > 0)
          .map(([name, count]) => `${name}: ${count}`)
          .join('; ');
        
        csv += `${item.date},${item.revenue},${item.packagesSold},"${packageBreakdown || 'None'}"\n`;
      });
      csv += `\n\n`;

      // ========== ALL USERS LIST ==========
      csv += `COMPLETE USER LIST\n`;
      csv += `#,Name,Email,Phone,Date of Birth,Address,PIN,Role,Package,Coins,Executive Ref,Executive Name,Status,Joined\n`;
      
      usersWithExecutives.forEach((user: any, index: number) => {
        csv += `${index + 1},${escapeCSV(user.name)},${escapeCSV(user.email)},${escapeCSV(user.number || 'N/A')},${escapeCSV(user.dateOfBirth || 'N/A')},${escapeCSV(user.address || 'N/A')},${escapeCSV(user.pinCode || 'N/A')},${user.role},${escapeCSV(user.packageName || 'None')},${user.coins},${escapeCSV(user.executiveRefode || 'N/A')},${escapeCSV(user.executiveName)},${user.isBanned ? 'Banned' : 'Active'},${user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}\n`;
      });
      csv += `\n\n`;

      // ========== FOOTER ==========
      csv += `\nReport Generated by FMC Admin Dashboard\n`;
      csv += `Contact: admin@finitemarshallclub.com\n`;

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FMC_Comprehensive_${getTimeRangeLabel().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Complete analytics exported for ${getTimeRangeLabel()}!`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportQuickSummary = () => {
    let csv = `FMC Quick Summary - ${getTimeRangeLabel()}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += `Metric,Value\n`;
    csv += `Current Revenue,₹${stats.revenue.current.toLocaleString()}\n`;
    csv += `Revenue This Month,₹${stats.revenue.thisMonth.toLocaleString()}\n`;
    csv += `Total Users,${stats.users.total}\n`;
    csv += `New Users,${stats.users.new}\n`;
    csv += `Active Subscribers,${stats.packages.stats.reduce((sum: number, p: any) => sum + p.currentActiveUsers, 0)}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FMC_Summary_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('Quick summary exported!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Export Analytics</h2>
              <p className="text-blue-100 text-sm">Comprehensive report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Filtered Export</p>
                <p className="text-xs text-blue-700 mt-1">
                  Period: <strong>{getTimeRangeLabel()}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportComprehensiveData}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Comprehensive Report</p>
                  <p className="text-xs text-blue-100">
                    All metrics + Executive referrals
                  </p>
                </div>
              </div>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              )}
            </button>

            <button
              onClick={exportQuickSummary}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Quick Summary</p>
                  <p className="text-xs text-gray-600">Key metrics only</p>
                </div>
              </div>
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p className="font-semibold mb-2">📊 Export includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Revenue metrics & growth trends</li>
              <li>Executive performance by referrals</li>
              <li>Detailed referral breakdown per executive</li>
              <li>Package sales & user distribution</li>
              <li>Complete user list with contacts</li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
