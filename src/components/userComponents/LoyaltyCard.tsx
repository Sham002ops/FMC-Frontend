import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoyaltyCardProps {
  coins: number;
  username: string;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ coins, username }) => {
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLDivElement>(null);
  const coinsContainerRef = useRef<HTMLDivElement>(null);
  const coinsNumberRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance
      gsap.from(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.8,
        ease: 'back.out(1.5)'
      });

      // Header
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.5,
        delay: 0.2
      });

      // Username
      gsap.from(usernameRef.current, {
        opacity: 0,
        x: -15,
        duration: 0.5,
        delay: 0.3
      });

      // Coins container
      gsap.from(coinsContainerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: 0.4
      });

      // Count up animation
      if (coinsNumberRef.current) {
        gsap.to(coinsNumberRef.current, {
          textContent: coins,
          duration: 1.5,
          delay: 0.5,
          snap: { textContent: 1 },
          onUpdate: function() {
            if (coinsNumberRef.current) {
              const val = Math.floor(this.targets()[0].textContent);
              coinsNumberRef.current.textContent = val.toLocaleString();
            }
          }
        });
      }

      // Message
      gsap.from(messageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.7
      });
    }, cardRef);

    return () => ctx.revert();
  }, [coins]);

  return (
    <div 
      ref={cardRef}
      className="w-[350px] h-[400px] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
    >
      {/* Background circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-white rounded-full"></div>
      </div>
      
      {/* Content - Fixed layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header - Fixed */}
        <div ref={headerRef} className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold animate-in">FMC Coins</h3>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Username - Fixed */}
        <div ref={usernameRef} className="mb-6">
          <p className="text-sm opacity-90 mb-1">Member</p>
          <p className="text-xl font-bold">{username}</p>
        </div>

        {/* Spacer to push coins to center */}
        <div className="flex-1 flex items-center justify-center">
          {/* Coins Display - Centered */}
          <div ref={coinsContainerRef} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <p ref={coinsNumberRef} className="text-5xl font-bold mb-2">
              0
            </p>
            <p className="text-sm opacity-90">FMC Coins</p>
          </div>
        </div>

        {/* Message - Fixed at bottom */}
        <div ref={messageRef} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-auto">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Loyalty Boost</p>
              <p className="text-sm opacity-90 leading-relaxed">
                Your FMC coins will increase by 1.2X over the next year as you continue learning with us!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard;
