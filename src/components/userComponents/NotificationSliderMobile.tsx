// NotificationSliderMobile.tsx
import React, { useEffect, useState } from 'react';

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
}

export const NotificationSliderMobile: React.FC<Props> = ({ webinars, interval = 4000 }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!webinars.length) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % webinars.length), interval);
    return () => clearInterval(timer);
  }, [webinars, interval]);

  if (!webinars.length) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg h-44 flex items-center justify-center">
        <h3 className="text-lg font-semibold">No upcoming webinars</h3>
      </div>
    );
  }

  const w = webinars[idx];
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-44 bg-cover bg-center" style={{ backgroundImage: `url(${w.thumbnail})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-medium bg-yellow-400 text-black px-2 py-0.5 rounded-full">UPCOMING</span>
          <h3 className="text-white text-base font-bold truncate mt-1">{w.title}</h3>
          <p className="text-gray-200 text-xs">
            {new Date(w.date).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
          </p>
        </div>
        <a href={w.zoomLink} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md shadow">
          Join
        </a>
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {webinars.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-transform ${i === idx ? 'bg-white scale-125' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};
