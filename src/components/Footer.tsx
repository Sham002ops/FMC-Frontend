import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#421C96] text-white pt-16 pb-10 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
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

        {/* Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#about">About Us</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">GDPR</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
          <p className="text-sm text-gray-200 mb-4">
            Get the latest updates and news about upcoming webinars.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-l-md px-4 py-2 text-black w-full outline-none"
            />
            <button className="bg-gradient-to-r from-[#5536a3] to-[#A09FE0] text-white   px-4 py-2  rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-[#6132B4] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 max-w-7xl mx-auto">
        <p>© 2025 Finite Marshall Club. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#">Download iOS App</a>
          <a href="#">Download Android App</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
