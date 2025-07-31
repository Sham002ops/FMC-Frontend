// src/components/HeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AutoSlider from '../onboarding/ImageSlider';


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
    <section className="bg-gradient-to-br from-white py-20 to-purple-50 ">
      <div className="max-w-8xl flex mx-auto px-1 gap-6 lg:flex-row items-center">


        <div className=" w-[600px] px-5  justify-center items-center ">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Discover and Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
             Find Seminars-Near You
            </span>
          </h1>
        
        
          <p className="text-gray-600 flex-1 justify-end  text-lg max-w-2xl mb-4  text-left">
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
        

      
        <div className="flex-1 relative">
          <div className='flex justify-center   items-center'>
            <AutoSlider topics={topics} interval={3500} />        
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
