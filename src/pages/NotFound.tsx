import React, { useEffect, useState } from "react";
import { ShieldOff, LogOut, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Reason {
  type: 'expired' | 'invalid' | 'no_access' | 'role_mismatch' | 'no_token';
  message: string;
  showLoginButton: boolean;
}

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [reason, setReason] = useState<Reason>({
    type: 'no_access',
    message: "You're not authorized to view this page.",
    showLoginButton: false,
  });

  useEffect(() => {
    const performTokenCheck = async () => {
      // ✅ STEP 1: Check if token exists
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No token found - redirecting to login');
        setReason({
          type: 'no_token',
          message: 'You need to login first to access this page.',
          showLoginButton: true,
        });
        setIsChecking(false);
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { message: 'Please login to continue' }
          });
        }, 2000);
        return;
      }

      // ✅ STEP 2: Check URL query params (from axios interceptor)
      const searchParams = new URLSearchParams(location.search);
      const queryReason = searchParams.get('reason');
      
      // ✅ STEP 3: Check state passed from navigation (from ProtectedRoute)
      const stateReason = location.state?.reason;
      
      // Prioritize query param over state
      const finalReason = queryReason || stateReason;
      
      if (finalReason === 'token_expired') {
        console.log('⏰ Token expired');
        setReason({
          type: 'expired',
          message: 'Your session has expired for security reasons. Please login again to continue.',
          showLoginButton: true,
        });
      } else if (finalReason === 'invalid_token') {
        console.log('❌ Invalid token');
        setReason({
          type: 'invalid',
          message: 'Your authentication is invalid. This may happen after a password change or security update.',
          showLoginButton: true,
        });
      } else if (finalReason === 'role_mismatch') {
        console.log('🚫 Role mismatch');
        setReason({
          type: 'role_mismatch',
          message: 'You do not have the required permissions to access this area. Contact your administrator if you believe this is an error.',
          showLoginButton: false,
        });
      } else {
        // ✅ STEP 4: Generic 404 - user has token but route doesn't exist
        console.log('🔍 Generic 404 - checking if user is authenticated');
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('✅ User found in localStorage:', user.role);
            
            setReason({
              type: 'no_access',
              message: `The page you're looking for doesn't exist. Let's get you back to your dashboard.`,
              showLoginButton: false,
            });
          } catch {
            console.log('⚠️ Failed to parse user - might be corrupted');
            setReason({
              type: 'invalid',
              message: 'Your session data is corrupted. Please login again.',
              showLoginButton: true,
            });
          }
        } else {
          console.log('⚠️ Token exists but no user data - suspicious');
          setReason({
            type: 'no_access',
            message: "You're not authorized to view this page. Please ensure you're logged in with the correct account.",
            showLoginButton: true,
          });
        }
      }
      
      setIsChecking(false);
    };

    performTokenCheck();
  }, [location, navigate]);

  // ✅ FIXED: Correct dashboard paths matching App.tsx
  const handleGoBack = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Route to role-specific dashboard (FIXED PATHS)
          switch (user.role) {
            case 'SUPER_ADMIN':
              navigate('/superadmin-dashboard', { replace: true });
              break;
            case 'ADMIN':
              navigate('/admin-dashboard', { replace: true });
              break;
            case 'MENTOR':
              navigate('/Mentor-dashboard', { replace: true });
              break;
            case 'EXECUTIVE':
              navigate('/executive-dashboard', { replace: true });
              break;
            case 'USER':
            default:
              navigate('/dashboard', { replace: true });
              break;
          }
        } catch {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  };

  const handleLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/login', {
      replace: true,
      state: { 
        message: reason.type === 'expired' 
          ? 'Your session expired. Please login again.' 
          : 'Please login to continue' 
      }
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const getIcon = () => {
    switch (reason.type) {
      case 'expired':
        return <RefreshCw className="h-16 w-16 text-amber-500" />;
      case 'role_mismatch':
        return <AlertTriangle className="h-16 w-16 text-orange-500" />;
      case 'no_token':
        return <LogOut className="h-16 w-16 text-blue-500" />;
      default:
        return <ShieldOff className="h-16 w-16 text-red-500" />;
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md text-center border border-violet-100">
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${
            reason.type === 'expired' ? 'bg-amber-50' :
            reason.type === 'role_mismatch' ? 'bg-orange-50' :
            reason.type === 'no_token' ? 'bg-blue-50' :
            'bg-red-50'
          }`}>
            {getIcon()}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {reason.type === 'expired' ? 'Session Expired' : 
           reason.type === 'role_mismatch' ? 'Access Restricted' :
           reason.type === 'no_token' ? 'Login Required' :
           'Access Denied'}
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          {reason.message}
        </p>

        {reason.type === 'no_token' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-800 text-sm">
              <LogOut className="h-4 w-4" />
              <span>Redirecting to login page...</span>
            </div>
          </div>
        )}

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

        <div className="space-y-3">
          {reason.showLoginButton ? (
            <>
              <button
                onClick={handleLogin}
                className="w-full bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 h-4" />
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
                Go Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
