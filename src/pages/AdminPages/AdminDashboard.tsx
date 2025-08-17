import { useNavigate } from 'react-router-dom'; 
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import RegisterExecutive from '@/components/adminComponents/RegisterExecutive';
import RegAdmin from '@/components/adminComponents/RegAdmin';
import { BackendUrl } from '@/Config';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import CreateWebinar from '@/components/adminComponents/CreateWebinar';

interface TopicCardProps {
  title: string;
  image: string;
  description: string;
  color: string;
}

const TopicCard = ({ title, image, description, color }: TopicCardProps) => (
  <div className={`rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white`}>
    <img src={image} alt={title} className="w-full h-32 sm:h-36 object-cover" />
    <div className="p-3 sm:p-4">
      <h3 className={`text-base sm:text-lg font-semibold mb-1 ${color} text-white px-2 py-1 inline-block rounded`}>
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [openAdminModel, setOpenAdminModel] = useState(false);
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  const [openExecutiveModel, setOpenExecutiveModel] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [topic1, setTopic1] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [sidebarModel, setSidebarModel] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false,
    isAdmin: false,
  });

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
      if (res.data.user.role !== "ADMIN") {
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
      setWebinars([]);  // fallback empty list on error
    } finally {
      setLoading(false);
    }
  };
  fetchUserDetails();
}, []);

  if (loading) {
    return <div className="justify-center items-center flex min-h-screen text-center"><Processing /></div>;
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
      navigate("/landing-page");
    }
  };

  const upcomingEvents = [
    { id: 1, title: 'AI for Beginners', image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop", price: 'Elite', PlayNow: "Join", date: 'May 15, 2025' },
    { id: 2, title: 'Stock Market Basics', image: "https://blog.shoonya.com/wp-content/uploads/2023/01/Basics-of-Stock-Market.jpg", price: 'Gold', PlayNow: "Join", date: 'May 20, 2025' },
    { id: 3, title: 'Public Speaking Masterclass', image: "https://i.ytimg.com/vi/-osimXXsaQM/maxresdefault.jpg", price: 'Elite', PlayNow: "Join", date: 'May 25, 2025' },
    { id: 4, title: 'Digital Marketing Trends', image: "https://neilpatel.com/wp-content/uploads/2024/01/11-A-2025-Digital-Marketing-Trends-Predictions-1.jpg", price: 'Platinum', PlayNow: "Join", date: 'June 5, 2025' },
  ];

  const registeredEvents = [
    { id: 5, title: 'Introduction to Crypto', image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/what-is-cryptocurrency-youtube-thumbnail-temp-design-template-733229d072c1e87fd25fad085e840654_screen.jpg?ts=1665037426", price: 'Elite', PlayNow: "Join", date: 'May 12, 2025' },
    { id: 6, title: 'Personal Finance 101', image: "https://i.ytimg.com/vi/dMwGIEzYvzU/mqdefault.jpg", price: 'Gold', PlayNow: "Join", date: 'May 18, 2025' },
  ];

  const topics = [
    {
      title: "Yoga & Meditation",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
      description: "Discover techniques for mindfulness and physical wellness",
      color: "bg-purple-500",
    },
    {
      title: "Biotechnology",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
      description: "Learn about the latest advances in biotechnology research",
      color: "bg-blue-500",
    },
    {
      title: "Mental Wellness",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
      description: "Explore strategies for better mental health and wellbeing",
      color: "bg-green-500",
    },
    {
      title: "Ayurveda",
      image: "https://rukminim3.flixcart.com/image/850/1000/xif0q/poster/p/i/l/small-poster-doctors-poster-natural-healing-ayurveda-wall-poster-original-imah38gyxxdnuhnk.jpeg?q=90&crop=false",
      description: "Discover ancient healing practices for modern wellness",
      color: "bg-amber-500",
    },
    {
      title: "Artificial Intelligence",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop",
      description: "Understand AI applications in modern life",
      color: "bg-pink-500",
    },
  ];

  const handleSidebar = () => {
    setSidebarModel(!sidebarModel);
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateWebinar = () => {
    const uniqueId = uuidv4();
    const link = `https://yourapp.com/register/${uniqueId}`;
    setRegistrationLink(link);
    console.log("Webinar Created:", { topic1, thumbnail, link });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Main Content Container - KEY FIX: Added proper left margins */}
      <div className="flex-1 flex flex-col min-h-screen ml-0  transition-all duration-300">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-700 to-green-400 text-white shadow-lg z-40 w-full">
          <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
            <div className="flex justify-between items-center">
              <div className=' flex justify-between items-center sm:text-xl gap-4 lg:text-2xl font-bold'><Logo size="small" /> FINITE MARSHALL CLUB</div>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="relative">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 flex items-center justify-center focus:outline-none"
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-xl border border-primary shadow-lg shadow-purple-300 z-50">
                      <div className="py-4 sm:py-6 px-4 sm:px-5">
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg sm:text-xl font-semibold shadow-inner">
                            U
                          </div>
                          <div className='absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4' onClick={() => setMenuOpen(false)}>×</div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold mt-2 text-gray-800">
                              {username || "DemoUser"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              <span className='text-violet-700'>• {String(user? user?.role: 'loading...').toUpperCase()}</span> • Joined Jan 2025
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 my-4" />

                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="hover:text-primary cursor-pointer transition">Dashboard</li>
                          <li className="hover:text-primary cursor-pointer transition">My Webinars</li>
                          <li className="hover:text-primary cursor-pointer transition">Settings</li>
                        </ul>

                        <button
                          onClick={handleSignout}
                          className="mt-6 w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-medium text-sm sm:text-base"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-20 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            
            {/* Create Webinar Modal */}
            {openWebinarModel && (<CreateWebinar setOpenWebinarModel={setOpenWebinarModel}/>)}

            {/* Register Executive Modal */}
            {openExecutiveModel && <RegisterExecutive setOpenExecutiveModel={setOpenExecutiveModel} />}
            
            {/* Register Admin Modal */}
            {openAdminModel && <RegAdmin setOpenAdminModel={setOpenAdminModel} />}

            {/* Profile and Action Buttons */}
            <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='text-event-primary pl-10 font-bold text-xl sm:text-2xl break-words'>
                  {username ? username.toUpperCase() : 'Loading...'}
                </div>
              </div>
              
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto'>
                <button  
                  className='bg-violet-100 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white text-blue-600 border-2 border-blue-600 text-xs sm:text-sm lg:text-base transition-colors' 
                  onClick={() => setOpenAdminModel(true)}
                >
                  Register Admin
                </button>
                <button  
                  className='bg-violet-100 px-3 sm:px-2 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-orange-600 border-2 border-orange-500 text-xs sm:text-sm lg:text-base transition-colors' 
                  onClick={() => setOpenExecutiveModel(true)}
                >
                  Register Executive
                </button>
                <button  
                  className='bg-green-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 text-white text-xs sm:text-sm lg:text-base transition-colors' 
                  onClick={() => setOpenWebinarModel(true)}
                >
                  Create Webinar
                </button>
              </div>
            </div>

            {/* Stats Cards - First Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6'>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-xl sm:text-2xl font-bold text-event-primary">138</p>
              </div>
              <div className="bg-white border-2 border-event-primary p-3 sm:p-4 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Elite Package Users</h3>
                <p className="text-xl sm:text-2xl font-bold text-event-primary">67</p>
              </div>
              <div className="bg-white p-3 sm:p-4 border-2 border-yellow-500 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Gold Package Users</h3>
                <p className="text-xl sm:text-2xl font-bold text-yellow-500">42</p>
              </div>
              <div className="bg-white border-2 border-slate-400 p-3 sm:p-4 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Platinum Package Users</h3>
                <p className="text-xl sm:text-2xl font-bold text-slate-400">29</p>
              </div>
            </div>

            {/* Stats Cards - Second Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8'>
              <div className="bg-white p-3 sm:p-4 border-2 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Executives</h3>
                <p className="text-xl sm:text-2xl font-bold text-event-primary">33</p>
              </div>
              <div className="bg-white p-3 sm:p-4 border-2 border-red-500 rounded-lg shadow-sm">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Banned Users</h3>
                <p className="text-xl sm:text-2xl font-bold text-red-500">3</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="overflow-x-auto mb-4 sm:mb-6">
                <TabsList className="bg-gray-100 flex w-full min-w-max">
                  <TabsTrigger value="upcoming" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                    Upcoming Webinars
                  </TabsTrigger>
                  <TabsTrigger value="registered" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                    Your Registrations
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                    Past Webinars
                  </TabsTrigger>
                  <TabsTrigger value="topics" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">
                    Topics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming">
                          {fetchLoading ? (
                            <div className="flex justify-center items-center py-10"><Processing /></div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                              {webinars.length === 0 ? (
                                <div className="text-gray-500 text-center col-span-full py-8">
                                  No webinars found.
                                </div>
                              ) : (
                                webinars.map(webinar => (
                                  <EventCard
                                    key={webinar.id}
                                    title={webinar.title}
                                    image={webinar.thumbnail}
                                    price={webinar.packageId} // or show package name if you join it
                                    PlayNow="Join"
                                    date={new Date(webinar.date).toLocaleDateString()} // adjust date format as needed
                                    zoomLink={webinar.zoomLink}
                                  />
                                ))
                              )}
                            </div>
                          )}
                        </TabsContent>


              <TabsContent value="registered">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {registeredEvents.map(event => <EventCard key={event.id} {...event} />)}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="text-center py-8 sm:py-10">
                  <p className="text-gray-500 text-sm sm:text-base">Your attended webinar history will appear here.</p>
                </div>
              </TabsContent>

              <TabsContent value="topics">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {topics.map((topic, index) => (
                    <TopicCard key={index} {...topic} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-sm sm:text-base">
                My Coins
              </Button>
              <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-sm sm:text-base">
                Events & Workshops
              </Button>
              <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-sm sm:text-base">
                Club News
              </Button>
              <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-sm sm:text-base">
                Support Helpdesk
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
