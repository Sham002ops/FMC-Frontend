
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from '@/components/Logo';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, authenticate admin here
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-event-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="md" />
          <h1 className="text-2xl font-bold text-white mt-6">Admin Login</h1>
          <p className="text-white/80 mt-2">Secure access for platform administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminId">Admin ID</Label>
              <Input 
                id="adminId" 
                type="text" 
                placeholder="Your admin ID"
                className="mt-1"
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
                className="mt-1"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-event-primary hover:bg-event-dark">
              Secure Sign In
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
