// src/pages/Portfolio.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingPlansSection from '@/components/PricingPlansSection';
import UpcomingWebinarsSection from '@/components/UpcomingWebinarsSection';
import RealTimeFeaturesSection from '@/components/RealTimeFeaturesSection';
import AdminDashboardOverview from '@/components/AdminDashboardOverview';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const LandingPage: React.FC = () => {
  console.log("LandingPage rendered");
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20"> {/* Offset for fixed navbar */}
        <HeroSection />
        <UpcomingWebinarsSection />
        <HowItWorksSection />
        <PricingPlansSection />
        <RealTimeFeaturesSection />
        <AdminDashboardOverview />
        <TestimonialsSection />
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;
