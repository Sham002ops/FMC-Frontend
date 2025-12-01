import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import FMC from '@/assets/FMC2.png'


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);

  // GSAP animation for mobile menu
  useEffect(() => {
    if (mobileMenuRef.current && navLinksRef.current) {
      if (mobileMenuOpen) {
        // Slide down animation
        gsap.fromTo(
          mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        
        // Stagger animation for nav links
        gsap.fromTo(
          navLinksRef.current.children,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: "power2.out" }
        );
      } else {
        // Slide up animation
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [mobileMenuOpen]);

  // Close mobile menu when nav link is clicked
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-gradient-to-r from-blue-600 to-green-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className=" flex justify-between gap-2 items-center">
            <div className='flex justify-between gap-4 items-center'>
              <img src={FMC} alt="Logo" className='w-10 h-10 rounded-full' />
                <div className='block lg:hidden'>
                  <div className="text-lg text-white font-bold">FMC</div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg text-white font-bold">FINITE MARSHALL CLUB</div>
                <div className="text-xs text-blue-200">Professional Learning Platform</div>
              </div>
          </div>
              

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-white text-sm font-semibold">
          <a href="#how-it-works" className="hover:text-orange-300 transition">
            How It Works
          </a>
          <a href="#packages" className="hover:text-orange-300 transition">
            Packages
          </a>
          <a href="#webinars" className="hover:text-orange-300 transition">
            Webinars
          </a>
          <a href="#testimonials" className="hover:text-orange-300 transition">
            Testimonials
          </a>
          <button 
            onClick={() => navigate("/about")} 
            className="hover:text-orange-300 transition cursor-pointer bg-none border-none"
          >
            About
          </button>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login">
            <Button className="rounded-full px-6 font-semibold border hover:scale-105 border-orange-400 shadow-sm shadow-orange-400 bg-white text-orange-500 hover:bg-gradient-to-r from-orange-400 to-orange-600 hover:text-white transition hover:shadow-orange-500 hover:border-orange-400">
              LogIn Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden px-6 overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 backdrop-blur-sm"
          style={{ height: 0, opacity: 0 }}
        >
          <nav ref={navLinksRef} className="flex flex-col gap-4 text-white text-sm font-medium py-4">
            <a 
              href="#how-it-works" 
              className="hover:text-orange-400"
              onClick={handleNavLinkClick}
            >
              How It Works
            </a>
            <a 
              href="#packages" 
              className="hover:text-orange-400"
              onClick={handleNavLinkClick}
            >
              Packages
            </a>
            <a 
              href="#webinars" 
              className="hover:text-orange-400"
              onClick={handleNavLinkClick}
            >
              Webinars
            </a>
            <a 
              href="#testimonials" 
              className="hover:text-orange-400"
              onClick={handleNavLinkClick}
            >
              Testimonials
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-3 justify-center border-t border-white/20 pt-4 pb-4">
            <Link to="/login" className="flex justify-center hover:text-orange-400">
              <button className="relative bg-white group border-2 hover:bg-blue-700 hover:text-white text-blue-700 overflow-hidden cursor-pointer rounded-full">
                <div className="absolute inset-0 px-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
                <span className="flex justify-center border-blue-500 border-2 items-center rounded-full gap-2 px-10 py-2 relative text-blue-500 font-bold group-hover:text-white transition-colors duration-300">
                  Log In
                </span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
