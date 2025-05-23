// src/components/HeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900 mb-6">
            Discover and Join <br />
            <span className="text-primary">Expert-Led Webinars</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, yoga, and wellness.
          </p>
          <div className="flex items-center flex-wrap gap-4">
            <a href="#packages" className="hover:text-primary text-xl ">Explore Packages</a>
              <Link to="/register">
              <Button variant="outline" className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white">
                Join Now
              </Button>
             </Link>
          </div>
        </div>

        {/* Right Content */}
        {/* <div className="flex-1 relative">
          <img
            src="/assets/dashboard-mockup.png"
            alt="Webinar dashboard"
            className="rounded-xl shadow-xl w-full"
          />
          <img
            src="/assets/profile-thumbnail.png"
            alt="User"
            className="w-14 h-14 rounded-full border-2 border-white absolute bottom-4 right-4 shadow-lg"
          />
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
