import React from 'react';

interface LoyaltyCardMobileProps {
  coins: number;
}

const LoyaltyCardMobile: React.FC<LoyaltyCardMobileProps> = ({ coins }) => (
  <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 p-4 text-white shadow-md mt-4 flex flex-col items-center">
    <div className="flex items-center justify-center mb-1">
      <svg className="w-7 h-7 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="currentColor" />
        <text x="10" y="14" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">★</text>
      </svg>
      <span className="text-lg font-bold">FMC Coins</span>
    </div>
    <div className="text-3xl font-extrabold mb-1">{coins.toLocaleString()}</div>
    <p className="text-white text-sm text-center leading-tight px-1">
      Your loyalty coins will increase by <span className="font-bold text-yellow-200">1.2X</span> by each year.
    </p>
  </div>
);

export default LoyaltyCardMobile;
