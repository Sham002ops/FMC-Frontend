
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-event-gradient text-white">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Logo size="sm" />
            <div className="flex items-center space-x-6">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                800 <span className="font-bold">COIN</span>
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span>Madison</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Madison!</h1>
          <p className="text-gray-600">Active member since Jan 2025</p>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-gray-100 mb-6">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-event-primary">
              Upcoming Webinars
            </TabsTrigger>
            <TabsTrigger value="registered" className="data-[state=active]:bg-white data-[state=active]:text-event-primary">
              Your Registrations
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-event-primary">
              Past Webinars
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  price={event.price}
                  coinCost={event.coinCost}
                  date={event.date}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="registered">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {registeredEvents.map(event => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  price={event.price}
                  coinCost={event.coinCost}
                  date={event.date}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-10">
              <p className="text-gray-500">Your attended webinar history will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">
            My Coins
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">
            Events & Workshops
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">
            Club News
          </Button>
          <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-accent">
            Support Helpdesk
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-600 text-sm">© 2025 Event Horizon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
