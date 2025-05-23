// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useClerk } from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const handleSignout = async () => {
    await signOut();
    navigate("/login");
  };
  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">Finite Marshall Club</div>
        <div className='flex justify-between gap-9 items-center'>
        <nav className="hidden justify-end md:flex gap-6 text-sm font-medium text-gray-700">
          <a href="#how-it-works" className="hover:text-primary">How It Works</a>
          <a href="#packages" className="hover:text-primary">Packages</a>
          <a href="#webinars" className="hover:text-primary">Webinars</a>
          <a href="#testimonials" className="hover:text-primary">Testimonials</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="space-x-6">
            <Link to="/login" className="text-primary hover:text-purple-600">
              Login
            </Link>
            <Link to="/register">
              <Button variant="outline" className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white">
                Join Now
              </Button>
            </Link>
          </div>
          <div
                  onClick={handleSignout}
                  className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
        </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
