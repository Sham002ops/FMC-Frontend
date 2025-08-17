import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/onboarding/Navbar';
import HeroSection from '@/components/onboarding/HeroSection';

import TreeWithIcons from '../components/onboarding/TreeWithIcons';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const PhaseOne: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionCount = 8;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ScrollTrigger snap for normal small scroll
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      snap: 1 / sectionCount,
      scrub: 0.3, // smooth scrub
    });

    let currentIndex = 0;
    let isScrolling = false;

    const goToSection = (index: number) => {
      if (index < 0) index = 0;
      if (index >= sectionCount) index = sectionCount - 1;
      isScrolling = true;

      gsap.to(container, {
        scrollTo: { y: container.querySelectorAll('section')[index], autoKill: false },
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          currentIndex = index;
          isScrolling = false;
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow ScrollTrigger to handle tiny wheel deltas smoothly
      if (Math.abs(e.deltaY) < 40) return;

      e.preventDefault();
      if (isScrolling) return;

      if (e.deltaY > 0) {
        goToSection(currentIndex + 1);
      } else {
        goToSection(currentIndex - 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar min-h-screen bg-gray-50 overflow-y-scroll h-screen"
    >
      <Navbar />
     
        <section className="snap-start pt-20 h-screen"><HeroSection /></section>
        <section className="snap-start pb-20 h-screen"><TreeWithIcons /></section>        
      
    </div>
  );
};

export default PhaseOne;
