
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';

const Index = () => {
  const featuredEvents = [
    { id: 1, title: 'AI for Beginners', price: 'FREE', coinCost: 200, date: 'May 15, 2025' },
    { id: 2, title: 'Stock Market Basics', price: 'FREE', coinCost: 150, date: 'May 20, 2025' },
    { id: 3, title: 'Public Speaking Masterclass', price: 'FREE', date: 'May 25, 2025' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-event-primary to-event-dark text-white">
      {/* Header */}
      <header className="container mx-auto py-4">
        <nav className="flex justify-between items-center">
          <Logo size="medium" />
          <div className="space-x-4">
            <Link to="/login" className="text-white hover:text-event-accent">
              Login
            </Link>
            <Link to="/register">
              <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-event-primary">
                Join Now
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 md:px-0">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Elevate Your Knowledge</h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Join expert-led webinars and seminars on the topics that matter to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Link to="/register">
              <Button className="bg-white text-event-primary hover:bg-event-accent hover:text-event-dark w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Webinars */}
      <section className="container mx-auto py-16 px-4 md:px-0">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Webinars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              price={event.price}
              coinCost={event.coinCost}
              date={event.date}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/register">
            <Button className="bg-white text-event-primary hover:bg-event-accent hover:text-event-dark">
              View All Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white text-gray-800 py-20">
        <div className="container mx-auto px-4 md:px-0">
          <h2 className="text-3xl font-bold mb-12 text-center text-event-primary">Why Choose Event Horizon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-event-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-event-primary">
                  <path d="M17 8h1V2h-4v1"/>
                  <path d="M6 8h1V2h4v1"/>
                  <path d="M22 9H2"/>
                  <path d="M19 15V9H5v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z"/>
                  <path d="M6.5 13h0"/>
                  <path d="M9.5 13h0"/>
                  <path d="M12.5 13h0"/>
                  <path d="M15.5 13h0"/>
                  <path d="M6.5 16h0"/>
                  <path d="M9.5 16h0"/>
                  <path d="M12.5 16h0"/>
                  <path d="M15.5 16h0"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert-Led Sessions</h3>
              <p className="text-gray-600">Learn from industry professionals with real-world experience.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-event-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-event-primary">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Attend live or watch recordings at your convenience.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-event-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-event-primary">
                  <path d="M12 2v20"/>
                  <path d="m17 5-5-3-5 3"/>
                  <path d="m17 19-5 3-5-3"/>
                  <path d="M2 12h20"/>
                  <path d="m5 7-3 5 3 5"/>
                  <path d="m19 7 3 5-3 5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Engage in Q&A sessions and collaborative workshops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-event-dark text-white py-10">
        <div className="container mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <div className="mt-4 md:mt-0">
              <p className="text-sm opacity-70">© 2025 Event Horizon. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
