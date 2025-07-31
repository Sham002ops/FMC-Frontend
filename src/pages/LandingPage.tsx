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


gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {


   useEffect(() => {
    ScrollTrigger.create({
      trigger: '#snap-container',
      start: 'top top',
      end: 'bottom bottom',
      snap: 1 / 3, // snaps to 3 sections
      scrub: true,
    });
  }, []);
  console.log("LandingPage rendered");
  return (
  <div className=" hide-scrollbar scroll-smooth min-h-screen bg-gray-50 snap-y snap-mandatory overflow-y-scroll h-screen">
    <Navbar />
    <main className="pt-20 hide-scrollbar ">
      <section className="snap-start pt-20 h-screen">
        <HeroSection />
      </section>
      <section className="snap-start pb-20 h-screen">
        <TreeWithIcons />
      </section>
      <section className="snap-start h-screen">
        <UpcomingWebinarsSection />
      </section>
      <section className="snap-start h-screen">
        <HowItWorksSection />
      </section>
      <section className="snap-start h-screen">
        <PricingPlansSection />
      </section>
      <section className="snap-start h-screen">
        <RealTimeFeaturesSection />
      </section>
      <section className="snap-start h-screen">
        <TestimonialsSection />
      </section>
      <section className="snap-start pt-64 h-screen">
        <Footer />
      </section>
    </main>
  </div>
);
};

export default LandingPage;
