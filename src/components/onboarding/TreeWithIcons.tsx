// src/components/onboarding/TreeWithIcons.tsx
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Tree3 from "../../assets/Tree No.7.mp4";

export default function TreeWithIcons() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showBranches, setShowBranches] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          setShowBranches(true);
        }
      },
      { threshold: [0, 0.5, 0.7, 1] }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hidden md:block snap-start h-screen overflow-hidden bg-gray-50"
    >
      <h1 className="text-6xl font-bold text-center pb-4 mt-20 bg-gradient-to-r from-green-300 to-green-700 bg-clip-text text-transparent">
        Our Tree of Knowledge
      </h1>

      <div className="relative flex border border-gray-50 justify-center items-center -mt-28 h-full">
        {/* Tree video */}
        <video
          autoPlay
          muted
          playsInline
          className="absolute border-none bottom-0 left-1/2 transform -translate-x-1/2 w-[900px] rounded-full z-10 pointer-events-none"
        >
          <source src={Tree3} type="video/webm" />
        </video>

        {showInfo && (
          <div className="z-20">
            <svg
              viewBox="0 0 600 600"
              className="absolute pointer-events-none"
              style={{
                top: 190,
                right: 180.5,
                width: 400,
                height: 300,
                zIndex: 10,
              }}
            >
              <defs>
                <linearGradient id="leaves" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#81C784" />
                  <stop offset="50%" stopColor="#2196F3" />
                  <stop offset="100%" stopColor="#388E3C" />
                </linearGradient>
              </defs>
              <motion.path
                d="M50 370 Q800 400, 500 30"
                stroke="url(#leaves)"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 5 }}
                transition={{ delay: 0, duration: 0.6 }}
              />
            </svg>
            <div
              className="w-64 h-36 z-10 bg-blue-200 border-2 border-blue-500 rounded-xl absolute"
              style={{ top: 140, right: 100 }}
            />
          </div>
        )}

        {/* Icons */}
        {/* Your existing fixed-position icon divs remain unchanged */}
        {/* Yoga */}
        <motion.div
          className="z-20 absolute top-[322px] left-[490px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showBranches ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.5 }}
        >
          <div className="w-[100px] h-[100px] hover:border-2 hover:border-green-600 duration-300 bg-gradient-to-r from-green-500 to-lime-600 flex justify-center items-center rounded-full hover:shadow-md cursor-pointer hover:scale-125 transition-transform hover:shadow-green-500">
            <img src="/icons/biotech.svg" className="w-[70px] h-[70px] mx-auto" />
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          className="z-20 absolute top-[448px] left-[364px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showBranches ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.0 }}
        >
          <div className="w-[100px] h-[100px] bg-gradient-to-r from-blue-300 to-yellow-400 hover:border-2 duration-300 hover:border-yellow-400 flex justify-center items-center rounded-full hover:shadow-lg cursor-pointer hover:scale-125 transition-transform hover:shadow-yellow-400">
            <img src="/icons/education.svg" className="w-[70px] h-[70px] mx-auto" />
          </div>
        </motion.div>

        {/* Biotech */}
        <motion.div
          className="z-20 absolute top-[217px] right-[634.5px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showBranches ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.3 }}
        >
          <div className="w-[100px] h-[100px] rounded-full hover:border-2 duration-300 hover:border-orange-500 hover:shadow-md cursor-pointer hover:scale-125 transition-transform hover:shadow-orange-500 bg-white">
            <img src="/icons/yoga.svg" className="w-[100px] h-[100px] mx-auto" />
          </div>
        </motion.div>

        {/* Power */}
        <motion.div
          className="z-20 absolute top-[450px] right-[340px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showBranches ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <div className="w-[100px] h-[100px] flex justify-center duration-300 items-center rounded-full hover:shadow-md cursor-pointer hover:scale-125 hover:border-2 border-cyan-500 transition-transform hover:shadow-cyan-500">
            <img src="/icons/power.svg" className="w-[100px] h-[100px] mx-auto" />
          </div>
        </motion.div>

        {/* Wealth */}
        <motion.div
          className="z-20 absolute top-[325px] right-[467.5px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showBranches ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.3 }}
        >
          <div
            className="w-[100px] h-[100px] hover:border-2 duration-300 hover:border-blue-700 bg-gradient-to-r from-blue-300 to-blue-700 flex justify-center items-center rounded-full hover:shadow-md cursor-pointer hover:scale-125 transition-transform hover:shadow-blue-500"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          >
            <img src="/icons/wealth.svg" className="w-[60px] h-[60px] mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
