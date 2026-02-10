import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { gsap } from 'gsap';

interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  joinedAt?: string;
  role?: string;
  permissions?: string[];
}

interface Props {
  onSignout: () => void;
}

const SuperAdminProfileMenu: React.FC<Props> = ({ onSignout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchAdminProfile();
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

      if (badgeRef.current) {
        gsap.from(badgeRef.current, {
          opacity: 0,
          scale: 0,
          rotation: 10,
          duration: 0.6,
          delay: 0.25,
          ease: 'back.out(1.7)'
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

      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current, 
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
          },
          {
            opacity: 1,
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

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${BackendUrl}/auth/verifyToken`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Profile Response:', response.data);
      
      const userData = response.data.user;
      
      if (userData) {
        setAdmin({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          number: userData.number,
          address: userData.address,
          pinCode: userData.pinCode,
          joinedAt: userData.joinedAt,
          role: userData.role,
          permissions: userData.permissions || ['ALL_ACCESS']
        });
        console.log('✅ Admin State Set:', userData);
      }
    } catch (err) {
      console.error('❌ Error fetching admin profile:', err);
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

  const getJoinedDate = () => {
    if (!admin?.joinedAt) return 'Recently';
    try {
      const date = new Date(admin.joinedAt);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      return 'Recently';
    }
  };

  const getInitial = () => {
    return admin?.name?.charAt(0).toUpperCase() || 'S';
  };

  useEffect(() => {
    console.log('📊 Current Admin State:', admin);
  }, [admin]);

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
        className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center focus:outline-none hover:ring-4 hover:ring-white/30 transition-all duration-200 shadow-lg hover:scale-110 relative"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Super Admin profile menu"
      >
        <div 
          ref={avatarRef}
          className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold"
        >
          {getInitial()}
        </div>
        {/* Crown Icon */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <svg className="w-2.5 h-2.5 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
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
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl z-[9999] border border-gray-100"
            style={{
              maxHeight: '80vh',
              overflow: 'hidden',
            }}
          >
            {/* Scrollable Inner Container */}
            <div 
              style={{
                maxHeight: '80vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="[&::-webkit-scrollbar]:hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 pt-4 pb-4 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                
                <div ref={headerRef} className="flex items-start gap-3 mb-3 relative z-10">
                  {/* Avatar with Crown */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/30">
                      {getInitial()}
                    </div>
                    {/* Crown Badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                      <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-bold text-white mb-0.5 truncate">
                      {admin?.name || "Super Admin"}
                    </h3>
                    <p className="text-white/90 text-xs mb-1.5 truncate">
                      {admin?.email || "admin@fmc.com"}
                    </p>
                    
                    {/* Role Badge with Animation */}
                    <div 
                      ref={badgeRef}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 px-2.5 py-1 rounded-full shadow-lg"
                    >
                      <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-yellow-900 text-[10px] font-bold uppercase">
                        SUPER ADMIN
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

                {/* All Access Badge */}
                <div className="relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-xs font-semibold">FULL SYSTEM ACCESS</span>
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-75" />
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="px-3 py-3 grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-blue-600 font-medium mb-0.5">Phone</p>
                  <p className="text-xs font-semibold text-blue-700 truncate">
                    {admin?.number || 'Not set'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-indigo-600 font-medium mb-0.5">Admin Since</p>
                  <p className="text-xs font-semibold text-indigo-700">{getJoinedDate()}</p>
                </div>
              </div>

              {admin?.address && (
                <div className="px-3 pb-3">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2.5">
                    <p className="text-[10px] text-purple-600 font-medium mb-1">Address</p>
                    <p className="text-xs text-purple-700 line-clamp-2">{admin.address}</p>
                    {admin.pinCode && (
                      <p className="text-xs text-purple-600 font-semibold mt-1">PIN: {admin.pinCode}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 mx-3" />
              
              {/* Navigation Links */}
              <ul ref={linksRef} className="px-3 py-2 space-y-0.5">
                <li>
                  <button
                    onClick={() => handleNav("/superadmin-dashboard")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/all-users")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">All Users</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/executives")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Executives</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/packages")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Packages</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/admin/audit-logs")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Audit Logs</span>
                  </button>
                </li>
              </ul>
              
              <div className="border-t border-gray-200 mx-3" />
              
              {/* Sign Out Button */}
              <div className="px-3 py-3">
                <button
                  ref={buttonRef}
                  onClick={onSignout}
                  className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md hover:shadow-lg text-sm opacity-100"
                  style={{ opacity: 1 }}
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

export default SuperAdminProfileMenu;
