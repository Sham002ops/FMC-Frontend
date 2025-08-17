import React from 'react';
import { Navigate } from 'react-router-dom';

interface RoleBasedRedirectProps {
  isLoggedIn: boolean;
  user: { role?: string } | null;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ isLoggedIn, user }) => {
  if (!isLoggedIn) {
    return <Navigate to="/landing-page" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin-dashboard" replace />;
    case 'EXECUTIVE':
      return <Navigate to="/exexutive-dashboard" replace />;
    case 'USER':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleBasedRedirect;
