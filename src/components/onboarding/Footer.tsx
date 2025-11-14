import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-green-500 text-white pt-16 pb-10 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Finite Marshall Club</h2>
          <p className="text-sm leading-relaxed text-gray-200">
            Discover and join expert-led webinars on topics like biotechnology, yoga, wellness, and more.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <div className="bg-[#5E33B8] p-2 rounded-full">
                <Twitter className="w-5 h-5 text-white" />
              </div>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <div className="bg-[#5E33B8] p-2 rounded-full">
                <Facebook className="w-5 h-5 text-white" />
              </div>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <div className="bg-[#5E33B8] p-2 rounded-full">
                <Instagram className="w-5 h-5 text-white" />
              </div>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <div className="bg-[#5E33B8] p-2 rounded-full">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="#how-it-works" className="hover:text-orange-300 transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#packages" className="hover:text-orange-300 transition">
                Packages
              </a>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-300 transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/terms" className="hover:text-orange-300 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-orange-300 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Contact</h3>
            <a
              href="mailto:fmcwebdev@gmail.com"
              className="text-sm text-gray-200 hover:text-orange-300 transition"
            >
              fmcwebdev@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-[#6132B4] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 max-w-7xl mx-auto">
        <p>© 2025 Finite Marshall Club. All rights reserved.</p>
        <p className="mt-3 md:mt-0 text-gray-300">
          Designed with ❤️ by Finite Marshall Club Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
