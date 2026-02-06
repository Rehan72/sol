import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RealisticSun from "./RealisticSun";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Small delay for the 100% to breathe
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-deep-navy flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-radial-gradient from-solar-yellow/5 to-transparent blur-[100px]" />
      
      <div className="relative flex flex-col items-center">
        {/* Ultra-Realistic Sun System */}
        <RealisticSun className="w-48 h-48 mb-12" />

        {/* Logo Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
            SOLAR<span className="text-solar-yellow italic">MAX</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <span className="text-solar-yellow/40 font-black tracking-[0.5em] uppercase text-xs">Initializing Power</span>
            
            {/* Progress Bar Container */}
            <div className="w-64 h-1 bg-white/5 rounded-full mt-4 relative overflow-hidden">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-solar-yellow"
                 style={{ width: `${progress}%` }}
               />
            </div>
            
            {/* Percentage Text */}
            <span className="text-white/20 font-black text-2xl mt-4 tabular-nums">
              {progress}<span className="text-xs ml-1">%</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/40" />
      <div className="film-grain" />
    </motion.div>
  );
};

export default Preloader;
