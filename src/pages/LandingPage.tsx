// src/pages/Portfolio.tsx
import React, { useEffect } from 'react';
import Navbar from '@/components/onboarding/Navbar';
import HeroSection from '@/components/onboarding/HeroSection';
import HowItWorksSection from '@/components/onboarding/HowItWorksSection';
import PricingPlansSection from '@/components/onboarding/PricingPlansSection';
import UpcomingWebinarsSection from '@/components/onboarding/UpcomingWebinarsSection';
import RealTimeFeaturesSection from '@/components/onboarding/RealTimeFeaturesSection';
import TestimonialsSection from '@/components/onboarding/TestimonialsSection';
import Footer from '@/components/onboarding/Footer';
import TreeWithIcons from '../components/onboarding/TreeWithIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import AppDownloadSection from '@/components/onboarding/AppDownloadSection';

const LandingPage: React.FC = () => {
  console.log("LandingPage rendered");
  
  return (
    // ✅ REMOVED: overflow-y-scroll h-screen snap-y
    // ✅ ADDED: Simple overflow-x-hidden
    <div className="hide-scrollbar scroll-smooth min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      <main className="pt-20 hide-scrollbar">
        <HeroSection/>
        <TreeWithIcons/>
        <HowItWorksSection/>
        <PricingPlansSection/>
        <RealTimeFeaturesSection/>
        {/* <UpcomingWebinarsSection/> */}
        {/* <TestimonialsSection/> */}
        
        {/* ✅ App Download Section */}
        <AppDownloadSection
          appName="Finite Marshall Club"
          playStoreUrl="https://drive.google.com/file/d/1-rur2iYWfrNyBfCMGgIYiqXa9n8BSb89/view"
          // appStoreUrl="https://apps.apple.com/app/your-app"
          whatsappChannelUrl="https://whatsapp.com/channel/0029Vb7ULSfHFxOsbADktD2m"
          stats={{
            downloads: '10K+',
            rating: '4.8',
            users: '5K+'
          }}
        />
        
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;
