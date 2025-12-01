import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Topic {
  title: string;
  image: string;
  description: string;
  color: string;
}

interface Props {
  topics: Topic[];
  interval?: number;
}

const AutoSliderDesktop: React.FC<Props> = ({ topics, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
    
    const handleRegister = () => {
      navigate("/login")
    }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topics.length);
    }, interval);
    return () => clearInterval(timer);
  }, [topics.length, interval]);

  return (
    <div className="hidden lg:flex w-full px-1 md:px-6 py-3 flex-col items-center">
      <div className="relative w-[900px] max-w-3xl h-[400px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {topics.map((topic, idx) => (
            <div key={idx} className="w-full flex justify-center shrink-0 px-4">
              <div className="w-[700px] group transition-all duration-300">
                <div className="overflow-hidden rounded-lg shadow-lg relative group-hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-96 object-cover group-hover:scale-[1.03] transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <span className={`absolute top-4 left-4 px-3 py-1 text-sm text-white rounded-full ${topic.color} shadow backdrop-blur-sm`}>
                      {topic.title}
                    </span>
                  </div>
                  <div className="bg-transparent backdrop-blur-sm w-full px-5 pt-1 pb-3 text-left absolute bottom-0">
                    <h3 className="text-lg font-bold text-blue-200">
                      {topic.title}
                    </h3>
                    <p className="text-white text-sm mt-1">{topic.description}</p>
                    <button onClick={handleRegister} className="mt-4 border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-gradient-to-r from-orange-400 to-orange-700 hover:text-white transition">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-1 flex gap-2 justify-center">
        {topics.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === idx ? "bg-orange-400 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSliderDesktop;
