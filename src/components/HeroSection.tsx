// src/components/HeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Discover and Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-900 to-purple-700">
             Find Seminars-Near You
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mb-8">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, career development, health and wellness, digital marketing, and more.
          </p>

          <div className="flex items-center flex-wrap gap-4">
            <a
              href="#packages"
              className="text-lg text-gray-800 hover:text-purple-600 transition-colors font-medium"
            >
              Explore Packages
            </a>
            <Link to="/register">
              <Button className="bg-violet-700 text-white px-6 py-3 rounded-full hover:bg-violet-900 hover:shadow-violet-600 hover:shadow-md transition">
                Join Now
              </Button>
            </Link>
          </div>
        </div>

      
        <div className="flex-1 relative">
          <img
            src="/demoIM.jpg"
            alt="Webinar dashboard"
            className="rounded-xl shadow-xl w-full"
          />
          <img
            src="/profile.jpg"
            alt="User"
            className="w-14 h-14 rounded-full border-2 border-white absolute bottom-4 right-4 shadow-lg"
          />
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
