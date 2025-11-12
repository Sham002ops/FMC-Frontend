import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      const errorCode = error.response?.data?.code || '';

      // Handle different error types
      if (errorCode === 'TOKEN_EXPIRED' || errorMessage.includes('expired')) {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.location.href = '/unauthorized?reason=token_expired';
        // OR use navigate if you have access to it
        // navigate('/unauthorized', { state: { reason: 'token_expired' } });
      } else if (errorCode === 'INVALID_TOKEN' || errorMessage.includes('invalid')) {
        // Invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.location.href = '/unauthorized?reason=invalid_token';
      } else if (error.response?.status === 403) {
        // Forbidden - role mismatch
        window.location.href = '/unauthorized?reason=role_mismatch';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
