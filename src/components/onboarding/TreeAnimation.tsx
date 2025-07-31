import { motion } from "framer-motion";

export default function RealisticTree() {
  return (
    <div className="w-full flex justify-center py-10 bg-gradient-to-b from-amber-50 to-blue-100">
      <svg viewBox="0 0 600 600" className="w-[600px] h-auto">
        <defs>
          <linearGradient id="bark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
          <linearGradient id="leaves" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#388E3C" />
          </linearGradient>
        </defs>

        {/* Trunk with curvature */}
        <motion.path
          d="M300 580 C290 500, 310 420, 300 360"
          stroke="url(#bark)"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Main branches (left) */}
        <motion.path
          d="M300 400 C250 360, 200 300, 180 260"
          stroke="url(#bark)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        <motion.path
          d="M250 350 C200 320, 160 280, 140 240"
          stroke="url(#bark)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* Main branches (right) */}
        <motion.path
          d="M300 400 C350 360, 400 300, 420 260"
          stroke="url(#bark)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        <motion.path
          d="M350 350 C400 320, 440 280, 460 240"
          stroke="url(#bark)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* Curvy outer branches */}
        <motion.path
          d="M180 260 C160 220, 140 180, 120 150"
          stroke="url(#bark)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />

        <motion.path
          d="M420 260 C440 220, 460 180, 480 150"
          stroke="url(#bark)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />

        {/* Top branches */}
        <motion.path
          d="M300 360 C300 320, 300 280, 300 240"
          stroke="url(#bark)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        />

        {/* Tiny branch tips (leafy feel) */}
        <motion.path
          d="M300 240 Q290 220, 280 200"
          stroke="url(#leaves)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        />
        <motion.path
          d="M300 240 Q310 220, 320 200"
          stroke="url(#leaves)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        />
      </svg>
    </div>
  );
}
