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

const AutoSliderMobile: React.FC<Props> = ({ topics, interval = 3000 }) => {
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
    <div className="block lg:hidden w-full px-2 py-3 flex flex-col items-center">
      <div className="relative w-full max-w-md h-[300px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {topics.map((topic, idx) => (
            <div key={idx} className="w-full shrink-0 px-2">
              <div className="w-full group transition-all duration-300">
                <div className="overflow-hidden rounded-lg shadow-lg relative group-hover:shadow-xl">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-[250px] object-cover group-hover:scale-[1.03] transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <span className={`absolute top-2 left-2 px-2 py-1 text-xs text-white rounded-full ${topic.color} shadow backdrop-blur-sm`}>
                    {topic.title}
                  </span>
                  <div className="bg-transparent backdrop-blur-sm w-full px-3 pt-1 pb-2 text-left absolute bottom-0">
                    <h3 className="text-sm font-bold text-blue-200">{topic.title}</h3>
                    <p className="text-white text-xs mt-1">{topic.description}</p>
                    <button onClick={handleRegister} className="mt-2 border border-orange-500 text-orange-500 px-3 py-1 rounded-md text-xs hover:bg-gradient-to-r from-orange-400 to-orange-700 hover:text-white transition">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-2 flex gap-2 justify-center">
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

export default AutoSliderMobile;
