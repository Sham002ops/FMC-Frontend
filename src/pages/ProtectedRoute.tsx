import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api"; // Your axios instance

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'USER' | 'ADMIN' | 'EXECUTIVE' | 'MENTOR';
}

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      // No token = not authenticated
      if (!token || !userStr) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await api.get('/auth/verifyToken');
        
        if (response.data && response.data.user) {
          setIsAuthenticated(true);
          
          // Update user data in localStorage (in case it changed)
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          // Check role if required
          if (requiredRole) {
            const userRole = response.data.user.role;
            setHasPermission(userRole === requiredRole);
          } else {
            setHasPermission(true);
          }
        } else {
          // Invalid response
          throw new Error("Invalid response from server");
        }
      } catch (error: any) {
        console.error("Auth verification failed:", error);
        
        // Token is invalid or expired
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        setIsAuthenticated(false);
        
        // The axios interceptor will handle the redirect
        // But we'll also set auth to false to prevent rendering
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [requiredRole]);

  // Show loading spinner while verifying
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role - redirect to unauthorized
  if (requiredRole && !hasPermission) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ reason: 'role_mismatch' }} 
        replace 
      />
    );
  }

  // All checks passed - show protected content
  return children;
};

export default ProtectedRoute;
