import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { gsap } from 'gsap';

interface Executive {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  number?: string;
  address?: string;
  pinCode?: string;
  joinedAt?: string;
  role?: string;
}

interface Props {
  onSignout: () => void;
}

const ExecutiveProfileMenu: React.FC<Props> = ({ onSignout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const referralRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchExecutiveProfile();
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

      if (referralRef.current) {
        gsap.from(referralRef.current, {
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

  const fetchExecutiveProfile = async () => {
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
      
      console.log('✅ Profile Response:', response.data); // Debug log
      
      // ✅ FIXED: Properly extract executive data from response
      const userData = response.data.user;
      
      if (userData) {
        setExecutive({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          referralCode: userData.referralCode,
          number: userData.number,
          address: userData.address,
          pinCode: userData.pinCode,
          joinedAt: userData.joinedAt,
          role: userData.role
        });
        console.log('✅ Executive State Set:', userData);
      }
    } catch (err) {
      console.error('❌ Error fetching executive profile:', err);
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

  const handleCopyReferralCode = () => {
    if (executive?.referralCode) {
      navigator.clipboard.writeText(executive.referralCode);
      // Optional: Add toast notification
      console.log('📋 Copied:', executive.referralCode);
    }
  };

  const getJoinedDate = () => {
    if (!executive?.joinedAt) return 'Recently';
    try {
      const date = new Date(executive.joinedAt);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      return 'Recently';
    }
  };

  const getInitial = () => {
    return executive?.name?.charAt(0).toUpperCase() || 'E';
  };

  // ✅ Debug: Log executive state
  useEffect(() => {
    console.log('📊 Current Executive State:', executive);
  }, [executive]);

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
        className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center focus:outline-none hover:ring-4 hover:ring-white/30 transition-all duration-200 shadow-lg hover:scale-110"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Executive profile menu"
      >
        <div 
          ref={avatarRef}
          className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold"
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
              <div className="bg-gradient-to-br from-indigo-600 via-green-400 to-green-500 px-4 pt-4 pb-4">
                <div ref={headerRef} className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/30">
                    {getInitial()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-bold text-white mb-0.5 truncate">
                      {executive?.name || "Executive"}
                    </h3>
                    <p className="text-white/90 text-xs mb-1.5 truncate">
                      {executive?.email || "executive@fmc.com"}
                    </p>
                    
                    {/* Role Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-[10px] font-semibold uppercase tracking-wide">
                        {executive?.role || 'EXECUTIVE'}
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

                {/* Referral Code Card */}
                {executive?.referralCode && (
                  <div 
                    ref={referralRef} 
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
                    onClick={handleCopyReferralCode}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span className="text-white/90 text-xs">Referral Code</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-bold">{executive.referralCode}</span>
                        <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div ref={statsRef} className="px-3 py-3 grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-indigo-600 font-medium mb-0.5">Phone</p>
                  <p className="text-xs font-semibold text-indigo-700 truncate">
                    {executive?.number || 'Not set'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 hover:scale-105 transition-transform duration-200">
                  <p className="text-[10px] text-purple-600 font-medium mb-0.5">Joined</p>
                  <p className="text-xs font-semibold text-purple-700">{getJoinedDate()}</p>
                </div>
              </div>

              {executive?.address && (
                <div className="px-3 pb-3">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2.5">
                    <p className="text-[10px] text-pink-600 font-medium mb-1">Address</p>
                    <p className="text-xs text-pink-700 line-clamp-2">{executive.address}</p>
                    {executive.pinCode && (
                      <p className="text-xs text-pink-600 font-semibold mt-1">PIN: {executive.pinCode}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 mx-3" />
              
              {/* Navigation Links */}
              <ul ref={linksRef} className="px-3 py-2 space-y-0.5">
                <li>
                  <button
                    onClick={() => handleNav("/exexutive-dashboard")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">My Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/executive/referrals")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">My Referrals</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav("/executive/performance")}
                    className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Performance</span>
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

export default ExecutiveProfileMenu;
