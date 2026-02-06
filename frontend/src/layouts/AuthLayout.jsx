import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-deep-navy font-sans antialiased text-white">
      {/* Dynamic Background Gradient */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #001f3f 0%, #003366 40%, #FF8C00 80%, #FFD700 100%)" }}
      />

      {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      
      {/* Reactive Cursor Flare */}
      <motion.div 
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-solar-yellow/5 rounded-full blur-[100px] pointer-events-none z-50 mix-blend-screen"
        animate={{ 
          x: mousePos.x - 200, 
          y: mousePos.y - 200,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 0.5 }}
      />

      {/* Ultra-Realistic Sun System (Background Layer) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            opacity: { duration: 2 },
            scale: { duration: 2 },
            y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-[600px] md:w-[1000px] aspect-square"
        >
          {/* 1. Cinematic Lens Flare Elements */}
          <div className="absolute inset-0 pointer-events-none z-50">
            <div className="lens-flare-element w-32 h-32 bg-solar-yellow/20 -top-20 -left-20 animate-pulse" />
            <div className="lens-flare-element w-16 h-16 bg-blue-300/10 top-40 left-60" />
            <div className="lens-flare-element w-48 h-48 lens-flare-halo -bottom-40 -right-20" />
          </div>

          {/* 2. Deep Volumetric Atmosphere */}
          <div className="absolute inset-[-60%] bg-radial-gradient from-solar-yellow/30 via-solar-gold/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />

          {/* 3. 3D Volumetric Light Shafts */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <motion.div
              key={i}
              animate={{ 
                rotate: [angle, angle + 360], 
                opacity: [0.05, 0.15, 0.05],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 30 + i * 3, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300%] h-2 volumetric-shaft"
              style={{ rotate: angle }}
            />
          ))}

          {/* 4. The Celestial Core */}
          <div className="relative w-full h-full rounded-full sun-depth-shadow overflow-hidden sun-spherical-mask mix-blend-screen opacity-40">
            <div className="absolute inset-0 z-20 plasma-boil-overlay bg-solar-yellow/30" />
            <motion.img 
              animate={{ rotate: 360 }}
              transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
              src="/assets/sun_v2.png" 
              alt="Sun" 
              className="w-full h-full object-cover scale-150"
            />
            {/* Surface Turbulence Filter */}
            <svg width="0" height="0" className="absolute invisible">
              <filter id="plasma-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="2">
                  <animate attributeName="baseFrequency" dur="20s" values="0.015;0.018;0.015" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="25" />
              </filter>
            </svg>
          </div>
        </motion.div>
      </div>

      {children}
    </div>
  );
};

export default AuthLayout;
