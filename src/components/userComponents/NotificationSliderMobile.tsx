// NotificationSliderMobile.tsx
import React, { useEffect, useState } from 'react';
import { BackendUrl } from '@/Config'; // ← Add import

interface Webinar {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  zoomLink: string;
  packageId: string;
}

interface Props {
  webinars: Webinar[];
  interval?: number;
  handleRegister?: (zoomLink: string) => void;
}

export const NotificationSliderMobile: React.FC<Props> = ({ 
  webinars, 
  interval = 4000 ,
  handleRegister
}) => {
  const [idx, setIdx] = useState(0);

  // ✅ Filter to show only today and upcoming webinars
  const getUpcomingWebinars = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return webinars
      .filter(webinar => {
        const webinarDate = new Date(webinar.date);
        return webinarDate >= startOfToday;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingWebinars = getUpcomingWebinars();

  useEffect(() => {
    if (!upcomingWebinars.length) return;
    const timer = setInterval(() => 
      setIdx((i) => (i + 1) % upcomingWebinars.length), 
      interval
    );
    return () => clearInterval(timer);
  }, [upcomingWebinars.length, interval]);

  // ✅ Helper function to get full thumbnail URL
  const getFullThumbnailUrl = (thumbnailPath: string) => {
    if (!thumbnailPath) return '/placeholder-image.png';
    
    if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
      return thumbnailPath;
    }
    
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath : `/${thumbnailPath}`;
    return `${BackendUrl}${cleanPath}`;
  };

  // ✅ Check if webinar is today
  const isToday = (dateString: string) => {
    const webinarDate = new Date(dateString);
    const today = new Date();
    return (
      webinarDate.getDate() === today.getDate() &&
      webinarDate.getMonth() === today.getMonth() &&
      webinarDate.getFullYear() === today.getFullYear()
    );
  };

  if (!upcomingWebinars.length) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg h-44 flex items-center justify-center">
        <h3 className="text-lg font-semibold">No upcoming webinars</h3>
      </div>
    );
  }

  const w = upcomingWebinars[idx];
  
  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-lg h-[200px] sm:h-[400px] bg-cover bg-center" 
      style={{ backgroundImage: `url(${getFullThumbnailUrl(w.thumbnail)})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
        <div>
          {/* ✅ Dynamic badge - shows "TODAY" or "UPCOMING" */}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            isToday(w.date)
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-yellow-400 text-black'
          }`}>
            {isToday(w.date) ? 'TODAY' : 'UPCOMING'}
          </span>
          
          <h3 className="text-white text-base font-bold truncate mt-1">
            {w.title}
          </h3>
          
          <p className="text-gray-200 text-xs">
            {new Date(w.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <a 
          onClick={() => handleRegister(w.zoomLink)}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer hover:scale-110 text-white text-sm px-3 py-1 rounded-md shadow transition"
        >
         Register & Join
        </a>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {upcomingWebinars.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-transform ${
              i === idx ? 'bg-white scale-125' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
