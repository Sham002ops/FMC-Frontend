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
      <h1 className="text-6xl font-bold text-center mt-20 bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
        The Five Pillars of Progress:
      </h1>
      <h1 className="text-2xl font-bold text-center  text-slate-700 mb-9">
        A Journey Through Yoga, Education, Biotech, Power, and Wealth
      </h1>

      {/* ---------- Responsive Container ---------- */}
      <div className="relative flex justify-center items-center -mt-28 h-full">
        <div className="relative w-full max-w-[900px] aspect-[16/9]">

          {/* Tree Video */}
          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
          >
            <source src={Tree3} type="video/webm" />
          </video>

          {/* Branch Info Popup */}
          {showInfo && (
            <div className="z-20">
              <svg
                viewBox="0 0 600 600"
                className="absolute pointer-events-none"
                style={{
                  top: "20%",
                  left: "60%",
                  width: "40%",
                  height: "40%",
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
                className="w-64 h-36 bg-blue-200 border-2 border-blue-500 rounded-xl absolute"
                style={{ top: "15%", left: "55%" }}
              />
            </div>
          )}

          {/* ---------- Icons (now percentage-based) ---------- */}

          {/* Biotech */}
          <motion.div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "25%", left: "63%" }} // adjust later
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showBranches ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.4 }}
          >
            <div className="w-[100px] h-[100px] hover:border-2 hover:border-green-600 duration-300 bg-gradient-to-r from-green-500 to-lime-600 flex justify-center items-center rounded-full hover:shadow-md cursor-pointer hover:scale-125 hover:shadow-green-500">
              <img src="/icons/biotech.svg" className="w-[70px]" />
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "50%", left: "14%" }} // adjust later
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showBranches ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.0 }}
          >
            <div className="w-[100px] h-[100px] bg-gradient-to-r from-blue-300 to-yellow-400 hover:border-2 duration-300 hover:border-yellow-400 flex justify-center items-center rounded-full hover:shadow-lg cursor-pointer hover:scale-125 hover:shadow-yellow-400">
              <img src="/icons/education.svg" className="w-[70px]" />
            </div>
          </motion.div>

          {/* Yoga */}
          <motion.div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "6%", left: "45%" }} // adjust later
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showBranches ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.3 }}
          >
            <div className="w-[100px] h-[100px] rounded-full hover:border-2 duration-300 hover:border-orange-500 hover:shadow-md cursor-pointer hover:scale-125 hover:shadow-orange-500 bg-white">
              <img src="/icons/yoga.svg" className="w-[100px]" />
            </div>
          </motion.div>

          {/* Power */}
          <motion.div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "52%", left: "78%" }} // adjust later
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showBranches ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2 }}
          >
            <div className="w-[100px] h-[100px] flex justify-center items-center rounded-full hover:border-2 border-cyan-500 duration-300 hover:shadow-md cursor-pointer hover:scale-125 hover:shadow-cyan-500">
              <img src="/icons/power.svg" className="w-[100px]" />
            </div>
          </motion.div>

          {/* Wealth */}
          <motion.div
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "24%", left: "28%" }} // adjust later
            initial={{ opacity: 0, scale: 0.8 }}
            animate={showBranches ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.3 }}
          >
            <div
              className="w-[100px] h-[100px] hover:border-2 duration-300 hover:border-blue-700 bg-gradient-to-r from-blue-300 to-blue-700 
                          flex justify-center items-center rounded-full hover:shadow-md cursor-pointer hover:scale-125 hover:shadow-blue-500">
              <img src="/icons/wealth.svg" className="w-[60px]" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
