// src/components/HeroSection.tsx
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AutoSliderDesktop from './AutoSliderDesktop';
import AutoSliderMobile from './AutoSliderMobile';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animated heading letters
    if (headingRef.current) {
      const letters = headingRef.current.querySelectorAll("span");
      gsap.fromTo(
        letters,
        { opacity: 0, y: 100, rotateX: 90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }

    // Desktop layout animations
    if (leftContentRef.current) {
      gsap.fromTo(
        leftContentRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 1,
        }
      );
    }

    if (sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { opacity: 0, x: 100, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 1.2,
        }
      );
    }

    // Mobile layout animations
    if (mobileContentRef.current) {
      gsap.fromTo(
        mobileContentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          delay: 1,
        }
      );
    }
  }, []);

  const text = "FINITE MARSHALL CLUB";

  return (
    <section className="bg-gradient-to-br from-white to-purple-50 py-4 sm:py-6 md:py-8 lg:py-10 overflow-hidden">
      {/* Animated Heading */}
      <h1
        ref={headingRef}
        aria-hidden
        className="pointer-events-none flex justify-center items-center font-urbanist font-extrabold uppercase leading-none tracking-tight relative overflow-hidden select-none mb-4 sm:mb-6 md:mb-8 px-2"
        style={{
          fontFamily: "'urbanist'",
          fontSize: "clamp(24px, 8vw, 100px)",
        }}
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="bg-gradient-to-tr from-blue-400 to-green-400 text-transparent bg-clip-text font-urbanist
                       [text-shadow:_2px_2px_8px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out hover:tracking-widest hover:drop-shadow-[0_0_15px_rgba(147,51,234,0.6)] 
                       relative before:absolute before:inset-0 
                       before:translate-x-[-150%] hover:before:translate-x-[150%] before:transition-transform before:duration-700 before:opacity-30"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      {/* Desktop layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 xl:px-6 gap-6 xl:gap-8 flex-row items-center">
        {/* Left: Text */}
        <div ref={leftContentRef} className="w-full lg:w-[55%] xl:w-[600px] px-2 md:px-5">
          <h1 className="text-2xl xl:text-4xl font-extrabold leading-tight text-gray-900 mb-4 xl:mb-6">
            Discover and Connect <br />
            <span className="text-transparent xl:pr-10 bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
              Grow With Finite Marshall Club
            </span>
          </h1>

          <p className="text-gray-600 text-sm xl:text-lg max-w-2xl mb-4 xl:mb-6">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, career development,
            health and wellness, digital marketing, and more.
          </p>

          <div className="flex items-center gap-3 xl:gap-4">
            <Link to="/login">
              <button className="relative bg-white group border-2 hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                <span className="flex justify-center border-blue-500 border-2 items-center rounded-full gap-2 px-4 xl:px-6 py-2 xl:py-3 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300 text-sm xl:text-base">
                  Log In
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Slider */}
        <div ref={sliderRef} className="w-full lg:w-[45%] flex justify-end">
          <AutoSliderDesktop topics={topics} interval={3500} />
        </div>
      </div>

      {/* Mobile/Tablet layout */}
      <div ref={mobileContentRef} className="block lg:hidden max-w-4xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col items-center">
        {/* Text first */}
        <div className="w-full px-2 md:px-5 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Discover and Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
              Grow With Finite Marshall Club
            </span>
          </h1>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mb-3 sm:mb-4 mx-auto">
            Connect with industry leaders, learn new skills, and expand your knowledge through
            interactive webinars and seminars on topics like biotechnology, career development,
            health and wellness, digital marketing, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div>
              <Button className="bg-gradient-to-br from-blue-400 to-blue-700 text-white px-4 sm:px-5 md:px-6 py-2 text-sm sm:text-base rounded-full hover:bg-blue-800 hover:shadow-blue-600 hover:shadow-md hover:scale-110 transition w-full sm:w-auto">
                <a href="#packages" className="hover:text-white">
                  Explore Packages
                </a>
              </Button>
            </div>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="relative bg-white group border-2 hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-full w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                <span className="flex justify-center border-blue-500 border-2 items-center rounded-full gap-2 px-4 sm:px-5 md:px-6 py-2 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  Log In
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Slider below text */}
        <div className="w-full mt-4 sm:mt-5 md:mt-6">
          <AutoSliderMobile topics={topics} interval={3500} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;