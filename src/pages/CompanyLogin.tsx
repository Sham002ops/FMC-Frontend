
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from '@/components/Logo';

const CompanyLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, authenticate company here
    navigate('/company-dashboard');
  };

  return (
    <div className="min-h-screen bg-event-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="md" />
          <h1 className="text-2xl font-bold text-white mt-6">Company Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyId">Company ID</Label>
              <Input 
                id="companyId" 
                type="text" 
                placeholder="Your company ID"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="company@example.com"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-event-primary hover:underline">
                  Forgot password?
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
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Need a company account?{' '}
            <Link to="/register-company" className="font-medium hover:underline">
              Register Here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-white/80 hover:text-white text-sm">
            ← Back to all login options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
