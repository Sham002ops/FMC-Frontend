import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { ExportService } from '@/services/ExportService';

interface ExportButtonProps {
  stats: any;
  userGrowthTrend: any[];
  salesTrend: any[];
  timeRange?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  stats,
  userGrowthTrend,
  salesTrend,
  timeRange,
  className = ''
}) => {
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    try {
      setExporting(true);
      setStatus('idle');

      await ExportService.generateDetailedReport({
        stats,
        userGrowthTrend,
        salesTrend,
        timeRange,
      });

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
        ${status === 'success' 
          ? 'bg-green-600 text-white' 
          : status === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {exporting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="hidden sm:inline">Generating...</span>
        </>
      ) : status === 'success' ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Exported!</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Failed</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </>
      )}
    </button>
  );
};
