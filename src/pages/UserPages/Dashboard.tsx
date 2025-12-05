import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FMC from '../../assets/FMC2.png'
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { NotificationSliderDesktop } from '@/components/userComponents/NotificationSliderDesktop';
import { NotificationSliderMobile } from '@/components/userComponents/NotificationSliderMobile';
import LoyaltyCard from '@/components/userComponents/LoyaltyCard';
import DisplayAllProducts from '@/components/Products/DisplayAllProducts';
import LoadingScreen from '@/components/LoadingScreen.tsx/LoadingScreen';
import UserStatsCards from '@/components/userComponents/UserStatsCards';
import UserProfileMenu from '@/components/userComponents/UserProfileMenu';
import YogaScheduleModal from '@/components/userComponents/YogaScheduleCalendar';
import { Calendar1 } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('User');
  const [webinars, setWebinars] = useState([]);
  const [registeredWebinars, setRegisteredWebinars] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          console.log("Token not present");
          navigate("/landing-page");
          return;
        }

        // ✅ Fetch user details
        let userData = null;
        try {
          const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          userData = res.data.user;
          setUser(userData);
          setUsername(userData?.name || 'User');
          
          const role = userData?.role;
          
          // Role-based redirects
          if (role === "ADMIN") {
            navigate("/admin-dashboard");
            return;
          }
          if (role === "EXECUTIVE") {
            navigate("/executive-dashboard");
            return;
          }
          if (role === "Mentor") {
            navigate("/Mentor-dashboard");
            return;
          }
          if (role && role !== "USER") {
            navigate("/unauthorized");
            return;
          }
        } catch (userErr) {
          console.error('Error verifying user:', userErr);
          // If token invalid, redirect to login
          if (axios.isAxiosError(userErr) && userErr.response?.status === 401) {
            localStorage.removeItem('token');
            navigate("/landing-page");
            return;
          }
          throw userErr;
        }

        // ✅ Fetch webinars (non-critical, continue even if fails)
        try {
          const webinarRes = await axios.get(`${BackendUrl}/webinar`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWebinars(Array.isArray(webinarRes.data) ? webinarRes.data : []);
        } catch (webinarErr) {
          console.error('Error fetching webinars:', webinarErr);
          setWebinars([]);
          // Don't throw - just continue with empty array
        }

        // ✅ Fetch registered webinars (non-critical, continue even if fails)
        try {
          const registeredRes = await axios.get(`${BackendUrl}/webinar/registered-webinars`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRegisteredWebinars(Array.isArray(registeredRes.data) ? registeredRes.data : []);
        } catch (regErr) {
          console.error('Error fetching registered webinars:', regErr);
          setRegisteredWebinars([]);
          // Don't throw - just continue with empty array
        }

      } catch (err) {
        console.error("Critical error fetching user details:", err);
        setError("Failed to load dashboard. Please try refreshing the page.");
        setUser(null);
        setWebinars([]);
        setRegisteredWebinars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSignout = async () => {
    try {
      await axios.post(`${BackendUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/landing-page");
    }
  };

  // ✅ Safe webinar filtering with error handling
  const getUpcomingWebinars = () => {
    try {
      if (!Array.isArray(webinars)) return [];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      return webinars
        .filter(webinar => {
          try {
            return webinar && new Date(webinar.date) >= startOfToday;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          } catch {
            return 0;
          }
        });
    } catch (err) {
      console.error('Error filtering upcoming webinars:', err);
      return [];
    }
  };

  const getPastWebinars = () => {
    try {
      if (!Array.isArray(webinars)) return [];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      return webinars
        .filter(webinar => {
          try {
            return webinar && new Date(webinar.date) < startOfToday;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          } catch {
            return 0;
          }
        });
    } catch (err) {
      console.error('Error filtering past webinars:', err);
      return [];
    }
  };

  const upcomingEvents = getUpcomingWebinars();
  const pastEvents = getPastWebinars();

  const getFullThumbnailUrl = (thumbnailPath: string) => {
    try {
      if (!thumbnailPath) return '/placeholder-image.png';
      
      if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
        return thumbnailPath;
      }
      
      const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath : `/${thumbnailPath}`;
      return `${BackendUrl}${cleanPath}`;
    } catch {
      return '/placeholder-image.png';
    }
  };

  const handleRegisterAndJoin = async (webinarId: string, zoomLink: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to register for webinars');
        return;
      }

      await axios.post(
        `${BackendUrl}/webinar/register`,
        { webinarId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (zoomLink) {
        window.open(zoomLink, '_blank');
      }
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error === 'Already registered for this webinar') {
        if (zoomLink) {
          window.open(zoomLink, '_blank');
        }
      } else {
        console.error('Registration error:', err);
        alert(axios.isAxiosError(err) ? err.response?.data?.error || 'Registration failed' : 'Registration failed');
      }
    }
  };

  const handleYogaPage = () => {
    navigate("/schedule");
  }

  const isRegistered = (webinarId: string) => {
    try {
      return Array.isArray(registeredWebinars) && registeredWebinars.some(w => w?.id === webinarId);
    } catch {
      return false;
    }
  };

  const getRegisteredUpcoming = () => {
    try {
      if (!Array.isArray(registeredWebinars)) return [];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      return registeredWebinars
        .filter(webinar => {
          try {
            return webinar && new Date(webinar.date) >= startOfToday;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          } catch {
            return 0;
          }
        });
    } catch (err) {
      console.error('Error filtering registered webinars:', err);
      return [];
    }
  };

  const registeredEvents = getRegisteredUpcoming();

  // ✅ Error state display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white shadow-lg">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className='flex justify-between gap-4 items-center'>
                <img src={FMC} alt="Logo" className='w-10 h-10 rounded-full' />
                <div className='block lg:hidden'>
                  <div className="text-lg font-bold">FMC</div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold">FINITE MARSHALL CLUB</div>
                <div className="text-xs text-blue-200">Next Level Wellness Today</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfileMenu onSignout={handleSignout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 md:px-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center lg:text-left">
          <div>
            <div className="mb-6">
            <h1 className="text-2xl flex justify-start md:text-4xl font-bold text-gray-900 mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {username}! 👋
            </h1>
            <p className="text-md text-left text-gray-600">
              Ready to expand your knowledge today? Check out your upcoming webinars below.
            </p>
          </div>
           <div className="flex justify-center lg:justify-end lg:-mt-20 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Calendar1 className="w-6 h-6" />
              View Schedule
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-6 items-center justify-center">
            <LoyaltyCard coins={user?.coins || 0} username={username} />
              <div className="flex-1 max-w-4xl">
                <NotificationSliderDesktop 
                  webinars={webinars} 
                  userPackageId={user?.packageId}
                  handleRegister={handleRegisterAndJoin} 
                />
              </div>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <NotificationSliderMobile 
              webinars={webinars} 
              handleRegister={handleRegisterAndJoin} 
            />
          </div>
        </section>

        {/* Stats Cards */}
        <UserStatsCards userCoins={user?.coins || 0} />

          {/* Content Tabs */}
          <section>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="bg-white rounded-lg shadow-sm p-1">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="registered" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Registered ({registeredEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                  Past ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Tab */}
              <TabsContent value="upcoming" className="mt-6">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Upcoming Webinars</h3>
                    <p className="text-gray-500">Check back later for new webinars</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {upcomingEvents.map(event => {
                      if (!event?.id) return null;
                      return (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                          <EventCard 
                            title={event.title || 'Untitled'}
                            image={getFullThumbnailUrl(event.thumbnail)}
                            price={event.package?.name || 'Free'}
                            PlayNow="Join"
                            date={new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          />
                          
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium text-xs">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="mx-1">•</span>
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium text-xs">
                                {new Date(event.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => handleRegisterAndJoin(event.id, event.zoomLink)}
                              className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Register & Join
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* ✅ Registered Tab */}
              <TabsContent value="registered" className="mt-6">
                {registeredEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Registered Webinars</h3>
                    <p className="text-gray-500">Register for upcoming webinars to see them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {registeredEvents.map(event => {
                      if (!event?.id) return null;
                      return (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border-2 border-green-200">
                          <div className="relative">
                            <img 
                              src={getFullThumbnailUrl(event.thumbnail)} 
                              alt={event.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Registered
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                              {event.title || 'Untitled'}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="mx-1">•</span>
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs">
                                {new Date(event.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                            
                            {event.package?.name && (
                              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-3">
                                {event.package.name}
                              </div>
                            )}
                            
                            <button
                              onClick={() => event.zoomLink && window.open(event.zoomLink, '_blank')}
                              className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 text-sm"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Join Webinar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Past Tab */}
              <TabsContent value="past" className="mt-6">
                {pastEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Past Webinars</h3>
                    <p className="text-gray-500">Your attended webinars will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pastEvents.map(event => {
                      if (!event?.id) return null;
                      return (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden opacity-90 hover:opacity-100 transition">
                          <div className="relative">
                            <img 
                              src={getFullThumbnailUrl(event.thumbnail)} 
                              alt={event.title}
                              className="w-full h-48 object-cover grayscale"
                            />
                            <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-3 py-1 rounded-full">
                              Completed
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                              {event.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="mx-1">•</span>
                              <span className="text-xs">
                                {new Date(event.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                            
                            {event.package?.name && (
                              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-3">
                                {event.package.name}
                              </div>
                            )}
                            
                            <button
                              disabled
                              className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                            >
                              Event Ended
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>


        <DisplayAllProducts />

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">My Coins</span>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 border-purple-200 hover:bg-purple-50">
              <div className="flex flex-col items-center text-purple-600">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Events</span>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 border-green-200 hover:bg-green-50">
              <div className="flex flex-col items-center text-green-600">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
                <span className="text-sm font-medium">Club News</span>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 border-red-200 hover:bg-red-50">
              <div className="flex flex-col items-center text-red-600">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Support</span>
              </div>
            </Button>
          </div>
        </section>
         {/* Modal Component */}
      <YogaScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={false}
      />
    

        {showLoader && (
          <LoadingScreen
            isLoading={loading}
            onFinish={() => setShowLoader(false)}
          />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
