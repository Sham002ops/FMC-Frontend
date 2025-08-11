// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await verifyToken();
      if (!userData) {
        navigate('/unauthorized');
        console.log("userData at useAuth", userData);
        
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return { user, loading };
};
