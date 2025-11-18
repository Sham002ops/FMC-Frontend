import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { gsap } from 'gsap';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  coins?: number;
  joinedAt: string;
  packageName?: string;
}

interface Props {
  onSignout: () => void;
}

const AdminProfileMenu: React.FC<Props> = ({ onSignout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Animate menu opening
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      gsap.set(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transformOrigin: 'top right'
      });

      gsap.to(menuRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });

      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          x: -20,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.15,
          ease: 'power2.out'
        });
      }

      if (packageRef.current) {
        gsap.from(packageRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: 0.25,
          ease: 'power2.out'
        });
      }

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.35,
          ease: 'back.out(1.7)'
        });
      }

      if (linksRef.current) {
        gsap.from(linksRef.current.children, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.45,
          ease: 'power2.out'
        });
      }

      // ✅ Fixed: Sign Out button animation with proper opacity
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current, 
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
          },
          {
            opacity: 1, // Explicitly set to 1
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: 0.65,
            ease: 'back.out(1.7)'
          }
        );
      }
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!loading && avatarRef.current) {
      gsap.from(avatarRef.current, {
        scale: 0,
        rotation: 360,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }
  }, [loading]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BackendUrl}/auth/verifyToken`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path: string) => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setMenuOpen(false);
          navigate(path);
        }
      });
    } else {
      setMenuOpen(false);
      navigate(path);
    }
  };

  const handleClose = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setMenuOpen(false)
      });
    } else {
      setMenuOpen(false);
    }
  };

  // ✅ Fixed: Real formatted join date
  const getJoinedDate = () => {
    if (!user?.joinedAt) return 'Recently';
    try {
      const date = new Date(user.joinedAt);
      // Format: "Jan 2025" or "12 Jan 2025"
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      return 'Recently';
    }
  };

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'A';
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-orange-500 flex items-center justify-center focus:outline-none hover:ring-4 hover:ring-white/30 transition-all duration-200 shadow-lg hover:scale-110"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Admin profile menu"
      >
        <div 
          ref={avatarRef}
          className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold"
        >
          {getInitial()}
        </div>
      </button>
      
      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" 
            onClick={handleClose}
          />
          
          {/* Menu - Fixed scrollbar and height */}
          <div 
            ref={menuRef}
            className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl z-[9999] border border-gray-100"
            style={{
              maxHeight: '80vh',
              overflow: 'hidden', // ✅ Hide scrollbar completely
            }}
          >
            {/* Scrollable Inner Container */}
            <div 
              style={{
                maxHeight: '80vh',
                overflowY: 'auto',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
              className="[&::-webkit-scrollbar]:hidden" // Chrome/Safari
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-400 px-4 pt-4 pb-4">
                <div ref={headerRef} className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/30">
                    {getInitial()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-bold text-white mb-0.5 truncate">
                      {user?.name || "Admin"}
                    </h3>
                    <p className="text-white/90 text-xs mb-1.5 truncate">
                      {user?.email || "admin@fmc.com"}
                    </p>
                    
                    {/* Role Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-[10px] font-semibold uppercase tracking-wide">
                        {user?.role || 'ADMIN'}
                      </span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Package Card */}
                {user?.packageName && (
                  <div ref={packageRef} className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/90 text-xs">Active Package</span>
                      </div>
                      <span className="text-white text-sm font-semibold">{user.packageName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div ref={statsRef} className="px-3 py-3 grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-blue-600 font-medium mb-0.5">Coins</p>
                  <p className="text-lg font-bold text-blue-700">{user?.coins?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-green-600 font-medium mb-0.5">Joined</p>
                  <p className="text-xs font-semibold text-green-700">{getJoinedDate()}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 mx-3" />
              
              {/* Navigation Links */}
              <ul ref={linksRef} className="px-3 py-2 space-y-0.5">
                <li>
                  <button
                    onClick={() => handleNav("/admin-dashboard")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">My Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/all-users")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Manage Users</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/webinars")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">My Webinars</span>
                  </button>
                </li>
              </ul>
              
              <div className="border-t border-gray-200 mx-3" />
              
              {/* ✅ Fixed: Sign Out Button - Fully visible */}
              <div className="px-3 py-3">
                <button
                  ref={buttonRef}
                  onClick={onSignout}
                  className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md hover:shadow-lg text-sm opacity-100"
                  style={{ opacity: 1 }} // ✅ Force visibility
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProfileMenu;
