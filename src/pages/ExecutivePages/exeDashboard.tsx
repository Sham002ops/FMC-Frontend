import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';


interface TopicCardProps {
  title: string;
  image: string;
  description: string;
  color: string;
}

const TopicCard = ({ title, image, description, color }: TopicCardProps) => (
  <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
    <img src={image} alt={title} className="w-full h-36 object-cover" />
    <div className="p-4">
      <h3 className={`text-lg font-semibold mb-1 ${color} text-white px-2 py-1 inline-block rounded`}>{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [executive, setExecutive] = useState(null)
  const [username, setUsername] = useState(null)  
  const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const fetchExecutiveDetails = async () =>{
        try{
          setLoading(true);
          const token = localStorage.getItem('token');
          console.log("token : ", token);
          
          const res = await axios.get(`${BackendUrl}/auth/verifyToken`, {
            headers: {
              Authorization: `Bearer${token}`,
            },
          });
          console.log("res: ", res);
          
          setExecutive(res.data.user);
          setUsername(res.data.user.name)
          const role = res.data.user.role
          console.log(" at dashboard role : ", role);
          if ( role !== "EXECUTIVE") {
              navigate("/unauthorized");
            }
        }catch(err){
        console.log("Error fetching user details:", err);
        setExecutive(null)
        
        } finally{
          setLoading(false);
        }
      }
      fetchExecutiveDetails()
    },[]);

  if (loading) return <div>Loading...</div>;

  
  const handleSignout = async () => {
    try {
       try {
      await axios.post(`${BackendUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.removeItem("token");
      navigate("/landing-page");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("token");
    }
    } catch (err) {
      alert(err.response?.data?.error || "Logout failed.");
    }
  };

  // ===== Executive Specific Data =====
  const upcomingHostedWebinars = [
    { id: 1, title: 'Leadership Skills Workshop', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCLqACgwJCaNke7pFGSrSjm-87-MXT5qeZMA&s", price: 'Free', PlayNow: "Manage", date: 'Aug 20, 2025' },
    { id: 2, title: 'Advanced Sales Strategies', image: "https://embed-ssl.wistia.com/deliveries/f4d4a655755c9c037fc1ef9526916bac8a86aba7.webp?image_crop_resized=1280x720", price: 'Premium', PlayNow: "Manage", date: 'Sep 1, 2025' },
  ];

  const activeReferrals = [
    { id: 1, name: "Gaurav Rokde", joined: "Jul 15, 2025", package: "Gold" },
    { id: 2, name: "Amol  Thakur", joined: "Aug 1, 2025", package: "Elite" },
    { id: 3, name: "Rahul  Jadhav", joined: "Aug 1, 2025", package: "Elite" }
  ];

  const trainingModules = [
    { title: "Team Management", image: "https://source.unsplash.com/400x200/?management", description: "Guide to managing your referrals effectively", color: "bg-green-500" },
    { title: "Recruitment Tips", image: "https://source.unsplash.com/400x200/?recruitment", description: "Best practices for recruiting active members", color: "bg-blue-500" },
  ];



  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <Logo size="small" />
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center"
              onClick={() => handleSignout()}
              // onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-primary z-50">
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {username[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{username}</h3>
                      <p className="text-sm text-gray-500"><span className="text-violet-700">• {String(executive.role).toUpperCase()}</span></p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="hover:text-primary cursor-pointer">Dashboard</li>
                    <li className="hover:text-primary cursor-pointer">My Webinars</li>
                    <li className="hover:text-primary cursor-pointer">Referrals</li>
                  </ul>
                  <button
                    onClick={handleSignout}
                    className="mt-6 w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"
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
      <main className="container mx-auto py-6 px-4">
        {/* Executive Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Referred Users</h3>
            <p className="text-2xl font-bold text-blue-500">58</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">This Months Referrals</h3>
            <p className="text-2xl font-bold text-green-500">{activeReferrals.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Commission</h3>
            <p className="text-2xl font-bold text-yellow-500">₹12,500</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Upcoming Hosted Webinars</h3>
            <p className="text-2xl font-bold text-purple-500">{upcomingHostedWebinars.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-gray-100 mb-6 flex flex-wrap">
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingHostedWebinars.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="hosting">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingHostedWebinars.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Active Referrals</h3>
              <ul className="space-y-2">
                {activeReferrals.map(r => (
                  <li key={r.id} className="flex justify-between border-b pb-1">
                    <span>{r.name}</span>
                    <span className="text-sm text-gray-500">{r.package}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="training">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingModules.map((topic, idx) => <TopicCard key={idx} {...topic} />)}
            </div>
          </TabsContent>
        </Tabs>
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-100 py-2"
          >
            View Referrals
          </Button>
          <Button
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-100 py-2"
          >
            Manage Webinars
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 py-2"
          >
            Commission Payouts
          </Button>
          <Button
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-100 py-2"
          >
            Support Desk
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveDashboard;
