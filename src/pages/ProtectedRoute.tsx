// pages/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api"; // Your axios instance

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'USER' | 'ADMIN' | 'EXECUTIVE' | 'MENTOR' | 'SUPER_ADMIN';
  allowedRoles?: Array<'USER' | 'ADMIN' | 'EXECUTIVE' | 'MENTOR' | 'SUPER_ADMIN'>;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  allowedRoles
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/verifyToken');
        
        if (response.data && response.data.user) {
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          const userRole = response.data.user.role;

          if (allowedRoles) {
            setHasPermission(allowedRoles.includes(userRole));
          } else if (requiredRole) {
            setHasPermission(userRole === requiredRole);
          } else {
            setHasPermission(true);
          }

          // SuperAdmin can access Admin routes
          if (userRole === 'SUPER_ADMIN' && requiredRole === 'ADMIN') {
            setHasPermission(true);
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error: any) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loggedIn");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [requiredRole, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-violet-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-violet-300 opacity-20"></div>
          </div>
          <p className="text-gray-700 font-medium">Verifying authentication...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if ((requiredRole || allowedRoles) && !hasPermission) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          reason: 'role_mismatch',
          requiredRole: requiredRole || allowedRoles?.join(', '),
          currentRole: JSON.parse(localStorage.getItem("user") || '{}').role
        }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
