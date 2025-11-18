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
import RegUser from '@/components/adminComponents/RegUser';
import { Briefcase, Package, Shield, UserPlus, Video } from 'lucide-react';
import AdminDashboardStats from '@/components/adminComponents/AdminDashboardStats';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import CreatePackage from '@/components/adminComponents/CreatePackage';
import RegMentor from '@/components/adminComponents/RegMentor';
import AdminProfileMenu from '@/components/adminComponents/AdminProfileMenu';
import FMC from '../../assets/FMC2.png'


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
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openNotificationModel, setOpenNotificationModel] = useState(false);
  const [openWebinarModel, setOpenWebinarModel] = useState(false);
  const [openMentorModel, setOpenMentorModel] = useState(false);
  const [openPackageModel, setOpenPackageModel] = useState(false);
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

  const lastLoginText = user?.lastLogin
  ? formatDistanceToNowStrict(parseISO(user.lastLogin), { addSuffix: true })
  : 'Unknown';

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
    <div className="flex w-full min-h-screen bg-gray-50">
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
      <div className="flex-1 w-full flex flex-col min-h-screen ml-0  transition-all duration-300">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-700 to-green-400 text-white shadow-lg z-40 w-full">
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
                <div className="text-xs text-blue-200">Professional Learning Platform</div>
              </div>
            </div>
            <AdminProfileMenu onSignout={handleSignout} />
          </div>
        </div>
      </header>




        {/* Main Content */}
        <main className="flex-1 bg-slate-300 p-3 sm:p-4 lg:p-6 lg:ml-20 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            
            {/* Create Webinar Modal */}
            {openWebinarModel && (<CreateWebinar setOpenWebinarModel={setOpenWebinarModel}/>)}

            {/* Create Webinar Modal */}
            {openMentorModel && (<RegMentor setOpenMentorModel={setOpenMentorModel}/>)}

            {/* Create Package Modal */}
            {openPackageModel && (<CreatePackage setOpenPackageModel={setOpenPackageModel}/>)}

            {/* Register Executive Modal */}
            {openExecutiveModel && <RegisterExecutive setOpenExecutiveModel={setOpenExecutiveModel} />}
            
            {/* Register Admin Modal */}
            {openAdminModel && <RegAdmin setOpenAdminModel={setOpenAdminModel} />}
            {/* Register User Modal */}
            {openUserModel && <RegUser setOpenUserModel={setOpenUserModel} />}
            {/* Notification  Modal */}
            {/* {openNotificationModel && <NotificationModal setOpenNotificationModel={setOpenNotificationModel} />} */}


            {/* Profile and Action Buttons */}
            <div className=" w-full mb-6 sm:mb-8 flex flex-col lg:flex-row justify-between lg:justify-center gap-4 lg:gap-40  items-start lg:items-center">
              <div className='flex lg:h-[135px] items-center ml-12 lg-ml-0 pl-5 gap-4 sm:gap-6 bg-white  rounded-lg shadow-sm p-4 border-l-4 border-event-primary'>
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md flex-shrink-0">
                  {username ? username.charAt(0).toUpperCase() : 'A'}
                </div>

                {/* Info Panel */}
                <div className='flex flex-col gap-1'>
                  {/* Top Row: Name & Role Badge */}
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h2 className='text-gray-800 font-bold text-xl sm:text-2xl lg:text-3xl truncate max-w-[180px] sm:max-w-[240px]'>
                      {user?.name ? user.name : 'Loading...'}
                    </h2>
                    <span className='px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm'>
                      {user?.role ? user.role.toUpperCase() : "ADMIN"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-4-4m4 4l-4 4" />
                    </svg>
                    <span className='truncate max-w-[140px] sm:max-w-[180px]'>{user?.email || "\u2013"}</span>
                  </div>

                  {/* Coins */}
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-yellow-700 font-semibold'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="gold">₹</text>
                    </svg>
                    <span>Coins:&nbsp;{user?.coins?.toLocaleString() ?? "\u2013"}</span>
                  </div>
                </div>
              </div>


                  {/* Mobile View - Compact Icon Buttons */}
                  <div className='flex sm:hidden flex-row gap-2 w-full justify-center'>
                    <button
                      onClick={() => setOpenUserModel(true)}
                      className="relative bg-white group hover:bg-teal-700 hover:text-white text-teal-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Register User"
                      aria-label="Register User">
                      <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-teal-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-teal-500 font-bold group-hover:text-white transition-colors duration-300">
                        <UserPlus className="w-5 h-6" />
                        <span className="text-[9px] leading-tight">User</span>
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setOpenAdminModel(true)}
                      className="relative bg-white group hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Register Admin"
                      aria-label="Register Admin">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-blue-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-star-icon lucide-user-star"><path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>
                        <span className="text-[9px] leading-tight">Admin</span>
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setOpenExecutiveModel(true)}
                      className="relative bg-white group hover:bg-orange-700 hover:text-white text-orange-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Register Executive"
                      aria-label="Register Executive">
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-orange-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-orange-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Briefcase className="w-5 h-6" />
                        <span className="text-[9px] leading-tight">Executive</span>
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setOpenWebinarModel(true)}
                      className="relative bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Create Webinar"
                      aria-label="Create Webinar">
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-green-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Video className="w-5 h-6" />
                        <span className="text-[9px] leading-tight">Webinar</span>
                      </span>
                    </button>
                    <button
                      onClick={() => setOpenMentorModel(true)}
                      className="relative bg-white group hover:bg-gradient-to-tr hover:from-indigo-500 hover:to-purple-500 group  hover:text-white text-purple-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Create Webinar"
                      aria-label="Create Webinar">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 group  rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-purple-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-purple-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Video className="w-5 h-6" />
                        <span className="text-[9px] leading-tight">Mentor</span>
                      </span>
                    </button>
                    <button
                      onClick={() => setOpenPackageModel(true)}
                      className="relative bg-white group hover:bg-gradient-to-tr hover:from-indigo-500 hover:to-purple-500 group  hover:text-white text-purple-700 overflow-hidden cursor-pointer rounded-lg w-20 max-w-[80px]"
                      title="Create Package"
                      aria-label="Create Package">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 group  rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex flex-col justify-center border-purple-500 border-2 items-center rounded-lg gap-0.5 px-2 py-2 relative text-purple-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Package className="w-5 h-6" />
                        <span className="text-[9px] leading-tight">Package</span>
                      </span>
                    </button>
                  </div>

                  {/* Tablet & Desktop View - Full Text Buttons */}
                  <div className='hidden sm:flex flex-row gap-2 sm:gap-3 lg:flex-wrap lg:gap-4 w-full sm:w-auto lg:w-[700px]'>
                
                    <button 
                      onClick={() => setOpenMentorModel(true)}
                      className="relative w-52  bg-white group  hover:text-white text-purple-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 group -lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center  border-purple-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-purple-500 font-bold group-hover:text-white transition-colors duration-300">
                        <UserPlus className="w-5 h-5" />
                        <span>Register Mentor</span>
                      </span>
                    </button>
                    <button 
                      onClick={() => setOpenUserModel(true)}
                      className="relative w-52  bg-white group hover:bg-teal-700 hover:text-white text-teal-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center  border-teal-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-teal-500 font-bold group-hover:text-white transition-colors duration-300">
                        <UserPlus className="w-5 h-5" />
                        <span>Register User</span>
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => setOpenAdminModel(true)}
                      className="relative w-52 bg-white group hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center border-blue-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Shield className="w-5 h-5" />
                        <span>Register Admin</span>
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => setOpenExecutiveModel(true)}
                      className="relative w-52 bg-white group hover:bg-orange-700 hover:text-white text-orange-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center border-orange-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-orange-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Briefcase className="w-5 h-5" />
                        <span>Register Executive</span>
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => setOpenWebinarModel(true)}
                      className="relative w-52 bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center  border-green-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Video className="w-5 h-5" />
                        <span>Create Webinar</span>
                      </span>
                    </button>


                    <button 
                      onClick={() => setOpenPackageModel(true)}
                      className="relative w-52 bg-white group hover:bg-green-700 hover:text-white text-green-700 overflow-hidden cursor-pointer rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                      <span className="flex justify-center border-green-500 border-2 items-center rounded-lg gap-2 px-4 py-4 relative text-green-500 font-bold group-hover:text-white transition-colors duration-300">
                        <Video className="w-5 h-5" />
                        <span>Create Packages</span>
                      </span>
                    </button>
                  </div>
                </div>

            <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-8">
              <AdminDashboardStats/>
            </div>

            {/* Tabs */}
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
