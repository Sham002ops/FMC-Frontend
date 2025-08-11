import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from '@/components/Logo';
import { Processing } from '@/components/ui/icons/Processing';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // ⚠️ Important for cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: adminId,
          password: password
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || 'Login failed');
      }

      // Optionally: verify token after login
      const verify = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
        credentials: 'include',
      });

      if (!verify.ok) {
        throw new Error('Login token could not be verified');
      }

      navigate('/admin-dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-event-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="medium" />
          <h1 className="text-2xl font-bold text-white mt-6">Admin Login</h1>
          <p className="text-white/80 mt-2">Secure access for platform administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminId">Admin Email</Label>
              <Input 
                id="adminId" 
                type="text" 
                placeholder="admin@example.com"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/admin-reset" className="text-sm text-event-primary hover:underline">
                  Reset access
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full bg-event-primary hover:bg-event-dark">
              Secure Sign In {isLoading && <Processing />}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Administrator access is restricted to authorized personnel only.</p>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-white/80 hover:text-white text-sm">
            ← Back to all login options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
