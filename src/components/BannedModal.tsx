import React from 'react';
import { Button } from './ui/button';
import { Mail, AlertCircle } from 'lucide-react';

interface BannedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BannedModal: React.FC<BannedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full h-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-4 text-white text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          {/* Ban icon with animation */}
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-1 ">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2.5" 
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Account Suspended</h2>
            <p className="text-white/90 text-sm">Access Denied</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Main message */}
          <div className="text-center space-y-2">
            <p className="text-gray-800 font-semibold text-lg">
              Your account has been banned
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your account has been temporarily suspended by an administrator. 
              If you believe this is a mistake, please contact our support team for assistance.
            </p>
          </div>

          {/* Info box */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-sm mb-1">
                  Why was I banned?
                </h4>
                <p className="text-red-800 text-xs leading-relaxed">
                  Common reasons include violation of terms of service, suspicious activity, 
                  or administrative action. Contact support for specific details about your case.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-1">
            <Button 
              onClick={() => window.location.href = 'mailto:support@finitemarshalclub.com?subject=Account%20Ban%20Appeal'}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>

            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-2 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {/* Support info */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Support Email: <span className="font-medium text-gray-700">support@finitemarshalclub.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedModal;
