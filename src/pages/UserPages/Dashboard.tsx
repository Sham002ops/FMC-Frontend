import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FMC from '../../assets/FMC2.png'
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { NotificationSlider } from '@/components/userComponents/NotificationSlider';
import LoyaltyCard from '@/components/userComponents/LoyaltyCard';
import { NotificationSliderDesktop } from '@/components/userComponents/NotificationSliderDesktop';
import { NotificationSliderMobile } from '@/components/userComponents/NotificationSliderMobile';
import LoyaltyCardMobile from '@/components/userComponents/LoyaltyCardMobile';

interface TopicCardProps {
  title: string;
  image: string;
  description: string;
  color: string;
}

const TopicCard = ({ title, image, description, color }: TopicCardProps) => (
  <div className="group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
    <img src={image} alt={title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="p-4">
      <h3 className={`text-lg font-semibold mb-2 ${color} text-white px-3 py-1 inline-block rounded-full text-sm`}>
        {title}
      </h3>
      <p className="text-sm text-gray-700 mt-2">{description}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [webinars, setWebinars] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

        useEffect(() => {
              const fetchUserDetails = async () =>{
                try{
                  setLoading(true);
                  const token = localStorage.getItem('token');

                  if(!token){
                    console.log("Token not present");
                    navigate("/landing-page")
                    
                  }
                  const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  setUser(res.data.user);
                  console.log(" user data: ", res.data);
                  
                  setUsername(res.data.user.name)
                  const role = res.data.user.role
                  console.log(" at dashboard role : ", role);
                 
                  if ( role !== "USER" && role == "ADMIN") {
                      navigate("/admin-dashboard");
                    }
                  if ( role !== "USER" && role !== "ADMIN" && role == "EXECUTIVE") {
                      navigate("/exexutive-dashboard");
                    }
                  if ( role !== "USER" && role !== "ADMIN" && role !== "EXECUTIVE") {
                      navigate("/unauthorized");
                    }

                    // Fetch webinars
                const webinarRes = await axios.get(`${BackendUrl}/webinar`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setWebinars(webinarRes.data);
                console.log(" webinars: ", webinarRes.data);
                
                }catch(err){
                console.log("Error fetching user details:", err);
                setUser(null)
                setWebinars([]);
                
                } finally{
                  setLoading(false);
                }
              }
              fetchUserDetails()
            },[]);
  

  if (loading) return <div className="flex justify-center items-center pt-[300px]"><Processing /></div>

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Processing />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white shadow-lg">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className=' flex justify-between gap-4 items-center'>
                 <img src={FMC} alt="Logo" className=' w-10 h-10 rounded-full ' />
                  <div className='block lg:hidden'>
                      <div className="text-lg font-bold  ">FMC</div>
                  </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold">FINITE MARSHALL CLUB</div>
                <div className="text-xs text-blue-200">Professional Learning Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Coins Display */}
              <div className="hidden sm:flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">1,250</span>
                <span className="text-blue-200 ml-1 text-sm">coins</span>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
                          {username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Welcome, {username || "User"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {String(user?.role || 'USER').toUpperCase()}
                            </span>
                            <span className="ml-2">• Joined Jan 2025</span>
                          </p>
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
                      
                      <div className="border-t border-gray-200 my-4" />
                      
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 7 5 5 5-5" />
                          </svg>
                          My Dashboard
                        </a></li>
                        <li><a href="#" className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          My Webinars
                        </a></li>
                        <li><a href="#" className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </a></li>
                      </ul>
                      
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 md:px-6 space-y-8">
        {/* Hero Section with Greeting */}
       {/* Hero Section with Greeting & Notification Slider */}
          <section className="text-center lg:text-left">
            <div className="mb-6 ">
              <h1 className="text-2xl flex justify-start md:text-4xl font-bold text-gray-900 mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {username}! 👋
              </h1>
              <p className="text-md text-left  text-gray-600">
                Ready to expand your knowledge today? Check out your upcoming webinars below.
              </p>
            </div>

            {/* Desktop Layout with Loyalty Card + Notification Slider */}
            <div className="hidden lg:flex gap-6 items-center justify-center">
              {/* Loyalty Card */}
              <LoyaltyCard coins={user?.coins || 1250} username={username || 'User'} />
              
              {/* Notification Slider */}
              <div className="flex-1 max-w-4xl">
                <NotificationSliderDesktop webinars={webinars} />
              </div>
            </div>

            {/* Mobile Layout - Only Notification Slider */}
            <div className="block lg:hidden">
              <NotificationSliderMobile webinars={webinars} />
            </div>
          </section>


        {/* Stats Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium opacity-90">Current Package</h3>
                  <p className="text-2xl font-bold">Gold</p>
                  <p className="text-xs opacity-75">Premium Access</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Webinars Attended</h3>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-xs text-green-600">+3 this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Certificates</h3>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                  <p className="text-xs text-gray-500">Earned</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
                  <p className="text-2xl font-bold text-green-600">Jan 2026</p>
                  <p className="text-xs text-green-600">11 months left</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>            
              {/* Loyalty Card - Only on mobile */}
              <div className="block lg:hidden">
                <LoyaltyCardMobile coins={user?.coins || 1250} />
              </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section>
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <TabsList className="bg-gray-100 w-full h-12">
                <TabsTrigger value="upcoming" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Upcoming Webinars
                </TabsTrigger>
                <TabsTrigger value="registered" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  My Registrations
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  History
                </TabsTrigger>
                <TabsTrigger value="topics" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All Topics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingEvents.map(event => <EventCard key={event.id} {...event} />)}
              </div>
            </TabsContent>

            <TabsContent value="registered" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {registeredEvents.map(event => <EventCard key={event.id} {...event} />)}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No History Yet</h3>
                <p className="text-gray-500">Your attended webinars will appear here after you join your first session.</p>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topics.map((topic, index) => (
                  <TopicCard key={index} {...topic} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

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
      </main>
    </div>
  );
};

export default UserDashboard;
