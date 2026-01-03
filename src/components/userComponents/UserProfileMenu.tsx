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
  createdAt: string;
  packageName?: string;
  number?: string;        // ✅ NEW
  dateOfBirth?: string;   // ✅ NEW
  address?: string;       // ✅ NEW
  pinCode?: string;       // ✅ NEW
}

interface Props {
  onSignout: () => void;
}

const UserProfileMenu: React.FC<Props> = ({ onSignout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);     // ✅ NEW
  const linksRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Animate menu opening
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      // Set initial state
      gsap.set(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transformOrigin: 'top right'
      });

      // Animate menu entrance
      gsap.to(menuRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });

      // Animate header
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.1,
          ease: 'power2.out'
        });
      }

      // Animate package card
      if (packageRef.current) {
        gsap.from(packageRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          delay: 0.2,
          ease: 'power2.out'
        });
      }

      // ✅ Animate user info cards
      if (infoRef.current) {
        gsap.from(infoRef.current.children, {
          opacity: 0,
          x: -20,
          duration: 0.3,
          stagger: 0.08,
          delay: 0.3,
          ease: 'power2.out'
        });
      }

      // Animate navigation links
      if (linksRef.current) {
        gsap.from(linksRef.current.children, {
          opacity: 0,
          x: -20,
          duration: 0.3,
          stagger: 0.08,
          delay: 0.4,
          ease: 'power2.out'
        });
      }

      // Animate sign out button
      if (buttonRef.current) {
        gsap.from(buttonRef.current, {
          y: 20,
          duration: 0.4,
          delay: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    }
  }, [menuOpen]);

  // ✅ Animate avatar on load
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
      console.log('User profile fetched at menu :', response.data.user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path: string) => {
    // Animate close
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setMenuOpen(false);
          navigate(`/${path}`);
        }
      });
    } else {
      setMenuOpen(false);
      navigate(`/${path}`);
    }
  };

  const handleClose = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setMenuOpen(false)
      });
    } else {
      setMenuOpen(false);
    }
  };

  const getAvatarGradient = () => {
    const role = user?.role?.toLowerCase() || 'user';
    if (role === 'admin') return 'from-red-500 to-pink-600';
    if (role === 'mentor') return 'from-green-500 to-emerald-600';
    if (role === 'executive') return 'from-blue-500 to-indigo-600';
    return 'from-yellow-400 to-orange-500';
  };

  const getRoleBadgeColor = () => {
    const role = user?.role?.toLowerCase() || 'user';
    if (role === 'admin') return 'bg-red-100 text-red-800';
    if (role === 'mentor') return 'bg-green-100 text-green-800';
    if (role === 'executive') return 'bg-blue-100 text-blue-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getJoinedDate = () => {
    if (!user?.createdAt) return 'Recently joined';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  // ✅ NEW: Format date of birth
  const formatDateOfBirth = () => {
    if (!user?.dateOfBirth) return 'Not provided';
    const date = new Date(user.dateOfBirth);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // ✅ NEW: Calculate age
  const calculateAge = () => {
    if (!user?.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 transition-all hover:scale-110"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Profile menu"
      >
        <div 
          ref={avatarRef}
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
        >
          {getInitial()}
        </div>
      </button>
      
      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={handleClose}
          ></div>
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-[9999] border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div ref={headerRef} className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                  {getInitial()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                      {user?.role?.toUpperCase() || 'USER'}
                    </span>
                    <span>• {getJoinedDate()}</span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Package Card */}
              {user?.packageName && (
                <div ref={packageRef} className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-600">Active Package</p>
                      <p className="text-sm font-semibold text-gray-800">{user.packageName}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 my-4" />
              
              {/* ✅ NEW: User Information Section */}
              <div ref={infoRef} className="space-y-3 mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personal Information</h4>
                
                {/* Email */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-800 font-medium truncate" title={user?.email}>
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm text-gray-800 font-medium">
                      {user?.number || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-800 font-medium">
                      {formatDateOfBirth()}
                      {calculateAge() && (
                        <span className="text-xs text-gray-500 ml-2">({calculateAge()} years)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-800 font-medium line-clamp-2" title={user?.address || undefined}>
                      {user?.address || 'Not provided'}
                      {user?.pinCode && (
                        <span className="block text-xs text-gray-500 mt-0.5">PIN: {user.pinCode}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-1" />
              
              {/* ✅ NEW: Quick Links */}
              <ul ref={linksRef} className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => {
                      handleClose();
                      window.open('/terms', '_blank');
                    }}
                    className="w-full flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms & Conditions
                  </button>
                </li>
              </ul>
              
              <div className="border-t border-gray-200 my-1" />
              
              {/* Sign Out Button */}
              <button
                ref={buttonRef}
                onClick={onSignout}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:scale-105 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-slideIn {
              animation: slideIn 0.2s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default UserProfileMenu;
