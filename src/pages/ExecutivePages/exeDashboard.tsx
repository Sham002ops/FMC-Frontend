import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import ExeSidebar from '@/components/ExeSideBar';
import ExecutiveMobileSidebar from '@/components/MobExeSidebar';
import RegUser from '@/components/adminComponents/RegUser';

interface TopicCardProps {
  title: string;
  image: string;
  description: string;
  color: string;
}

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageId: string | null;
  executiveRefode: string | null;
  role: string;
  createdAt?: string;
}

interface DashboardStats {
  totalReferredUsers: number;
  thisMonthReferrals: number;
  pendingApprovals: number;
  totalCommission: number;
  pendingCommission: number;
  monthlyGrowth: number;
}

const TopicCard = ({ title, image, description, color }: TopicCardProps) => (
  <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
    <img src={image} alt={title} className="w-full h-36 object-cover" />
    <div className="p-4">
      <h3 className={`text-lg font-semibold mb-1 ${color} text-white px-2 py-1 inline-block rounded`}>{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [executive, setExecutive] = useState(null);
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  
  // Real data states
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalReferredUsers: 0,
    thisMonthReferrals: 0,
    pendingApprovals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    monthlyGrowth: 0
  });
  const [dataLoading, setDataLoading] = useState(false);

  // Function to calculate commission based on package
  const calculateCommission = (users: ReferredUser[]) => {
    return users.reduce((total, user) => {
      // Define commission rates based on package
      const commissionRates: { [key: string]: number } = {
        'Gold': 500,
        'Elite': 1000,
        'Platinum': 1500,
        'Silver': 300
      };
      
      // Get package name or use default
      const packageName = user.packageId || 'Basic';
      return total + (commissionRates[packageName] || 200);
    }, 0);
  };

  // Function to calculate monthly growth
  const calculateMonthlyGrowth = (users: ReferredUser[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthUsers = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
    });

    const lastMonthUsers = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === lastMonth && userDate.getFullYear() === lastMonthYear;
    });

    if (lastMonthUsers.length === 0) {
      return thisMonthUsers.length > 0 ? 100 : 0;
    }

    return Math.round(((thisMonthUsers.length - lastMonthUsers.length) / lastMonthUsers.length) * 100);
  };

  // Fetch referred users data
  const fetchReferredUsers = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BackendUrl}/executive/get-ref-users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const users = response.data.AllRefUsers || [];
      setReferredUsers(users);

      // Calculate stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthUsers = users.filter(user => {
        if (!user.createdAt) return false;
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      });

      const totalCommission = calculateCommission(users);
      const monthlyGrowth = calculateMonthlyGrowth(users);

      setStats({
        totalReferredUsers: users.length,
        thisMonthReferrals: thisMonthUsers.length,
        pendingApprovals: Math.floor(thisMonthUsers.length * 0.3), // Assume 30% pending
        totalCommission: totalCommission,
        pendingCommission: Math.floor(totalCommission * 0.2), // 20% pending
        monthlyGrowth: monthlyGrowth
      });

    } catch (error) {
      console.error('Error fetching referred users:', error);
      setReferredUsers([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const fetchExecutiveDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExecutive(res.data.user);
        setUsername(res.data.user.name);
        const role = res.data.user.role;
        if (role !== "EXECUTIVE") {
          navigate("/unauthorized");
          return;
        }

        // Fetch referred users after successful authentication
        await fetchReferredUsers();

      } catch (err) {
        console.log("Error fetching user details:", err);
        setExecutive(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutiveDetails();
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReferredUsers();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  const handleSignout = async () => {
    try {
      await axios.post(`${BackendUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.removeItem("token");
      navigate("/landing-page");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("token");
      navigate("/landing-page");
    }
  };

  // Convert referred users to active referrals format
  const activeReferrals = referredUsers.slice(0, 5).map((user, index) => ({
    id: user.id,
    name: user.name,
    joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently',
    package: user.packageId || 'Basic',
    status: index % 3 === 0 ? 'Pending' : 'Active'
  }));

  // Executive Specific Data
  const upcomingHostedWebinars = [
    { id: 1, title: 'Leadership Skills Workshop', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCLqACgwJCaNke7pFGSrSjm-87-MXT5qeZMA&s", price: 'Free', PlayNow: "Manage", date: 'Aug 20, 2025' },
    { id: 2, title: 'Advanced Sales Strategies', image: "https://embed-ssl.wistia.com/deliveries/f4d4a655755c9c037fc1ef9526916bac8a86aba7.webp?image_crop_resized=1280x720", price: 'Premium', PlayNow: "Manage", date: 'Sep 1, 2025' },
  ];

  const trainingModules = [
    { title: "Team Management", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400", description: "Guide to managing your referrals effectively", color: "bg-green-500" },
    { title: "Recruitment Tips", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Best practices for recruiting active members", color: "bg-blue-500" },
  ];

  return (
    <div className="min-h-screen relative bg-gray-50">
      <div className="transition-transform absolute duration-300">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ExeSidebar />
        </div>
        <div className="block lg:hidden">
          <ExecutiveMobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-green-400 z-40 text-white shadow-lg">
        <div className="container mx-auto py-4 px-4 md:px-6 flex lg:pl-28 justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size="small" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Executive Dashboard</h1>
              <p className="text-sm text-blue-100">Welcome back, {username}</p>
            </div>
          </div>
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {username?.charAt(0).toUpperCase() || 'E'}
              </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
                      {username?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        EXECUTIVE
                      </span>
                    </div>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSignout}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto lg:pl-28 py-6 px-4">
        {/* Welcome Section */}
        <div className='flex justify-between items-center'>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {username}! 👋
            </h1>
            <p className="text-gray-600">Here's your performance overview and recent activities.</p>
            {dataLoading && (
              <p className="text-blue-600 text-sm flex items-center gap-2">
                <Processing />
                Refreshing data...
              </p>
            )}
          </div>
          
          {openUserModel && <RegUser setOpenUserModel={setOpenUserModel} />}

          <div className='-mt-8'>
            <button 
              onClick={() => setOpenUserModel(true)}
              className="relative bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
              <span className="flex justify-center border-green-500 border-2 items-center rounded-lg gap-2 px-4 py-2 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                Register User
              </span>
            </button>
          </div>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Referred Users</h3>
                <p className="text-3xl font-bold">{stats.totalReferredUsers}</p>
                <p className="text-xs opacity-75 mt-1">
                  {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">This Month's Referrals</h3>
                <p className="text-3xl font-bold text-green-600">{stats.thisMonthReferrals}</p>
                <p className="text-xs text-green-600 mt-1">{stats.pendingApprovals} pending approval</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Commission</h3>
                <p className="text-3xl font-bold text-yellow-600">₹{stats.totalCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">₹{stats.pendingCommission.toLocaleString()} pending</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Training Webinars</h3>
                <p className="text-3xl font-bold text-purple-600">{upcomingHostedWebinars.length}</p>
                <p className="text-xs text-gray-500 mt-1">Next: Aug 20</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Alert */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl text-white mb-8 shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {stats.monthlyGrowth > 15 ? 'Excellent Performance! 🎉' : 
                 stats.monthlyGrowth > 0 ? 'Good Progress! 📈' : 'Keep Going! 💪'}
              </h3>
              <p className="text-sm opacity-90">
                {stats.monthlyGrowth > 15 
                  ? `You're ${stats.monthlyGrowth}% above target. Keep up the great work!`
                  : stats.monthlyGrowth > 0 
                    ? `${stats.monthlyGrowth}% growth this month. You're on track!`
                    : 'Focus on recruiting new users to boost your performance!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="referrals" className="w-full">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <TabsList className="bg-gray-100 w-full h-12">
              <TabsTrigger value="referrals" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                My Referrals
              </TabsTrigger>
              <TabsTrigger value="webinars" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Hosted Webinars
              </TabsTrigger>
              <TabsTrigger value="training" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Training Modules
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="referrals" className="mt-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Active Referrals</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {activeReferrals.length} showing
                  </span>
                  <button 
                    onClick={fetchReferredUsers}
                    disabled={dataLoading}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                  >
                    {dataLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {activeReferrals.length > 0 ? activeReferrals.map(referral => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{referral.name}</h4>
                        <p className="text-sm text-gray-500">Joined {referral.joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.package === 'Elite' ? 'bg-purple-100 text-purple-800' : 
                        referral.package === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.package}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {referral.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No referrals yet. Start recruiting users to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webinars" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHostedWebinars.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="training" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingModules.map((topic, idx) => <TopicCard key={idx} {...topic} />)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Button 
            onClick={() => navigate('/executive/referrals')}
            className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">View Referrals</span>
            </div>
          </Button>
          
          <Button variant="outline" className="h-16 border-2 border-green-200 hover:bg-green-50">
            <div className="flex flex-col items-center text-green-600">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Manage Webinars</span>
            </div>
          </Button>
          
          <Button variant="outline" className="h-16 border-2 border-yellow-200 hover:bg-yellow-50">
            <div className="flex flex-col items-center text-yellow-600">
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Commission</span>
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
      </main>
    </div>
  );
};

export default ExecutiveDashboard;
