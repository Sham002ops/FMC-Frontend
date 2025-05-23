
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';

const TestLogin = () => {
  return (
    <div className="min-h-screen bg-event-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Logo size="large" />
          <h1 className="text-4xl font-bold text-white mt-6 mb-2">Login</h1>
        </div>

        <div className="space-y-4">
          <Link to="/admin-login" className="block">
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white text-xl py-6 rounded-xl backdrop-blur-sm">
              ADMIN LOGIN
            </Button>
          </Link>
          
          <Link to="/company-login" className="block">
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white text-xl py-6 rounded-xl backdrop-blur-sm">
              COMPANY LOGIN
            </Button>
          </Link>
          
          <Link to="/user-login" className="block">
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white text-xl py-6 rounded-xl backdrop-blur-sm">
              USER LOGIN
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <Link to="/register" className="text-white hover:text-event-accent text-lg">
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
