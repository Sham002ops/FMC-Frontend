
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'light' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-event-primary',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`font-bold ${sizeClasses[size]} ${colorClasses[variant]} flex items-center`}>
        <div className="rounded-full bg-event-secondary p-1 flex items-center justify-center border-2 border-current">
          <div className="px-1">
            <span className="font-black tracking-tight">E</span>
            <span className="font-black tracking-tight">H</span>
          </div>
        </div>
        <span className="ml-2">Event Horizon</span>
      </div>
    </div>
  );
};

export default Logo;
