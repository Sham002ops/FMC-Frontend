import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

interface Header1Props {
  username?: string | null;
  user?: {
    role?: string;
  } | null;
}

const Header1: React.FC<Header1Props> = ({ username, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = async () => {
    // Clear authentication data
    localStorage.removeItem('token');
    // Navigate to login page
    navigate("/login");
  };

  const handleMenuItemClick = (item: string) => {
    setMenuOpen(false);
    
    switch (item) {
      case 'dashboard':
        navigate('/admin-dashboard');
        break;
      case 'webinars':
        navigate('/admin/webinars');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-green-400 text-white shadow-lg  w-full">
      <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center sm:text-xl gap-4 lg:text-2xl font-bold">
            <Logo size="small" /> 
            <span className="hidden sm:inline">FINITE MARSHALL CLUB</span>
            <span className="sm:hidden text-lg">FMC</span>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative">
              <button
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 flex items-center justify-center focus:outline-none hover:bg-white/40 transition-colors"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open user menu"
              >
                <svg 
                  className="w-5 h-5 sm:w-7 sm:h-7 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={2} 
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </button>
              
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setMenuOpen(false)}
                  />
                  
                  {/* Menu Dropdown */}
                  <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-xl border border-primary shadow-lg shadow-purple-300 z-50">
                    <div className="py-4 sm:py-6 px-4 sm:px-5">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg sm:text-xl font-semibold shadow-inner">
                          {username ? username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        
                        <button 
                          className="absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4 transition-colors" 
                          onClick={() => setMenuOpen(false)}
                          aria-label="Close menu"
                        >
                          ×
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold mt-2 text-gray-800 truncate">
                            {username || "Admin User"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            <span className="text-violet-700">
                              • {String(user?.role || 'ADMIN').toUpperCase()}
                            </span> 
                            {' '}• Joined Jan 2025
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-4" />

                      {/* Navigation Menu */}
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li 
                          className="hover:text-primary cursor-pointer transition-colors py-1 px-2 rounded hover:bg-gray-50"
                          onClick={() => handleMenuItemClick('dashboard')}
                        >
                          Dashboard
                        </li>
                        <li 
                          className="hover:text-primary cursor-pointer transition-colors py-1 px-2 rounded hover:bg-gray-50"
                          onClick={() => handleMenuItemClick('webinars')}
                        >
                          My Webinars
                        </li>
                        <li 
                          className="hover:text-primary cursor-pointer transition-colors py-1 px-2 rounded hover:bg-gray-50"
                          onClick={() => handleMenuItemClick('settings')}
                        >
                          Settings
                        </li>
                      </ul>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignout}
                        className="mt-6 w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;