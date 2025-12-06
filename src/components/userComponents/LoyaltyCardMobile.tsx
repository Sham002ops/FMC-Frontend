import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoyaltyCardMobileProps {
  coins: number;
}

// FORMATTER (9-digit padding + comma formatting)
const formatCoins = (val: number) => {
  const padded = String(val).padStart(9, "0");
  return padded.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const LoyaltyCardMobile: React.FC<LoyaltyCardMobileProps> = ({ coins }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const coinsNumberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.from(cardRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.6,
        ease: 'back.out(1.3)'
      });

      // Coin count animation
      if (coinsNumberRef.current) {
        gsap.to(coinsNumberRef.current, {
          textContent: coins,
          duration: 1.5,
          delay: 0.3,
          snap: { textContent: 1 },
          onUpdate: function () {
            if (coinsNumberRef.current) {
              const val = Math.floor(Number(this.targets()[0].textContent));
              coinsNumberRef.current.textContent = formatCoins(val);
            }
          }
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [coins]);

  return (
    <div 
      ref={cardRef}
      className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 p-4 text-white shadow-md mt-4 flex flex-col items-center relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="flex items-center justify-center mb-1">
          <svg className="w-7 h-7 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <text x="10" y="14" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">★</text>
          </svg>
          <span className="text-lg font-bold">FMC Coins</span>
        </div>
        
        <div 
          ref={coinsNumberRef}
          className="text-3xl font-extrabold mb-1 text-center tracking-wide"
        >
          0
        </div>
        
        <p className="text-white text-sm text-center leading-tight px-1">
          Your loyalty coins will increase by <span className="font-bold text-yellow-200">1.2X</span> by each year.
        </p>
      </div>
    </div>
  );
};

export default LoyaltyCardMobile;
