import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useClerk } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-gradient-to-r from-blue-600 to-green-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white tracking-tight">
          Finite Marshall Club
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
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login" className="text-white hover:text-orange-400 transition">
            Login
          </Link>
          <Link to="/register">
            <Button className="rounded-full px-6 font-semibold border hover:scale-105 border-orange-400 shadow-sm shadow-orange-400 bg-white text-orange-500 hover:bg-gradient-to-r from-orange-400 to-orange-600 hover:text-white transition hover:shadow-orange-500  hover:border-orange-400">
              Join Now
            </Button>
          </Link>
          {/* <div
            onClick={handleSignout}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 cursor-pointer transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div> */}
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
        <div className="md:hidden px-6 py-4 bg-purple-900/90 backdrop-blur-sm">
          <nav className="flex flex-col gap-4 text-white text-sm font-medium">
            <a href="#how-it-works" className="hover:text-orange-400">How It Works</a>
            <a href="#packages" className="hover:text-orange-400">Packages</a>
            <a href="#webinars" className="hover:text-orange-400">Webinars</a>
            <a href="#testimonials" className="hover:text-orange-400">Testimonials</a>
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/20 pt-4">
            <Link to="/login" className="text-white hover:text-orange-400">Login</Link>
            <Link to="/register">
              <Button className="w-full rounded-full bg-white text-purple-700 hover:bg-purple-600 hover:text-white transition">
                Join Now
              </Button>
            </Link>
            <button
              onClick={handleSignout}
              className="w-full flex items-center justify-center gap-2 text-sm text-white hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
