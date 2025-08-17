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

export const NotificationSliderDesktop: React.FC<Props> = ({
  webinars,
  interval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!webinars.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % webinars.length);
    }, interval);
    return () => clearInterval(timer);
  }, [webinars.length, interval]);

  if (!webinars.length) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-lg h-[400px] flex items-center justify-center">
        <h3 className="text-2xl font-semibold">No upcoming webinars</h3>
      </div>
    );
  }

  return (
    <div className="hidden  lg:flex w-full px-1 md:px-6 py-3 flex-col items-center">
      <div className="relative w-[900px] max-w-3xl h-[400px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {webinars.map((webinar, idx) => (
            <div key={webinar.id} className="w-full flex justify-center shrink-0 px-4">
              <div className="w-[700px] group transition-all duration-300">
                <div className="overflow-hidden rounded-lg shadow-lg relative group-hover:shadow-xl h-96">
                  <div className="relative h-96">
                    <img
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-full h-96 object-cover group-hover:scale-[1.03] transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 text-sm text-black font-semibold rounded-full bg-yellow-400 shadow backdrop-blur-sm">
                      UPCOMING
                    </span>
                  </div>
                  <div className="bg-black/80 backdrop-blur-sm w-full px-5 pt-3 pb-6 text-left absolute bottom-0 left-0 rounded-b-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white truncate">
                        {webinar.title}
                      </h3>
                      <p className="text-gray-200 text-sm mt-1">
                        {new Date(webinar.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <a
                      href={webinar.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white text-base px-5 py-2 rounded-md shadow transition"
                    >
                      Join
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="mt-2 flex gap-2 justify-center absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          {webinars.map((_, idx) => (
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
