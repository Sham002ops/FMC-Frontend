import { useNavigate } from 'react-router-dom'; 
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { Divide } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import RegisterExecutive from '@/components/adminComponents/RegisterExecutive';
import RegAdmin from '@/components/adminComponents/RegAdmin';
const BackendUrl = import.meta.env.VITE_API_URL


interface TopicCardProps {
  title: string;
  image: string;
  description: string;
  color: string;
}

const TopicCard = ({ title, image, description, color }: TopicCardProps) => (
  <div className={`rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white`}>
    <img src={image} alt={title} className="w-full h-36 object-cover" />
    <div className="p-4">
      <h3 className={`text-lg font-semibold mb-1 ${color} text-white px-2 py-1 inline-block rounded`}>{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [openAdminModel, setOpenAdminModel] = useState(false);
  const [openExecutiveModel, setOpenExecutiveModel] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [topic1, setTopic1] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [sidebarModel, setSidebarModel] = useState(false)
  

  const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      termsAgreed: false,
      isAdmin: false,
    });

  // const { user, loading} = useAuth()

  useEffect(() => {
    const fetchUserDetails = async () =>{
      try{
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
          headers: {
            Authorization: `Bearer${token}`,
          },
        });
        setUser(res.data.user);
        setUsername(res.data.user.name)
         const role = res.data.user.role
         console.log(" at dashboard role : ", role);
         if ( role !== "ADMIN") {
            navigate("/unauthorized");
          }
      }catch(err){
       console.log("Error fetching user details:", err);
       setUser(null)
       
      } finally{
        setLoading(false);
      }
    }
    fetchUserDetails()
  },[]);


 

  if (loading) {
    return <div className="justify-center items-center flex min-h-screen text-center"><Processing /></div>;
  }

  // console.log("user: ", user);
  
  // const profilePic = user.imageUrl;

  const handleSignout = async () => {
    
    navigate("/login");
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

  // ✅ Topics list
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

const handleSidebar =()=> {
  if(!sidebarModel){
    setSidebarModel(true)
  }else{
    setSidebarModel(false)
  }
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

    // TODO: send webinar data to backend
    console.log("Webinar Created:", { topic1, thumbnail, link });
  };

  if(user != null){
    const username = user.name
  }


  

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
       <div className=' transition-transform '><Sidebar  /></div>
    <div className="">  
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r fixed w-full from-blue-700 to-green-400 text-white  ">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center focus:outline-none"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-xl border border-primary shadow-lg shadow-purple-300 z-50">
                    <div className="py-6 px-5">
                      {/* Avatar + Name */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-semibold shadow-inner">
                          U
                        </div>
                        <div className='absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4' onClick={() => setMenuOpen(false)}>×</div>
                        <div>
                          <h3 className="text-lg font-semibold mt-2 text-gray-800">
                            {username || "DemoUser"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            <span className='text-violet-700'>• {String(user? user?.role: 'loading...').toUpperCase()}</span> • Joined Jan 2025
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-4" />

                      {/* Menu Links */}
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="hover:text-primary cursor-pointer transition">Dashboard</li>
                        <li className="hover:text-primary cursor-pointer transition">My Webinars</li>
                        <li className="hover:text-primary cursor-pointer transition">Settings</li>
                      </ul>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignout}
                        className="mt-6 w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-medium"
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
      {/* main content */}
      <div className={`flex-1 min-h-screen ${sidebarModel? 'ml-64': 'ml-20'} pt-20 p-6 md:ml-20 transition-all duration-300 `}>
      {/* <button className=' z-20 absolute transition-transform top-20 left-1 rounded-md w-10 h-10 pb-1 text-2xl  border-2 ' onClick={()=>handleSidebar()}>=</button> */}
      {/* Create Webinar Modal */}
      {openModel && (
        <div className='fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4'>
          <div className="bg-violet-200 border-2 border-blue-500 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Create Webinar</h1>
                <button 
                  className='cursor-pointer hover:text-red-600 text-xl text-slate-700' 
                  onClick={() => setOpenModal(false)}
                >
                  ×
                </button>
              </div>

              <label className="block mb-2 font-medium">Webinar Topic</label>
              <input
                type="text"
                value={topic1}
                onChange={(e) => setTopic1(e.target.value)}
                className="w-full p-2 border rounded mb-4 outline-none"
                placeholder="e.g., Modern React Patterns"
              />

              <label className="block mb-2 font-medium">Description</label>
              <textarea
                value={topic1}
                onChange={(e) => setTopic1(e.target.value)}
                className="w-full p-2 border rounded mb-4 outline-none min-h-[80px]"
                placeholder="e.g., Discover techniques for mindfulness & physical wellness"
              />

              <label className="block mb-2 font-medium">Upload Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="mb-4 w-full"
              />

              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full max-w-64 h-auto mb-4 rounded border"
                />
              )}

              <button
                onClick={handleCreateWebinar}
                className="w-full bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
              >
                Create Webinar
              </button>

              {registrationLink && (
                <div className="mt-4">
                  <p className="font-semibold">Registration Link:</p>
                  <a href={registrationLink} className="text-blue-600 underline break-all">
                    {registrationLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register Executive Modal */}
      {openExecutiveModel && <div><RegisterExecutive setOpenExecutiveModel={setOpenExecutiveModel} /></div>}
      {/* Register Admin Modal */}
      {openAdminModel && <div><RegAdmin setOpenAdminModel={setOpenAdminModel} /></div>}

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 md:px-6">
        {/* Profile and Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className=' flex  items-center gap-4'>
           {/* <img src={} alt="Profile Photo" className="w-12 h-12 rounded-full" /> */}
            <div className=' text-event-primary font-bold text-2xl '>{username ? username.toUpperCase() : 'Loading...'}
            </div>
         </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
            <button  
              className='bg-violet-100 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white text-blue-600 border-2 border-blue-600 text-sm sm:text-base' 
              onClick={() => setOpenAdminModel(true)}
            >
              Register Admin
            </button>
            <button  
              className='bg-violet-100 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-orange-600 border-2 border-orange-500 text-sm sm:text-base' 
              onClick={() => setOpenExecutiveModel(true)}
            >
              Register Executive
            </button>
            <button  
              className='bg-green-400 px-4 py-2 rounded-lg hover:bg-green-600 text-white text-sm sm:text-base' 
              onClick={() => setOpenModal(true)}
            >
              Create Webinar
            </button>
          </div>
        </div>

        {/* Stats Cards - First Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-event-primary">138</p>
          </div>
          <div className="bg-white border-2 border-event-primary p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Elite Package Users</h3>
            <p className="text-2xl font-bold text-event-primary">67</p>
          </div>
          <div className="bg-white p-4 border-2 border-yellow-500 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Gold Package Users</h3>
            <p className="text-2xl font-bold text-yellow-500">42</p>
          </div>
          <div className="bg-white border-2 border-slate-400 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Platinum Package Users</h3>
            <p className="text-2xl font-bold text-slate-400">29</p>
          </div>
        </div>

        {/* Stats Cards - Second Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className="bg-white p-4 border-2 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Executives</h3>
            <p className="text-2xl font-bold text-event-primary">33</p>
          </div>
          <div className="bg-white p-4 border-2 border-red-500 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Banned Users</h3>
            <p className="text-2xl font-bold text-red-500">3</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="bg-gray-100 mb-6 flex w-full min-w-max">
              <TabsTrigger value="upcoming" className="flex-1 text-xs sm:text-sm">Upcoming Webinars</TabsTrigger>
              <TabsTrigger value="registered" className="flex-1 text-xs sm:text-sm">Your Registrations</TabsTrigger>
              <TabsTrigger value="history" className="flex-1 text-xs sm:text-sm">Past Webinars</TabsTrigger>
              <TabsTrigger value="topics" className="flex-1 text-xs sm:text-sm">Topics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingEvents.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="registered">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {registeredEvents.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-10">
              <p className="text-gray-500">Your attended webinar history will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <TopicCard key={index} {...topic} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">My Coins</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Events & Workshops</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Club News</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Support Helpdesk</Button>
        </div>
      </main>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminDashboard;