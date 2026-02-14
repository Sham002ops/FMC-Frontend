// pages/SuperAdminDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { Processing } from '@/components/ui/icons/Processing';
import { useToast } from '@/components/ui/use-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Package, Shield, UserPlus, Video, Users } from 'lucide-react';

// ✅ Import all modals from Admin
import RegisterExecutive from '@/components/adminComponents/RegisterExecutive';
import RegAdmin from '@/components/adminComponents/RegAdmin';
import RegUser from '@/components/adminComponents/RegUser';
import RegMentor from '@/components/adminComponents/RegMentor';
import CreateWebinar from '@/components/adminComponents/CreateWebinar';
import CreatePackage from '@/components/adminComponents/CreatePackage';

// SuperAdmin components
import SuperAdminHeader from '@/components/SuperAdminComponents/SuperAdminHeader';
import SuperAdminStats from '@/components/SuperAdminComponents/SuperAdminStats';
import PendingRegistrationsTable from '@/components/SuperAdminComponents/PendingRegistrationsTable';
import RegistrationStatsChart from '@/components/SuperAdminComponents/RegistrationStatsChart';
import RecentApprovals from '@/components/SuperAdminComponents/RecentApprovals';
import SuperSidebar from '@/components/SuperAdminComponents/superSidebar';
import MobileSupSidebar from '@/components/SuperAdminComponents/MobSupSidebar';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);

  // ✅ Modal states (same as Admin Dashboard)
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openAdminModel, setOpenAdminModel] = useState(false);
  const [openExecutiveModel, setOpenExecutiveModel] = useState(false);
  const [openMentorModel, setOpenMentorModel] = useState(false);
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  const [openPackageModel, setOpenPackageModel] = useState(false);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Verify SuperAdmin
      const userRes = await axios.get(`${BackendUrl}/auth/verifyToken`, {
        headers: { Authorization: `Bearer ${token}` }
      });
     console.log("role at SA: ", userRes.data.user.role );

      // if (userRes.data.user.role !== 'SUPER_ADMIN') {
        
      //   console.log("role at SA: ", userRes.data.user.role );
        

      //   navigate('/unauthorized');
      //   return;
      // }

      setUser(userRes.data.user);

      // Fetch SuperAdmin-specific data
      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${BackendUrl}/superadmin/pending-registrations/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BackendUrl}/superadmin/pending-registrations?status=PENDING&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setPendingRegistrations(pendingRes.data.registrations);

    } catch (err) {
      console.error('Error fetching SuperAdmin data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <SuperSidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSupSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col min-h-screen ml-0 transition-all duration-300">
        
        {/* Header */}
        <SuperAdminHeader user={user} onSignout={handleSignout} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 lg:ml-20 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* ✅ ALL MODALS (Same as Admin Dashboard) */}
            {openUserModel && <RegUser setOpenUserModel={setOpenUserModel} />}
            {openAdminModel && <RegAdmin setOpenAdminModel={setOpenAdminModel} />}
            {openExecutiveModel && <RegisterExecutive setOpenExecutiveModel={setOpenExecutiveModel} />}
            {openMentorModel && <RegMentor setOpenMentorModel={setOpenMentorModel} />}
            {openWebinarModel && <CreateWebinar setOpenWebinarModel={setOpenWebinarModel} />}
            {openPackageModel && <CreatePackage setOpenPackageModel={setOpenPackageModel} />}

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome back, {user?.name} 👋
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    SuperAdmin Control Center - Manage platform operations
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ QUICK ACTION BUTTONS (Same layout as Admin Dashboard) */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Quick Actions
              </h2>

              {/* Mobile View - Compact Icon Buttons */}
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
                
                <button
                  onClick={() => setOpenAdminModel(true)}
                  className="relative bg-white group hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-lg w-20"
                  title="Register Admin">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex flex-col justify-center border-blue-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Shield className="w-5 h-6" />
                    <span className="text-[9px] leading-tight">Admin</span>
                  </span>
                </button>
                
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

              {/* Desktop View - Full Text Buttons */}
              <div className='hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3'>
                <button 
                  onClick={() => setOpenUserModel(true)}
                  className="relative bg-white group hover:bg-teal-700 hover:text-white text-teal-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-teal-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-teal-500 font-bold group-hover:text-white transition-colors duration-300">
                    <UserPlus className="w-5 h-5" />
                    <span>Register User</span>
                  </span>
                </button>
                
                <button 
                  onClick={() => setOpenAdminModel(true)}
                  className="relative bg-white group hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <span className="flex justify-center border-blue-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">
                    <Shield className="w-5 h-5" />
                    <span>Register Admin</span>
                  </span>
                </button>
                
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

            {/* Statistics Cards */}
            <SuperAdminStats stats={stats} />

            {/* Tabs Section */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="bg-white border border-gray-200 shadow-sm">
                <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Pending Registrations ({stats?.pending || 0})
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Recent Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                <PendingRegistrationsTable
                  registrations={pendingRegistrations}
                  onRefresh={fetchSuperAdminData}
                />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <RegistrationStatsChart stats={stats} />
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <RecentApprovals />
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
