// src/components/HeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AutoSliderDesktop from './AutoSliderDesktop';
import AutoSliderMobile from './AutoSliderMobile';

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
    description: "Understand AI applications in various industries",
    color: "bg-red-500",
  },
  {
    title: "Sustainable Living",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop",
    description: "Learn practical ways to live more sustainably",
    color: "bg-teal-500",
  },
];

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-white to-purple-50 py-6">
      {/* Desktop layout */}
      <div className="hidden lg:flex max-w-8xl mx-auto px-4 gap-6 flex-row items-center">
        {/* Left: Text */}
        <div className="w-full lg:w-[600px] px-2 md:px-5">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 mb-6">
            Discover and Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
              Find Seminars-Near You
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-4">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, career development,
            health and wellness, digital marketing, and more.
          </p>

          <div className="flex  items-center gap-4">
            <Link to="/register">
              <Button className="bg-gradient-to-br from-blue-400 to-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 hover:shadow-blue-600 hover:shadow-md hover:scale-110 transition">
                Join Now
              </Button>
            </Link>
            <Link to="/login">
              <button className=" relative bg-white group border-2  hover:bg-blue-700 hover:text-white text-blue-700   overflow-hidden cursor-pointer  rounded-full ">
                  <div className=" absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out "></div>
                  <span className=" flex justify-center border-blue-500 border-2 items-center rounded-full gap-2  px-4 py-2  relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">Log In</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Slider */}
        <div className="w-full flex justify-end">
          <AutoSliderDesktop topics={topics} interval={3500} />
        </div>
      </div>

      {/* Mobile/Tablet layout */}
      <div className="block lg:hidden max-w-4xl mx-auto px-4 flex flex-col items-center">
        {/* Text first */}
        <div className="w-full px-2 md:px-5 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 mb-6">
            Discover and Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
              Find Seminars-Near You
            </span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base max-w-2xl mb-4 mx-auto">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, career development,
            health and wellness, digital marketing, and more.
          </p>

          <div className="flex  sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button className="bg-gradient-to-br from-blue-400 to-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 hover:shadow-blue-600 hover:shadow-md hover:scale-110 transition">
                Join Now
              </Button>
            </Link>
            <Link to="/login">
               <button className=" relative bg-white group border-2  hover:bg-blue-700 hover:text-white text-blue-700   overflow-hidden cursor-pointer  rounded-full ">
                  <div className=" absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out "></div>
                  <span className=" flex justify-center border-blue-500 border-2 items-center rounded-full gap-2  px-4 py-2  relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">Log In</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Slider below text */}
        <div className="w-full mt-6">
          <AutoSliderMobile topics={topics} interval={3500} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
