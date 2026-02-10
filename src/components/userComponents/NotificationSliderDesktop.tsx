import React, { useEffect, useState } from 'react';
import { BackendUrl } from '@/Config';

interface Package {
  id: string;
  name: string;
}

interface Webinar {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  zoomLink: string;
  packageId: string;
  package?: Package;
}

interface Props {
  webinars: Webinar[];
  userPackageId?: string; // User's current package ID
  interval?: number;
  handleRegister?: (zoomLink: string) => void;
}

export const NotificationSliderDesktop: React.FC<Props> = ({
  webinars,
  userPackageId,
  interval = 4000,
  handleRegister,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Filter webinars by user's package AND upcoming dates
  const getEligibleWebinars = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return webinars
      .filter(webinar => {
        const webinarDate = new Date(webinar.date);
        const isUpcoming = webinarDate >= startOfToday;
        
        // If user has no package, show all webinars
        if (!userPackageId) return isUpcoming;
        
        // Show webinars that match user's package
        const isEligible = webinar.packageId === userPackageId;
        
        return isUpcoming && isEligible;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const eligibleWebinars = getEligibleWebinars();

  useEffect(() => {
    if (!eligibleWebinars.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eligibleWebinars.length);
    }, interval);
    return () => clearInterval(timer);
  }, [eligibleWebinars.length, interval]);

  const getFullThumbnailUrl = (thumbnailPath: string) => {
    if (!thumbnailPath) return '/placeholder-image.png';
    
    if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
      return thumbnailPath;
    }
    
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath : `/${thumbnailPath}`;
    return `${BackendUrl}${cleanPath}`;
  };

  const isToday = (dateString: string) => {
    const webinarDate = new Date(dateString);
    const today = new Date();
    return (
      webinarDate.getDate() === today.getDate() &&
      webinarDate.getMonth() === today.getMonth() &&
      webinarDate.getFullYear() === today.getFullYear()
    );
  };

  if (!eligibleWebinars.length) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-lg h-[400px] flex flex-col items-center justify-center">
        <svg className="w-16 h-16 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="text-2xl font-semibold mb-2">No Upcoming Webinars</h3>
        <p className="text-sm opacity-90">No webinars available for your package at the moment</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex w-full px-1 md:px-6 py-3 flex-col items-center">
      <div className="relative w-[900px] max-w-3xl h-[400px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {eligibleWebinars.map((webinar) => (
            <div key={webinar.id} className="w-full flex justify-center shrink-0 px-4">
              <div className="w-[700px] group transition-all duration-300">
                <div className="overflow-hidden rounded-lg shadow-lg relative group-hover:shadow-xl h-96">
                  <div className="relative h-96">
                    <img
                      src={getFullThumbnailUrl(webinar.thumbnail)}
                      alt={webinar.title}
                      className="w-full h-96 object-cover group-hover:scale-[1.03] transition-all"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Badge - TODAY or UPCOMING */}
                    <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full shadow backdrop-blur-sm ${
                      isToday(webinar.date)
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-yellow-400 text-black'
                    }`}>
                      {isToday(webinar.date) ? 'TODAY' : 'UPCOMING'}
                    </span>

                    {/* Package Badge */}
                    {webinar.package?.name && (
                      <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white shadow backdrop-blur-sm">
                        {webinar.package.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur-sm w-full px-5 pt-3 pb-6 text-left absolute bottom-0 left-0 rounded-b-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate">
                        {webinar.title}
                      </h3>
                      <p className="text-gray-200 text-sm mt-1">
                        {new Date(webinar.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRegister?.(webinar.zoomLink)}
                      className="ml-4 bg-blue-500 cursor-pointer hover:bg-blue-600 hover:scale-110 text-white text-base px-5 py-2 rounded-md shadow transition flex-shrink-0"
                    >
                      Register & Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dots */}
        <div className="mt-2 flex gap-2 justify-center absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          {eligibleWebinars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentIndex === idx ? 'bg-blue-400 scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
