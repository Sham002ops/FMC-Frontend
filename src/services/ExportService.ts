import * as XLSX from 'xlsx';
import axios from 'axios';
import { BackendUrl } from '@/Config';

interface ExportOptions {
  timeRange?: string;
  stats: any;
  userGrowthTrend: any[];
  salesTrend: any[];
}

export class ExportService {
  private static async fetchAllData(token: string) {
    const headers = { Authorization: `Bearer ${token}` };
    
    const [usersRes, executivesRes, packagesRes] = await Promise.all([
      axios.get(`${BackendUrl}/admin/getallusers`, { headers }),
      axios.get(`${BackendUrl}/executive/get-executives`, { headers }),
      axios.get(`${BackendUrl}/package/admin/package-stats`, { headers }), // Get package prices
    ]);

    return {
      allUsers: usersRes.data.AllUsers || [],
      allExecutives: executivesRes.data || [],
      packageStats: packagesRes.data.packageStats || [],
    };
  }

  private static filterByMonth(items: any[], dateField: string = 'createdAt') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return items.filter((item: any) => {
      const date = new Date(item[dateField] || item.joinedAt);
      return date >= startOfMonth && date <= endOfMonth;
    });
  }

  private static getExecutiveName(executiveRefCode: string | null, executives: any[]): string {
    if (!executiveRefCode) return 'Direct Registration';
    const executive = executives.find((e: any) => e.referralCode === executiveRefCode);
    return executive ? executive.name : 'Unknown Executive';
  }

  private static getPackagePrice(packageName: string | null, packageStats: any[]): number {
    if (!packageName) return 0;
    const pkg = packageStats.find((p: any) => p.packageName === packageName);
    return pkg ? pkg.priceInCoins : 0;
  }

  private static createMonthlyReportSheet(data: any) {
    const { thisMonthUsers, allExecutives, packageStats, monthRevenue } = data;
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const reportData = [
      [`MONTHLY REGISTRATION REPORT - ${monthName}`],
      ['Generated on:', now.toLocaleString()],
      [''],
      ['MONTHLY SUMMARY'],
      [''],
      ['Total New Users This Month:', thisMonthUsers.length],
      ['Total Revenue Generated:', `₹${monthRevenue.toLocaleString()}`],
      ['Average Revenue per User:', thisMonthUsers.length > 0 ? `₹${Math.round(monthRevenue / thisMonthUsers.length).toLocaleString()}` : '₹0'],
      [''],
      ['NEW USERS DETAIL'],
      [''],
      ['#', 'User Name', 'Email', 'Package', 'Package Price', 'Executive Name', 'Registration Date', 'Registration Time'],
    ];

    // Add user details
    thisMonthUsers.forEach((user: any, index: number) => {
      const executiveName = this.getExecutiveName(user.executiveRefode, allExecutives);
      const packagePrice = this.getPackagePrice(user.packageName, packageStats);
      const regDate = new Date(user.createdAt || user.joinedAt);

      reportData.push([
        index + 1,
        user.name,
        user.email,
        user.packageName || 'No Package',
        `₹${packagePrice.toLocaleString()}`,
        executiveName,
        regDate.toLocaleDateString(),
        regDate.toLocaleTimeString(),
      ]);
    });

    // Add package-wise breakdown
    reportData.push(['']);
    reportData.push(['PACKAGE-WISE BREAKDOWN']);
    reportData.push(['']);
    reportData.push(['Package Name', 'Users', 'Price per User', 'Total Revenue']);

    const packageBreakdown = this.calculatePackageBreakdown(thisMonthUsers, packageStats);
    packageBreakdown.forEach((pkg: any) => {
      reportData.push([
        pkg.name,
        pkg.count,
        `₹${pkg.price.toLocaleString()}`,
        `₹${pkg.revenue.toLocaleString()}`,
      ]);
    });

    // Add executive-wise breakdown
    reportData.push(['']);
    reportData.push(['EXECUTIVE-WISE BREAKDOWN']);
    reportData.push(['']);
    reportData.push(['Executive Name', 'Users Referred', 'Total Revenue Generated', 'Average per User']);

    const executiveBreakdown = this.calculateExecutiveBreakdown(thisMonthUsers, allExecutives, packageStats);
    executiveBreakdown.forEach((exec: any) => {
      reportData.push([
        exec.name,
        exec.count,
        `₹${exec.revenue.toLocaleString()}`,
        `₹${exec.avgRevenue.toLocaleString()}`,
      ]);
    });

    return reportData;
  }

  private static calculatePackageBreakdown(users: any[], packageStats: any[]) {
    const breakdown: { [key: string]: { name: string; count: number; price: number; revenue: number } } = {};

    users.forEach((user: any) => {
      const packageName = user.packageName || 'No Package';
      if (!breakdown[packageName]) {
        const price = this.getPackagePrice(user.packageName, packageStats);
        breakdown[packageName] = {
          name: packageName,
          count: 0,
          price: price,
          revenue: 0,
        };
      }
      breakdown[packageName].count++;
      breakdown[packageName].revenue += breakdown[packageName].price;
    });

    return Object.values(breakdown).sort((a, b) => b.revenue - a.revenue);
  }

  private static calculateExecutiveBreakdown(users: any[], executives: any[], packageStats: any[]) {
    const breakdown: { [key: string]: { name: string; count: number; revenue: number } } = {};

    users.forEach((user: any) => {
      const executiveName = this.getExecutiveName(user.executiveRefode, executives);
      if (!breakdown[executiveName]) {
        breakdown[executiveName] = {
          name: executiveName,
          count: 0,
          revenue: 0,
        };
      }
      breakdown[executiveName].count++;
      const packagePrice = this.getPackagePrice(user.packageName, packageStats);
      breakdown[executiveName].revenue += packagePrice;
    });

    return Object.values(breakdown)
      .map(exec => ({
        ...exec,
        avgRevenue: exec.count > 0 ? Math.round(exec.revenue / exec.count) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private static createSummarySheet(data: any) {
    const { stats, thisMonth, totals, monthRevenue } = data;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const summaryData = [
      ['FINITE MARSHALL CLUB - ANALYTICS REPORT'],
      ['Generated on:', now.toLocaleString()],
      ['Report Period:', `${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`],
      [''],
      ['EXECUTIVE SUMMARY'],
      [''],
      ['Metric', 'This Month', 'Total', 'Growth %'],
      ['Total Users', thisMonth.users, totals.users, `${stats.users.growth.toFixed(1)}%`],
      ['Total Executives', thisMonth.executives, totals.executives, '-'],
      ['Total Mentors', thisMonth.mentors, totals.mentors, '-'],
      ['Total Admins', '-', totals.admins, '-'],
      [''],
      ['REVENUE SUMMARY'],
      [''],
      ['Metric', 'Amount', 'Growth %'],
      ['Total Revenue (All Time)', `₹${stats.revenue.total.toLocaleString()}`, '-'],
      ['Current Active Revenue', `₹${stats.revenue.current.toLocaleString()}`, '-'],
      ['This Month Revenue', `₹${monthRevenue.toLocaleString()}`, `${stats.revenue.growth.toFixed(1)}%`],
      ['Last Month Revenue', `₹${stats.revenue.lastMonth.toLocaleString()}`, '-'],
      ['Revenue Growth', `₹${(monthRevenue - stats.revenue.lastMonth).toLocaleString()}`, '-'],
      [''],
      ['PACKAGE PERFORMANCE'],
      [''],
      ['Package Name', 'Active Users', 'Revenue', 'Price per User'],
    ];

    stats.packages.stats.forEach((pkg: any) => {
      summaryData.push([
        pkg.packageName,
        pkg.currentActiveUsers,
        `₹${pkg.currentRevenue.toLocaleString()}`,
        `₹${pkg.priceInCoins.toLocaleString()}`
      ]);
    });

    return summaryData;
  }

  static async generateDetailedReport(options: ExportOptions): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Fetch all data
      const { allUsers, allExecutives, packageStats } = await this.fetchAllData(token);

      // Separate by role
      const regularUsers = allUsers.filter((u: any) => u.role === 'USER');
      const mentors = allUsers.filter((u: any) => u.role === 'Mentor');
      const admins = allUsers.filter((u: any) => u.role === 'ADMIN');

      // Filter this month's data
      const thisMonthUsers = this.filterByMonth(regularUsers);
      const thisMonthExecutives = this.filterByMonth(allExecutives, 'joinedAt');
      const thisMonthMentors = this.filterByMonth(mentors);

      // Calculate this month's revenue
      const monthRevenue = thisMonthUsers.reduce((sum: number, user: any) => {
        return sum + this.getPackagePrice(user.packageName, packageStats);
      }, 0);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add Monthly Report Sheet (NEW - First Sheet)
      const monthlyReportData = this.createMonthlyReportSheet({
        thisMonthUsers,
        allExecutives,
        packageStats,
        monthRevenue,
      });

      const monthlyReportSheet = XLSX.utils.aoa_to_sheet(monthlyReportData);
      monthlyReportSheet['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, monthlyReportSheet, 'Monthly Report');

      // Add Executive Summary
      const summaryData = this.createSummarySheet({
        stats: options.stats,
        thisMonth: {
          users: thisMonthUsers.length,
          executives: thisMonthExecutives.length,
          mentors: thisMonthMentors.length,
        },
        totals: {
          users: regularUsers.length,
          executives: allExecutives.length,
          mentors: mentors.length,
          admins: admins.length,
        },
        monthRevenue,
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

      // Add other sheets
      this.addUsersSheet(workbook, thisMonthUsers, allExecutives, packageStats, 'Users This Month');
      this.addUsersSheet(workbook, regularUsers, allExecutives, packageStats, 'All Users');
      this.addExecutivesSheet(workbook, thisMonthExecutives, 'Executives This Month');
      this.addExecutivesSheet(workbook, allExecutives, 'All Executives');
      this.addMentorsSheet(workbook, thisMonthMentors, 'Mentors This Month');
      this.addMentorsSheet(workbook, mentors, 'All Mentors');
      this.addPackageDistributionSheet(workbook, options.stats.packages.stats);
      this.addUserGrowthSheet(workbook, options.userGrowthTrend);
      this.addRevenueTrendSheet(workbook, options.salesTrend);

      // Generate filename and save
      const fileName = `FMC_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      return Promise.resolve();
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  private static addUsersSheet(
    workbook: XLSX.WorkBook, 
    users: any[], 
    executives: any[], 
    packageStats: any[], 
    sheetName: string
  ) {
    const data = users.map((user: any) => ({
      'Name': user.name,
      'Email': user.email,
      'Package': user.packageName || 'None',
      'Package Price': `₹${this.getPackagePrice(user.packageName, packageStats).toLocaleString()}`,
      'Coins': user.coins || 0,
      'Role': user.role,
      'Executive Name': this.getExecutiveName(user.executiveRefode, executives),
      'Executive Ref Code': user.executiveRefode || 'Direct',
      'Joined Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      'Status': user.isBanned ? 'Banned' : 'Active',
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
      { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 12 }
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  private static addExecutivesSheet(workbook: XLSX.WorkBook, executives: any[], sheetName: string) {
    const data = executives.map((exec: any) => ({
      'Name': exec.name,
      'Email': exec.email,
      'Referral Code': exec.referralCode,
      'Joined Date': exec.joinedAt ? new Date(exec.joinedAt).toLocaleDateString() : 'N/A',
      'Status': exec.isBanned ? 'Banned' : 'Active',
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  private static addMentorsSheet(workbook: XLSX.WorkBook, mentors: any[], sheetName: string) {
    const data = mentors.map((mentor: any) => ({
      'Name': mentor.name,
      'Email': mentor.email,
      'Coins': mentor.coins || 0,
      'Package': mentor.packageName || 'None',
      'Joined Date': mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : 'N/A',
      'Status': mentor.isBanned ? 'Banned' : 'Active',
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  private static addPackageDistributionSheet(workbook: XLSX.WorkBook, packages: any[]) {
    const data = packages.map((pkg: any) => ({
      'Package Name': pkg.packageName,
      'Active Users': pkg.currentActiveUsers,
      'Total Purchases': pkg.totalPurchases,
      'Current Revenue': `₹${pkg.currentRevenue.toLocaleString()}`,
      'Total Revenue': `₹${pkg.totalRevenue.toLocaleString()}`,
      'Price per User': `₹${pkg.priceInCoins.toLocaleString()}`,
      'Avg Revenue per User': pkg.currentActiveUsers > 0 
        ? `₹${Math.round(pkg.currentRevenue / pkg.currentActiveUsers).toLocaleString()}`
        : '₹0',
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
      { wch: 18 }, { wch: 18 }, { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Package Distribution');
  }

  private static addUserGrowthSheet(workbook: XLSX.WorkBook, growthData: any[]) {
    const data = growthData.map((day: any) => ({
      'Date': new Date(day.date).toLocaleDateString(),
      'New Users': day.newUsers,
      'Total Users': day.users,
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Daily User Growth');
  }

  private static addRevenueTrendSheet(workbook: XLSX.WorkBook, salesData: any[]) {
    const data = salesData
      .filter((d: any) => d.revenue > 0)
      .map((day: any) => ({
        'Date': new Date(day.date).toLocaleDateString(),
        'Revenue': `₹${day.revenue.toLocaleString()}`,
        'Packages Sold': day.packagesSold,
        'Avg Revenue per Sale': day.packagesSold > 0 
          ? `₹${Math.round(day.revenue / day.packagesSold).toLocaleString()}`
          : '₹0',
      }));

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet['!cols'] = [{ wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Revenue Trend');
  }
}
