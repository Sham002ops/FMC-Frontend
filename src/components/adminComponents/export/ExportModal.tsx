import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, CheckSquare } from 'lucide-react';
import { ExportService } from '@/services/ExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: any;
  userGrowthTrend: any[];
  salesTrend: any[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  userGrowthTrend,
  salesTrend,
}) => {
  const [exporting, setExporting] = useState(false);
  const [selectedSheets, setSelectedSheets] = useState({
    summary: true,
    usersThisMonth: true,
    allUsers: true,
    executivesThisMonth: true,
    allExecutives: true,
    mentorsThisMonth: true,
    allMentors: true,
    packageDistribution: true,
    userGrowth: true,
    revenueTrend: true,
  });

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setExporting(true);
      await ExportService.generateDetailedReport({
        stats,
        userGrowthTrend,
        salesTrend,
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

const sheets = [
  { id: 'monthlyReport', label: 'Monthly Registration Report', description: 'Detailed report of new users this month with executive names and revenue' },
  { id: 'summary', label: 'Executive Summary', description: 'Overview of all metrics' },
  { id: 'usersThisMonth', label: 'Users This Month', description: 'New users this month with packages' },
  { id: 'allUsers', label: 'All Users', description: 'Complete user database' },
  { id: 'executivesThisMonth', label: 'Executives This Month', description: 'New executives' },
  { id: 'allExecutives', label: 'All Executives', description: 'Complete executive list' },
  { id: 'mentorsThisMonth', label: 'Mentors This Month', description: 'New mentors' },
  { id: 'allMentors', label: 'All Mentors', description: 'Complete mentor list' },
  { id: 'packageDistribution', label: 'Package Distribution', description: 'Package performance' },
  { id: 'userGrowth', label: 'Daily User Growth', description: 'User growth trends' },
  { id: 'revenueTrend', label: 'Revenue Trend', description: 'Daily revenue data' },
];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Export Analytics Report</h2>
                <p className="text-sm text-blue-100">Generate comprehensive Excel report</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Report Contents</h3>
            <p className="text-sm text-gray-600">
              The following sheets will be included in your Excel report:
            </p>
          </div>

          <div className="space-y-2">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{sheet.label}</h4>
                  <p className="text-sm text-gray-500">{sheet.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Report Summary</h4>
            <ul className="text-sm text-blue-800 space-y-1">
                <li>• Total Users: {stats.users.total}</li>
                <li>• New Users This Month: {stats.users.new}</li>
                <li>• Total Revenue: ₹{stats.revenue.total.toLocaleString()}</li>
                <li>• This Month Revenue: ₹{stats.revenue.thisMonth.toLocaleString()}</li>
                <li>• Active Packages: {stats.packages.stats.length}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
