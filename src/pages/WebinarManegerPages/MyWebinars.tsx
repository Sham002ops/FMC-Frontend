import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';
import WebinarCard from '@/components/adminComponents/WebinarCard';
import { Plus, Calendar, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MentorSidebar from '@/components/MentorComponents/MentorSidebar';
import MentorMobileSidebar from '@/components/MentorComponents/MobMentorSideBar';
import CreateWebinarByMentor from '@/components/MentorComponents/CreateWebinarByMentor';

interface Webinar {
  id: string;
  title: string;
  description?: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageId: string;
  createdBy: string;
  package?: { id: string; name: string };
}

const MyWebinars: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myWebinars, setMyWebinars] = useState<Webinar[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  

  useEffect(() => {
    fetchMyWebinars();
  }, []);

  // Update fetchMyWebinars to use mentor-specific route
const fetchMyWebinars = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    // Get current user info
    const userRes = await axios.get(`${BackendUrl}/auth/verifyToken`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userRes.data.user);
    
    // Verify role
    if (userRes.data.user.role !== "MENTOR" && userRes.data.user.role !== "ADMIN") {
      navigate("/unauthorized");
      return;
    }

    // ✅ Use mentor-specific webinars endpoint (already filtered by createdBy)
    const response = await axios.get(`${BackendUrl}/mentor/webinars`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // No need to filter - backend already returns only mentor's webinars
    const mentorWebinars = response.data || [];
    setMyWebinars(mentorWebinars);
    
  } catch (error: any) {
    console.error("Error fetching webinars:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      navigate("/login");
    }
    setMyWebinars([]);
  } finally {
    setLoading(false);
  }
};


  const fullThumb = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BackendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // Filter webinars based on selected filter
  const getFilteredWebinars = () => {
    const now = new Date();
    
    switch(filter) {
      case 'upcoming':
        return myWebinars.filter(w => new Date(w.date) >= now);
      case 'past':
        return myWebinars.filter(w => new Date(w.date) < now);
      default:
        return myWebinars;
    }
  };

  const filteredWebinars = getFilteredWebinars();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <MentorSidebar />
        </div>
        <div className="block lg:hidden">
          <MentorMobileSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6 md:px-8 overflow-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                My Webinars
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your {myWebinars.length} webinar{myWebinars.length !== 1 ? 's' : ''}
              </p>
            </div>
            {openWebinarModel && (
                          <CreateWebinarByMentor 
                            setOpenWebinarModel={setOpenWebinarModel}  
                          />
                        )}
            
            <button
              onClick={() => setOpenWebinarModel(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition shadow-md"
            >
              <Plus className="w-5 h-5" />
              Create Webinar
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Video className="w-4 h-4" />
                All ({myWebinars.length})
              </span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'upcoming' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming ({myWebinars.filter(w => new Date(w.date) >= new Date()).length})
              </span>
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'past' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Past ({myWebinars.filter(w => new Date(w.date) < new Date()).length})
              </span>
            </button>
          </div>

          {/* Webinars Grid */}
          {filteredWebinars.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No webinars yet' : `No ${filter} webinars`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "Start by creating your first webinar"
                  : `You don't have any ${filter} webinars`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => navigate('/webinar-manager/create')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Create Your First Webinar
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Cards (sm and up) */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWebinars.map((w) => (
                    <WebinarCard
                      key={w.id}
                      webinar={w}
                      onUpdated={(updated) =>
                        setMyWebinars((prev) => 
                          prev.map(x => x.id === updated.id ? { ...x, ...updated } : x)
                        )
                      }
                      onDeleted={(id) =>
                        setMyWebinars((prev) => prev.filter(x => x.id !== id))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Mobile stacked cards */}
              <div className="sm:hidden space-y-4">
                {filteredWebinars.map(w => (
                  <WebinarCard
                    key={w.id}
                    webinar={w}
                    onUpdated={(updated) =>
                      setMyWebinars(prev => 
                        prev.map(x => x.id === updated.id ? { ...x, ...updated } : x)
                      )
                    }
                    onDeleted={(id) =>
                      setMyWebinars(prev => prev.filter(x => x.id !== id))
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* Stats Footer */}
          {myWebinars.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{myWebinars.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {myWebinars.filter(w => new Date(w.date) >= new Date()).length}
                  </p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    {myWebinars.filter(w => new Date(w.date) < new Date()).length}
                  </p>
                  <p className="text-sm text-gray-600">Past</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyWebinars;
