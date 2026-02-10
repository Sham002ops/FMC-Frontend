// pages/AdminPages/AdminDashboard.tsx
import { useNavigate } from 'react-router-dom'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import RegisterExecutive from '@/components/adminComponents/RegisterExecutive';
// ❌ REMOVED: import RegAdmin from '@/components/adminComponents/RegAdmin';
import { BackendUrl } from '@/Config';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import CreateWebinar from '@/components/adminComponents/CreateWebinar';
import RegUser from '@/components/adminComponents/RegUser';
import { Briefcase, Package, UserPlus, Video } from 'lucide-react'; // ❌ REMOVED: Shield
import AdminDashboardStats from '@/components/adminComponents/AdminDashboardStats';
import CreatePackage from '@/components/adminComponents/CreatePackage';
import RegMentor from '@/components/adminComponents/RegMentor';
import AdminProfileMenu from '@/components/adminComponents/AdminProfileMenu';
import FMC from '../../assets/FMC2.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // ❌ REMOVED: const [openAdminModel, setOpenAdminModel] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  const [openMentorModel, setOpenMentorModel] = useState(false);
  const [openPackageModel, setOpenPackageModel] = useState(false);
  const [openExecutiveModel, setOpenExecutiveModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Verify user token and role
        const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        setUsername(res.data.user.name);
        
        if (res.data.user.role !== "ADMIN" ) {
          navigate("/unauthorized");
          return;
        }
        if (res.data.user.role !== "ADMIN" ) {
          navigate("/unauthorized");
          return;
        }

        // Fetch webinars after user validation
        const webinarsRes = await axios.get(`${BackendUrl}/webinar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWebinars(webinarsRes.data);
      } catch (err) {
        console.log("Error fetching data:", err);
        setUser(null);
        setWebinars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isUpcomingOrToday = (iso: string | Date) => {
    const when = new Date(iso);
    if (!Number.isFinite(when.getTime())) return false;
    return when >= startOfToday();
  };

  const upcomingWebinars = Array.isArray(webinars)
    ? webinars.filter(w => isUpcomingOrToday(w.date))
    : [];

  if (loading) {
    return <div className="justify-center items-center flex min-h-screen text-center"><Processing /></div>;
  }

  const handleSignout = async () => {
    try {
      await axios.post(`${BackendUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loggedIn");
      navigate("/landing-page");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/landing-page");
    }
  };

  const fullThumb = (path?: string) => {
    if (!path) return '/placeholder-image.png';
    return path.startsWith('http') ? path : `${BackendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 w-full flex flex-col min-h-screen ml-0 transition-all duration-300">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-700 to-green-400 fixed text-white shadow-lg z-40 w-full">
          <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
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
              <AdminProfileMenu onSignout={handleSignout} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-slate-300 p-3 mt-16 sm:p-4 lg:p-6 lg:ml-20 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            
            {/* Modals */}
            {openWebinarModel && <CreateWebinar setOpenWebinarModel={setOpenWebinarModel} />}
            {openMentorModel && <RegMentor setOpenMentorModel={setOpenMentorModel} />}
            {openPackageModel && <CreatePackage setOpenPackageModel={setOpenPackageModel} />}
            {openExecutiveModel && <RegisterExecutive setOpenExecutiveModel={setOpenExecutiveModel} />}
            {/* ❌ REMOVED: {openAdminModel && <RegAdmin setOpenAdminModel={setOpenAdminModel} />} */}
            {openUserModel && <RegUser setOpenUserModel={setOpenUserModel} />}

            {/* Profile and Action Buttons */}
            <div className="w-full mb-6 sm:mb-8 flex flex-col lg:flex-row justify-between lg:justify-center gap-4 lg:gap-40 items-start lg:items-center">
              {/* User Profile Card */}
              <div className='flex lg:h-[135px] items-center ml-12 lg-ml-0 pl-5 gap-4 sm:gap-6 bg-white rounded-lg shadow-sm p-4 border-l-4 border-event-primary'>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md flex-shrink-0">
                  {username ? username.charAt(0).toUpperCase() : 'A'}
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h2 className='text-gray-800 font-bold text-xl sm:text-2xl lg:text-3xl truncate max-w-[180px] sm:max-w-[240px]'>
                      {user?.name ? user.name : 'Loading...'}
                    </h2>
                    <span className='px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm'>
                      {user?.role ? user.role.toUpperCase() : "ADMIN"}
                    </span>
                  </div>

                  <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-4-4m4 4l-4 4" />
                    </svg>
                    <span className='truncate max-w-[140px] sm:max-w-[180px]'>{user?.email || "–"}</span>
                  </div>

                  <div className='flex items-center gap-2 text-xs sm:text-sm text-yellow-700 font-semibold'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="gold">₹</text>
                    </svg>
                    <span>Coins:&nbsp;{user?.coins?.toLocaleString() ?? "–"}</span>
                  </div>
                </div>
              </div>

              {/* Mobile View - Compact Icon Buttons (5 buttons now) */}
              <div className='flex sm:hidden flex-row gap-2 w-full justify-center flex-wrap'>
                <button
                  onClick={() => setOpenUserModel(true)}
                  className="relative bg-white group hover:bg-teal-700 hover:text-white text-teal-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Register User">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-teal-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-teal-500 font-bold group-hover:text-white transition-colors duration-300">
                    <UserPlus className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">User</span>
                  </span>
                </button>
                
                {/* ❌ REMOVED: Register Admin Button */}
                
                <button
                  onClick={() => setOpenExecutiveModel(true)}
                  className="relative bg-white group hover:bg-orange-700 hover:text-white text-orange-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Register Executive">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-orange-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-orange-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Briefcase className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">Executive</span>
                  </span>
                </button>
                
                <button
                  onClick={() => setOpenMentorModel(true)}
                  className="relative bg-white group hover:bg-purple-700 hover:text-white text-purple-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Register Mentor">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-purple-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-purple-500 font-bold group-hover:text-white transition-colors duration-300">
                    <UserPlus className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">Mentor</span>
                  </span>
                </button>

                <button
                  onClick={() => setOpenWebinarModel(true)}
                  className="relative bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Create Webinar">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-green-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Video className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">Webinar</span>
                  </span>
                </button>

                <button
                  onClick={() => setOpenPackageModel(true)}
                  className="relative bg-white group hover:bg-indigo-700 hover:text-white text-indigo-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Create Package">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-indigo-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-indigo-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Package className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">Package</span>
                  </span>
                </button>
              </div>

              {/* Desktop View - Full Text Buttons (5 buttons now) */}
              <div className='hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3 w-full sm:w-auto lg:w-[680px]'>
                <button 
                  onClick={() => setOpenUserModel(true)}
                  className="relative bg-white group hover:bg-teal-700 hover:text-white text-teal-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-teal-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-teal-500 font-bold group-hover:text-white transition-colors duration-300">
                    <UserPlus className="w-5 h-5" />
                    <span>Register User</span>
                  </span>
                </button>
                
                {/* ❌ REMOVED: Register Admin Button */}
                
                <button 
                  onClick={() => setOpenExecutiveModel(true)}
                  className="relative bg-white group hover:bg-orange-700 hover:text-white text-orange-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-orange-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-orange-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Briefcase className="w-5 h-5" />
                    <span>Register Executive</span>
                  </span>
                </button>

                <button 
                  onClick={() => setOpenMentorModel(true)}
                  className="relative bg-white group hover:text-white text-purple-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-purple-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-purple-500 font-bold group-hover:text-white transition-colors duration-300">
                    <UserPlus className="w-5 h-5" />
                    <span>Register Mentor</span>
                  </span>
                </button>
                
                <button 
                  onClick={() => setOpenWebinarModel(true)}
                  className="relative bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-green-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Video className="w-5 h-5" />
                    <span>Create Webinar</span>
                  </span>
                </button>

                <button 
                  onClick={() => setOpenPackageModel(true)}
                  className="relative bg-white group hover:bg-indigo-700 hover:text-white text-indigo-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-indigo-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-indigo-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Package className="w-5 h-5" />
                    <span>Create Package</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-8">
              <AdminDashboardStats />
            </div>

            {/* Webinars Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="overflow-x-auto mb-4 sm:mb-6">
                <TabsList className="bg-gray-100 flex w-full min-w-max">
                  <TabsTrigger value="upcoming" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                    Upcoming Webinars
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="upcoming">
                {fetchLoading ? (
                  <div className="flex justify-center items-center py-10"><Processing /></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {upcomingWebinars.length === 0 ? (
                      <div className="text-gray-500 text-center col-span-full py-8">
                        No upcoming webinars found.
                      </div>
                    ) : (
                      upcomingWebinars.map((webinar) => (
                        <EventCard
                          key={webinar.id}
                          title={webinar.title}
                          image={fullThumb(webinar.thumbnail)}
                          price={webinar.package?.name || webinar.packageId}
                          PlayNow="Join"
                          date={new Date(webinar.date).toLocaleDateString()}
                          zoomLink={webinar.zoomLink}
                        />
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
