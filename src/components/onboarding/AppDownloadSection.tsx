// components/AppDownloadSection.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Smartphone, 
  Download, 
  MessageCircle, 
  Star,
  Users,
  ChevronRight,
  Play
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AppDownloadSectionProps {
  appName?: string;
  playStoreUrl?: string;
  whatsappChannelUrl?: string;
  stats?: {
    downloads?: string;
    rating?: string;
    users?: string;
  };
}

const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({
  appName = 'Finite Marshall Club',
  playStoreUrl = 'https://play.google.com/store/apps/details?id=com.finitemarshallclub',
  whatsappChannelUrl = 'https://whatsapp.com/channel/0029VarAlsO4WaC2OZ3umo1d',
  stats = {
    downloads: '10K+',
    rating: '4.8',
    users: '5K+'
  }
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const floatingIcon1Ref = useRef<HTMLDivElement>(null);
  const floatingIcon2Ref = useRef<HTMLDivElement>(null);
  const phoneIconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Floating animations
      if (floatingIcon1Ref.current) {
        gsap.to(floatingIcon1Ref.current, {
          y: -12,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }

      if (floatingIcon2Ref.current) {
        gsap.to(floatingIcon2Ref.current, {
          y: -12,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 0.5
        });
      }

      if (phoneIconRef.current) {
        gsap.to(phoneIconRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }

      // Scroll triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      if (phoneRef.current) {
        tl.from(phoneRef.current, {
          x: -80,
          opacity: 0,
          rotation: -5,
          duration: 0.9,
          ease: 'power3.out'
        });
      }

      if (contentRef.current) {
        tl.from(contentRef.current.querySelectorAll('.content-item'), {
          y: 25,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.5');
      }

      if (statsRef.current) {
        tl.from(statsRef.current.children, {
          scale: 0.85,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: 'back.out(1.7)'
        }, '-=0.3');
      }

      if (buttonsRef.current) {
        tl.from(buttonsRef.current.children, {
          y: 15,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.2');
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Micro-interactions
  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      y: -2,
      duration: 0.3,
      ease: 'power2.out'
    });

    const chevron = e.currentTarget.querySelector('.chevron-icon');
    if (chevron) {
      gsap.to(chevron, { x: 4, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    const chevron = e.currentTarget.querySelector('.chevron-icon');
    if (chevron) {
      gsap.to(chevron, { x: 0, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleStatHover = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -6,
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
      duration: 0.3,
      ease: 'power2.out'
    });

    const icon = e.currentTarget.querySelector('.stat-icon');
    if (icon) {
      gsap.to(icon, { rotation: 360, duration: 0.5, ease: 'power2.out' });
    }
  };

  const handleStatLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: COMPACT PHONE MOCKUP */}
            <div ref={phoneRef} className="relative flex justify-center">
            <div className="relative">
              
              {/* Floating WhatsApp Icon - Top Left */}
              <div 
                ref={floatingIcon1Ref}
                className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg z-10"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              
              {/* Floating Download Icon - Bottom Right */}
              <div 
                ref={floatingIcon2Ref}
                className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg z-10"
              >
                <Download className="w-6 h-6 text-white" />
              </div>

              {/* Phone Mockup - Smaller */}
              <div className="relative w-56 sm:w-64 h-[480px] sm:h-[520px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-2.5 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                  
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
                  
                    {/* Screen Content */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex flex-col items-center justify-center p-6">
                    <div ref={phoneIconRef} className="relative w-20 h-20 mb-3">
                        {/* FMC Logo */}
                        <img 
                        src="/FMC2.png" 
                        alt="FMC Logo" 
                        width={80} 
                        height={80}
                        className="w-full h-full object-contain drop-shadow-lg rounded-2xl"
                        />
                    </div>
                    <h3 className="text-white text-lg font-bold text-center mb-1.5">{appName}</h3>
                    <p className="text-white/80 text-sm text-center">Available Now</p>
                    
                    {/* Dots */}
                    <div className="flex gap-1.5 mt-4">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    </div>
                    </div>

                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: COMPACT CONTENT */}
            <div ref={contentRef} className="space-y-5 lg:space-y-6">
            
            {/* Badge */}
            <div className="content-item inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Download Our App
            </div>
            
            {/* Heading - Smaller */}
            <h2 className="content-item text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{appName}</span> on the Go
            </h2>
            
            {/* Description - Compact */}
            <p className="content-item text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
              Get instant access to exclusive features, real-time updates, and seamless performance.
            </p>

            {/* COMPACT STATS */}
            <div ref={statsRef} className="grid grid-cols-3 gap-3">
              <div 
                className="text-center p-3 bg-white rounded-xl shadow-sm cursor-pointer"
                onMouseEnter={handleStatHover}
                onMouseLeave={handleStatLeave}
              >
                <Download className="stat-icon w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-gray-900">{stats.downloads}</div>
                <div className="text-xs text-gray-600">Downloads</div>
              </div>

              <div 
                className="text-center p-3 bg-white rounded-xl shadow-sm cursor-pointer"
                onMouseEnter={handleStatHover}
                onMouseLeave={handleStatLeave}
              >
                <Star className="stat-icon w-5 h-5 text-yellow-500 mx-auto mb-1.5 fill-yellow-500" />
                <div className="text-xl font-bold text-gray-900">{stats.rating}</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>

              <div 
                className="text-center p-3 bg-white rounded-xl shadow-sm cursor-pointer"
                onMouseEnter={handleStatHover}
                onMouseLeave={handleStatLeave}
              >
                <Users className="stat-icon w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-gray-900">{stats.users}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
            </div>

            {/* COMPACT BUTTONS */}
            <div ref={buttonsRef} className="space-y-3">
              
              {/* Google Play - Compact */}
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg cursor-pointer"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-[10px] opacity-90 uppercase tracking-wide">Get it on</div>
                    <div className="text-base font-bold">Google Play</div>
                  </div>
                </div>
                <ChevronRight className="chevron-icon w-4 h-4" />
              </a>

              {/* WhatsApp Channel - Compact */}
              <a
                href={whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-3 bg-white border-2 border-green-500 text-gray-900 rounded-xl shadow-md cursor-pointer"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">Join our</div>
                    <div className="text-base font-bold text-green-600">WhatsApp Channel</div>
                  </div>
                </div>
                <ChevronRight className="chevron-icon w-4 h-4 text-green-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
