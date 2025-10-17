import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import CreateWebinar from '@/components/adminComponents/CreateWebinar';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Edit, 
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import WebinarManagerSidebar from '@/components/MentorComponents/MentorSidebar';
import MentorMobileSidebar from '@/components/MentorComponents/MobMentorSideBar';
import CreateWebinarByMentor from '@/components/MentorComponents/CreateWebinarByMentor';

interface Webinar {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  zoomLink: string;
  packageId: string;
  createdBy: string; // ← Added this
  package?: {
    name: string;
  };
  createdAt: string;
  isActive?: boolean;
}

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [myWebinars, setMyWebinars] = useState<Webinar[]>([]); // ← Only mentor's webinars
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    thisMonth: 0
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');

  useEffect(() => {
    fetchUserAndWebinars();
  }, []);

 // Update the delete handler and add the mentor-specific endpoint
const handleDeleteWebinar = async (webinarId: string) => {
  if (!window.confirm("Are you sure you want to delete this webinar?")) return;
  
  try {
    const token = localStorage.getItem('token');
    // ✅ Use mentor-specific delete route
    await axios.delete(`${BackendUrl}/mentor/delete-webinar/${webinarId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUserAndWebinars(); // Refresh data
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete webinar");
  }
};

// Update fetchUserAndWebinars to use mentor-specific route
const fetchUserAndWebinars = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');

    // Verify user role
    const userRes = await axios.get(`${BackendUrl}/auth/verifyToken`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userData = userRes.data.user;
    setUser(userData);
    
    // Check if user is mentor
    if (userData.role !== "MENTOR") {
      navigate("/unauthorized");
      return;
    }

    // ✅ Use mentor-specific webinars endpoint
    const webinarsRes = await axios.get(`${BackendUrl}/mentor/webinars`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const mentorWebinars = webinarsRes.data || [];
    
    setWebinars(mentorWebinars);
    setMyWebinars(mentorWebinars); // Already filtered by backend
    
    // Calculate stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const upcoming = mentorWebinars.filter((w: Webinar) => new Date(w.date) >= now).length;
    const past = mentorWebinars.filter((w: Webinar) => new Date(w.date) < now).length;
    const thisMonth = mentorWebinars.filter((w: Webinar) => {
      const webinarDate = new Date(w.date);
      return webinarDate.getMonth() === currentMonth && webinarDate.getFullYear() === currentYear;
    }).length;
    
    setStats({
      total: mentorWebinars.length,
      upcoming,
      past,
      thisMonth
    });
    
  } catch (err) {
    console.error("Error1:", err);
    // navigate("/login");
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

  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date();
  
  // ✅ Use myWebinars instead of webinars
  const upcomingWebinars = myWebinars.filter(w => isUpcoming(w.date));
  const pastWebinars = myWebinars.filter(w => !isUpcoming(w.date));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <WebinarManagerSidebar />
        </div>
        <div className="block lg:hidden">
          <MentorMobileSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-700 to-green-500 text-white shadow-lg z-40 w-full">
          <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-xl lg:text-2xl font-bold">
                <Logo size="small" />
                MENTOR DASHBOARD
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 flex items-center justify-center"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-4 top-16 w-72 bg-white rounded-xl shadow-lg z-50">
                    <div className="py-4 px-5">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-semibold">
                          {user?.name?.charAt(0).toUpperCase() || 'M'}
                        </div>
                        <div className="absolute top-2 right-4 cursor-pointer text-2xl text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>×</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{user?.name || "Mentor"}</h3>
                          <p className="text-sm text-gray-500">
                            <span className="text-green-700">• {user?.role || 'MENTOR'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 my-4" />
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="hover:text-green-600 cursor-pointer">Dashboard</li>
                        <li className="hover:text-green-600 cursor-pointer">My Webinars</li>
                        <li className="hover:text-green-600 cursor-pointer">Settings</li>
                      </ul>
                      <button
                        onClick={handleSignout}
                        className="mt-6 w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-8 lg:ml-20 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            
            {/* Create Webinar Modal */}
            {openWebinarModel && (
              <CreateWebinarByMentor 
                setOpenWebinarModel={setOpenWebinarModel}
                 // Refresh after creating
              />
            )}

            {/* Stats Cards - Now showing only mentor's webinars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">My Total Webinars</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <Video className="w-10 h-10 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">My Upcoming</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.upcoming}</p>
                  </div>
                  <Clock className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">This Month</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.thisMonth}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Past Events</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.past}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Create Webinar Button */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Webinars</h2>
              <button
                onClick={() => setOpenWebinarModel(true)}
                className="flex items-center gap-2 px-6 py-3 hover:scale-110 bg-gradient-to-r from-indigo-600 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-indigo-600 transition shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create Webinar
              </button>
            </div>

            {/* Webinar Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="bg-white rounded-lg shadow mb-6">
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming ({stats.upcoming})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Past ({stats.past})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Tab */}
              <TabsContent value="upcoming">
                {upcomingWebinars.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming webinars scheduled</p>
                    <button
                      onClick={() => setOpenWebinarModel(true)}
                      className="mt-4 px-6 py-2 hover:scale-110 transition-transform bg-gradient-to-r from-indigo-600 to-green-600 text-white rounded-lg"
                    >
                      Create Your First Webinar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingWebinars.map((webinar) => (
                      <div key={webinar.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                        <img 
                          src={fullThumb(webinar.thumbnail)} 
                          alt={webinar.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{webinar.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{webinar.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteWebinar(webinar.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <button
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Past Tab */}
              <TabsContent value="past">
                {pastWebinars.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No past webinars</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastWebinars.map((webinar) => (
                      <div key={webinar.id} className="bg-white rounded-lg shadow-md opacity-75 overflow-hidden">
                        <img 
                          src={fullThumb(webinar.thumbnail)} 
                          alt={webinar.title}
                          className="w-full h-48 object-cover grayscale"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{webinar.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => handleDeleteWebinar(webinar.id)}
                            className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* All Tab */}
              <TabsContent value="all">
                {myWebinars.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No webinars found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myWebinars.map((webinar) => (
                      <div key={webinar.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                        <img 
                          src={fullThumb(webinar.thumbnail)} 
                          alt={webinar.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{webinar.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteWebinar(webinar.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default MentorDashboard;
