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



const LandingPage: React.FC = () => {


  console.log("LandingPage rendered");
  return (
  <div className=" hide-scrollbar scroll-smooth min-h-screen bg-gray-50 snap-y overflow-y-scroll h-screen">
    <Navbar />
    <main className="pt-20 hide-scrollbar ">
      <HeroSection/>
      <TreeWithIcons/>
        <HowItWorksSection/>
        <PricingPlansSection/>
        <RealTimeFeaturesSection/>
        {/* <UpcomingWebinarsSection/> */}
        <TestimonialsSection/>
        <Footer/>
    </main>
  </div>
);
};

export default LandingPage;
