import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Processing } from '@/components/ui/icons/Processing';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { Divide } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';


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
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [openAdminModel, setOpenAdminModel] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [topic1, setTopic1] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      termsAgreed: false,
      isAdmin: false,
    });



  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user && user.unsafeMetadata?.role !== "admin") {
      navigate("/unauthorized");
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded || !user) {
    return <div className="justify-center items-center flex p-72 text-center"><Processing /></div>;
  }

  const username = typeof user.unsafeMetadata?.firstName === 'string' ? user.unsafeMetadata.firstName : "Guest";
  console.log("user: ", user);
  
  const profilePic = user.imageUrl;

  const handleSignout = async () => {
    await signOut();
    navigate("/login");
  };

  const upcomingEvents = [
    { id: 1, title: 'AI for Beginners', price: 'FREE', coinCost: 200, date: 'May 15, 2025' },
    { id: 2, title: 'Stock Market Basics', price: 'FREE', coinCost: 150, date: 'May 20, 2025' },
    { id: 3, title: 'Public Speaking Masterclass', price: 'FREE', date: 'May 25, 2025' },
    { id: 4, title: 'Digital Marketing Trends', price: 'FREE', coinCost: 300, date: 'June 5, 2025' },
  ];

  const registeredEvents = [
    { id: 5, title: 'Introduction to Crypto', price: 'FREE', coinCost: 200, date: 'May 12, 2025' },
    { id: 6, title: 'Personal Finance 101', price: 'FREE', coinCost: 100, date: 'May 18, 2025' },
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
console.log("role : ", user.unsafeMetadata?.role);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-event-gradient text-white relative ">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-6">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                800 <span className="font-bold">COIN</span>
              </span>
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
  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-primary shadow-lg shadow-purple-300 z-50">
    <div className="py-6 px-5">
      {/* Avatar + Name */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-semibold shadow-inner">
          U
        </div>
        <div className=' absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4' onClick={() => setMenuOpen(false)}>x</div>
        <div>
          <h3 className="text-lg font-semibold mt-2 text-gray-800">
            {username || "DemoUser"}
          </h3>
          <p className="text-sm text-gray-500"><p className=' text-violet-700'>• {String(user.unsafeMetadata?.role).toUpperCase()}</p> • Joined Jan 2025</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Menu Links (Add more if needed) */}
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

      {openModel && (<div className=' backdrop-blur-md top-0 absolute h-screen w-screen z-20'>
         <div className="p-16 rounded-md max-w-xl mx-auto absolute left-80  right-72 top-40 bg-violet-200 border-2 border-violet-900">
      <h1 className="text-2xl font-bold mb-4">Create Webinar</h1>
      <div className=' absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4' onClick={() => setOpenModal(false)}>x</div>

      <label className="block mb-2 font-medium">Webinar Topic</label>
      <input
        type="text"
        value={topic1}
        onChange={(e) => setTopic1(e.target.value)}
        className="w-full p-2 border rounded mb-4 outline-none"
        placeholder="e.g., Modern React Patterns"
      />

     <label className="block mb-2 font-medium">Discription</label>
      <textarea
        
        value={topic1}
        onChange={(e) => setTopic1(e.target.value)}
        className="w-full p-2 border rounded mb-4 outline-none"
        placeholder="e.g.,Discover techniques for mindfulness & physical wellness"
      />

      <label className="block mb-2 font-medium">Upload Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailChange}
        className="mb-4"
      />

      {thumbnailPreview && (
        <img
          src={thumbnailPreview}
          alt="Thumbnail Preview"
          className="w-64 h-auto mb-4 rounded border"
        />
      )}

      <button
        onClick={handleCreateWebinar}
        className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
      >
        Create Webinar
      </button>

      {registrationLink && (
        <div className="mt-4">
          <p className="font-semibold">Registration Link:</p>
          <a href={registrationLink} className="text-blue-600 underline">
            {registrationLink}
          </a>
        </div>
      )}
    </div>
      </div>)}

      {openAdminModel && (<div className=' backdrop-blur-md top-0 absolute h-screen w-screen z-20'>
         <div className="p-16 rounded-md max-w-xl mx-auto absolute left-80  right-72 top-40 bg-violet-200 border-2 border-violet-900">
      <h1 className="text-2xl font-bold mb-4">Register New Admin</h1>
      <div className=' absolute top-2 cursor-pointer hover:text-red-600 text-xl text-slate-700 right-4' onClick={() => setOpenAdminModel(false)}>x</div>

     

      {/* {registrationLink && (
        <div className="mt-4">
          <p className="font-semibold">Registration Link:</p>
          <a href={registrationLink} className="text-blue-600 underline">
            {registrationLink}
          </a>
        </div>
      )} */}
    </div>
      </div>)}

      {/* Main */}
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8 flex justify-between">
          <img src={profilePic} alt="Profile Photo" className="w-12 h-12 rounded-full" />
         <div className=' flex justify-between gap-4'>
           <button  className=' bg-violet-200 px-4 rounded-sm hover:bg-violet-900 hover:text-white text-violet-800 border-2 border-violet-800' onClick={() => setOpenAdminModel(true)}>Register Admin</button>
          <button  className=' bg-violet-800 px-4 rounded-sm hover:bg-violet-900 text-white' onClick={() => setOpenModal(true)}>Create Webinar</button>
         </div>
        </div>

        <div className='flex gap-8 mb-8'>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Remaining Balance</h3>
            <p className="text-2xl font-bold text-event-primary">800 <span className="text-lg">COIN</span></p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Attended Webinars</h3>
            <p className="text-2xl font-bold text-event-primary">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Certificates Earned</h3>
            <p className="text-2xl font-bold text-event-primary">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
            <p className="text-2xl font-bold text-event-primary">Jan 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-gray-100 mb-6">
            <TabsTrigger value="upcoming">Upcoming Webinars</TabsTrigger>
            <TabsTrigger value="registered">Your Registrations</TabsTrigger>
            <TabsTrigger value="history">Past Webinars</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger> {/* ✅ New tab */}
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingEvents.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="registered">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {registeredEvents.map(event => <EventCard key={event.id} {...event} />)}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-10">
              <p className="text-gray-500">Your attended webinar history will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <TopicCard key={index} {...topic} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">My Coins</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Events & Workshops</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Club News</Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">Support Helpdesk</Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
