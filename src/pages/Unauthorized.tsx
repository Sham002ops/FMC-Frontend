import React, { useEffect, useState } from "react";
import { ShieldOff, LogOut, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface UnauthorizedReason {
  type: 'expired' | 'invalid' | 'no_access' | 'role_mismatch';
  message: string;
  showLoginButton: boolean;
}

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reason, setReason] = useState<UnauthorizedReason>({
    type: 'no_access',
    message: "You're not authorized to view this page.",
    showLoginButton: false,
  });

  useEffect(() => {
    // Check URL query params (from axios interceptor)
    const searchParams = new URLSearchParams(location.search);
    const queryReason = searchParams.get('reason');
    
    // Check state passed from navigation (from ProtectedRoute)
    const stateReason = location.state?.reason;
    
    // Prioritize query param over state
    const finalReason = queryReason || stateReason;
    
    if (finalReason === 'token_expired') {
      setReason({
        type: 'expired',
        message: 'Your session has expired for security reasons. Please login again to continue.',
        showLoginButton: true,
      });
    } else if (finalReason === 'invalid_token') {
      setReason({
        type: 'invalid',
        message: 'Your authentication is invalid. This may happen after a password change or security update.',
        showLoginButton: true,
      });
    } else if (finalReason === 'role_mismatch') {
      setReason({
        type: 'role_mismatch',
        message: 'You do not have the required permissions to access this area. Contact your administrator if you believe this is an error.',
        showLoginButton: false,
      });
    } else {
      setReason({
        type: 'no_access',
        message: "You're not authorized to view this page. Please ensure you're logged in with the correct account.",
        showLoginButton: true,
      });
    }
  }, [location]);

  const handleGoBack = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // Go to appropriate dashboard based on role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Route to role-specific dashboard
          switch (user.role) {
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            case 'MENTOR':
              navigate('/mentor/dashboard');
              break;
            case 'EXECUTIVE':
              navigate('/executive/dashboard');
              break;
            case 'USER':
            default:
              navigate('/user/dashboard');
              break;
          }
        } catch {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleLogin = () => {
    // Clear old tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login with message
    navigate('/login', {
      state: { 
        message: reason.type === 'expired' 
          ? 'Your session expired. Please login again.' 
          : 'Please login to continue' 
      }
    });
  };

  const handleLogout = () => {
    // Clear everything
    localStorage.clear();
    
    // Redirect to home
    navigate('/', { replace: true });
  };

  // Choose icon based on reason type
  const getIcon = () => {
    switch (reason.type) {
      case 'expired':
        return <RefreshCw className="h-16 w-16 text-amber-500" />;
      case 'role_mismatch':
        return <AlertTriangle className="h-16 w-16 text-orange-500" />;
      default:
        return <ShieldOff className="h-16 w-16 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md text-center border border-violet-100">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${
            reason.type === 'expired' ? 'bg-amber-50' :
            reason.type === 'role_mismatch' ? 'bg-orange-50' :
            'bg-red-50'
          }`}>
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {reason.type === 'expired' ? 'Session Expired' : 
           reason.type === 'role_mismatch' ? 'Access Restricted' :
           'Access Denied'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          {reason.message}
        </p>

        {/* Reason Badge */}
        {reason.type === 'expired' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-800 text-sm">
              <RefreshCw className="h-4 w-4" />
              <span>Your login session has timed out</span>
            </div>
          </div>
        )}

        {reason.type === 'role_mismatch' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-orange-800 text-sm">
              This area is restricted to specific user roles.
            </p>
          </div>
        )}

        {reason.type === 'invalid' && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-800 text-sm">
              Your authentication token is invalid or has been revoked.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {reason.showLoginButton ? (
            <>
              <button
                onClick={handleLogin}
                className="w-full bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Login Again
              </button>
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium"
              >
                Go Back Home
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleGoBack}
                className="w-full bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition font-medium shadow-md hover:shadow-lg"
              >
                Go Back
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
