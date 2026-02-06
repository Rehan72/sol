import React, { useId } from "react";
import { motion } from "framer-motion";

const RealisticSun = ({ className = "w-48 h-48", scale = 1, rotate = true }) => {
  const filterId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 * scale }}
      animate={{ opacity: 1, scale: scale }}
      transition={{ duration: 1 }}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* 1. Cinematic Lens Flare Elements */}
      <motion.div
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-50"
      >
        <div className="absolute w-[60%] h-[60%] bg-solar-yellow/20 -top-[20%] -left-[20%] blur-xl animate-pulse" />
        <div className="absolute w-[30%] h-[30%] bg-blue-300/10 top-[40%] left-[80%] blur-lg" />
      </motion.div>

      {/* 2. Deep Volumetric Atmosphere */}
      <div className="absolute inset-[-60%] bg-radial-gradient from-solar-yellow/30 via-solar-gold/10 to-transparent blur-[60px] rounded-full mix-blend-screen" />

      {/* 3. 3D Volumetric Light Shafts */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: rotate ? [angle, angle + 360] : angle,
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25 + i * 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-[200%] h-1 volumetric-shaft"
          style={{ rotate: angle }}
        />
      ))}

      {/* 4. The Celestial Core (Spherical & Boiling) */}
      <div className="relative w-full h-full rounded-full sun-depth-shadow overflow-hidden sun-spherical-mask mix-blend-screen">
        {/* Boiling Plasma Overlay (SVG Filtered) */}
        <div
          className="absolute inset-0 z-20 plasma-boil-overlay bg-solar-yellow/30"
          style={{ filter: `url(#${filterId})` }}
        />

        <motion.img
          animate={rotate ? { rotate: 360 } : {}}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          src="/assets/sun_v2.png"
          alt="Sun"
          className="w-full h-full object-cover scale-125"
        />

        {/* Surface Turbulence Filter */}
        <svg width="0" height="0" className="absolute invisible">
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="2">
              <animate attributeName="baseFrequency" dur="20s" values="0.015;0.018;0.015" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="25" />
          </filter>
        </svg>
      </div>

      {/* 5. Extreme Core Exposure */}
      <div className="absolute w-1/4 h-1/4 bg-white/40 blur-2xl rounded-full z-30" />
    </motion.div>
  );
};

export default RealisticSun;
