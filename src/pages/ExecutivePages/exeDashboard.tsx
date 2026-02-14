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
import FMC from '../../assets/FMC2.png';
import { PerformanceTimelineChart } from '@/components/ExecutiveComponents/PerformanceTimelineChart';
import { PackageDistributionChart } from '@/components/ExecutiveComponents/PackageDistributionChart';
import { RecentActivityFeed } from '@/components/ExecutiveComponents/RecentActivityFeed';
import { LeaderboardRankCard } from '@/components/ExecutiveComponents/LeaderboardRankCard';
import { TargetProgressBar } from '@/components/ExecutiveComponents/TargetProgressBar';
import { RefreshCw, UserPlus } from 'lucide-react';
import ExecutiveRegisterUser from '@/components/ExecutiveComponents/ExecutiveRegisterUser';
import ExecutiveProfileMenu from '@/components/ExecutiveComponents/ExecutiveProfileModal';

interface DashboardData {
  executive: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
  };
  stats: {
    totalReferrals: number;
    thisMonthReferrals: number;
    lastMonthReferrals: number;
    totalRevenue: number;
    monthRevenue: number;
    growth: number;
    rank: number;
    totalExecutives: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    packageName: string | null;
    createdAt: string;
  }>;
  packageDistribution: Record<string, number>;
  timeline: Array<{
    date: string;
    totalUsers: number;
    newUsers: number;
  }>;
}

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [executive, setExecutive] = useState(null);
  const [username, setUsername] = useState<string>('Executive');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BackendUrl}/executive/exe-dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardData(response.data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Initial auth and data fetch
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/landing-page');
          return;
        }

        const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = res.data.user;
        setExecutive(user);
        setUsername(user.name);

        if (user.role !== "EXECUTIVE") {
          navigate("/unauthorized");
          return;
        }

        await fetchDashboardData();
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        navigate('/landing-page');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalReferrals: 0,
    thisMonthReferrals: 0,
    lastMonthReferrals: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    growth: 0,
    rank: 0,
    totalExecutives: 0,
  };

  const MONTHLY_TARGET = 20;

  return (
    <div className="min-h-screen relative bg-gray-50">
      <div className="transition-transform absolute duration-300">
        <div className="hidden lg:block">
          <ExeSidebar />
        </div>
        <div className="block lg:hidden">
          <ExecutiveMobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-green-500 z-40 text-white shadow-lg fixed top-0 left-0 w-full">
        <div className="container mx-auto py-4 px-4 md:px-6 flex lg:pl-10 justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={FMC} alt="Logo" className='w-10 h-10 rounded-full' />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Executive Dashboard</h1>
              <p className="text-xs text-indigo-100">Next Level Wellness Today</p>
            </div>
          </div>
           <ExecutiveProfileMenu onSignout={handleSignout} />

        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto lg:pl-28 mt-10 py-6 px-4">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 mb-6">
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 mb-1 text-xl xs:text-2xl pl-10 md:pl-0 lg:pl-0 sm:text-2xl md:text-3xl leading-snug">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {username}! 👋
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Here's your real-time performance overview
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleRefresh}
                disabled={dataLoading}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                {dataLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <span className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* ✅ UPDATED REGISTER BUTTON */}
          <div className="w-full sm:w-auto">
            <button 
              onClick={() => setOpenUserModel(true)}
              className="group relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register User</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* ✅ NEW REGISTRATION MODAL */}
        {openUserModel && (
          <ExecutiveRegisterUser
            setOpenUserModel={setOpenUserModel} 
            refreshUser={fetchDashboardData}
          />
        )}

        {/* Top Row: Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Referrals */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Total Referrals</h3>
                <p className="text-3xl font-bold">{stats.totalReferrals}</p>
                <p className="text-xs opacity-75 mt-1">
                  {stats.growth > 0 ? '+' : ''}{stats.growth.toFixed(1)}% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* This Month */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="text-3xl font-bold text-green-600">{stats.thisMonthReferrals}</p>
                <p className="text-xs text-gray-500 mt-1">
                  vs {stats.lastMonthReferrals} last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-3xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">₹{stats.monthRevenue.toLocaleString()} this month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Rank */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Your Rank</h3>
                <p className="text-3xl font-bold text-purple-600">#{stats.rank}</p>
                <p className="text-xs text-gray-500 mt-1">of {stats.totalExecutives} executives</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Alert */}
 
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <LeaderboardRankCard
              rank={stats.rank}
              totalExecutives={stats.totalExecutives}
              growth={stats.growth}
            />
          </div>

          <div className="lg:col-span-2">
            <PerformanceTimelineChart data={dashboardData?.timeline || []} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PackageDistributionChart distribution={dashboardData?.packageDistribution || {}} />

          <TargetProgressBar
            current={stats.thisMonthReferrals}
            target={MONTHLY_TARGET}
            label="Monthly Referrals"
          />
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <RecentActivityFeed users={dashboardData?.recentUsers || []} />
        </div>
      </main>
    </div>
  );
};

export default ExecutiveDashboard;
