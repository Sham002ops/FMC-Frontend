import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { Processing } from '@/components/ui/icons/Processing';
import { useState } from 'react';
import AutoSlider from '@/components/onboarding/ImageSlider';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { BackendUrl } from '@/Config';


// ✅ Add this simple TopicCard component
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading} = useAuth()
  console.log(" user:", user);
  
  
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  const role = user?.role
  console.log(" at dashboard role : ", role);

  const username = user?.name
  
  const profilePic = user.imageUrl;

const handleSignout = async () => {
        try {
        const response = await axios.post(`${BackendUrl}/auth/logout`,
          {
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = response.data 
        console.log("Successfully Logged out", { response: response.data});
      console.log("Backend URL:", BackendUrl);
  
        if (response.status === 200) {

          navigate("/landing-page");
        } else {
          console.log(" status", response.status);
          
         alert("Logout failed. Please try again.");
        }
      } catch (err) {
        alert(
          err.response?.data?.error || "Login failed. Please check your credentials."
        );
      
     
    };
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className=" bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Coins display - hidden on very small screens */}
              {/* <span className="hidden sm:block bg-white/20 px-3 py-2 rounded-full text-sm backdrop-blur-sm">
                800 <span className="font-bold">COIN</span>
              </span> */}
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center focus:outline-none"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 md:w-72 bg-white rounded-xl border border-primary shadow-lg shadow-purple-300 z-50">
                    <div className="py-4 px-4 md:py-6 md:px-5">
                      {/* Avatar + Name */}
                      <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg md:text-xl font-semibold shadow-inner">
                          U
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-800">
                            {username || "DemoUser"}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500">
                            <span className='text-violet-700'>• {String(role).toUpperCase()}</span> • Joined Jan 2025
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

      {/* Main */}
      <main className="container mx-auto py-6 md:py-8 px-4 md:px-6">
        <section className="bg-gradient-to-br ">
              <div className="max-w-8xl flex mx-auto px-1 gap-6 lg:flex-row ">
        
        
                <div className=" w-[600px] px-5  justify-center mt-10 ">
                  <h1 className="text-2xl font-extrabold leading-tight text-gray-900 mb-6">
                    Hello {username}!<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
                     Find Seminars-Near You
                    </span>
                  </h1>
                
                
                  <p className="text-gray-600 flex-1 justify-end   max-w-2xl mb-4  text-left">
                    Connect with industry leaders, learn new skills, and expand your knowledge through
                    interactive webinars and seminars on topics like biotechnology, career development, health and wellness, digital marketing, and more.
                  </p>
        
        
                    <div>
                      <div className="flex items-center flex-wrap gap-4">
                        <a
                          href="#packages"
                          className="text-lg text-gray-800 hover:text-blue-500 transition-colors font-medium"
                        >
                          Explore Packages
                        </a>
                        <Link to="/register">
                          <Button className="bg-gradient-to-br from-blue-400 to-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 hover:shadow-blue-600 hover:shadow-md hover:scale-110 transition">
                            Join Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
        
                {/* //explore package component  */}
                
        
              
                <div className="flex-1 relative mt-32">
                  <div className='flex justify-center   items-center'>
                    <AutoSlider topics={topics} interval={3500} />        
                  </div>
                </div>
                
              </div>
            </section>

        {/* Stats Cards - Responsive Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8'>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Package Purchased</h3>
            <p className="text-xl md:text-2xl font-bold text-yellow-500">Gold <span className="text-base md:text-lg">Package</span></p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Attended Webinars</h3>
            <p className="text-xl md:text-2xl font-bold text-event-primary">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Certificates Earned</h3>
            <p className="text-xl md:text-2xl font-bold text-event-primary">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
            <p className="text-xl md:text-2xl font-bold text-event-primary">Jan 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-gray-100 mb-6 w-full flex-wrap h-auto p-1">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm flex-1 min-w-0">Upcoming</TabsTrigger>
            <TabsTrigger value="registered" className="text-xs sm:text-sm flex-1 min-w-0">Registered</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm flex-1 min-w-0">History</TabsTrigger>
            <TabsTrigger value="topics" className="text-xs sm:text-sm flex-1 min-w-0">Topics</TabsTrigger>
          </TabsList>

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
              <p className="text-gray-500 text-sm md:text-base px-4">Your attended webinar history will appear here.</p>
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

        {/* Action Buttons - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-xs sm:text-sm py-2 md:py-3">
            My Coins
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-xs sm:text-sm py-2 md:py-3">
            Events & Workshops
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-xs sm:text-sm py-2 md:py-3">
            Club News
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent text-xs sm:text-sm py-2 md:py-3">
            Support Helpdesk
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;