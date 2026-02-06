import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import RealisticSun from "./ui/RealisticSun";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-deep-navy text-white font-sans selection:bg-solar-yellow selection:text-deep-navy antialiased overflow-hidden">
      {/* 1. Global Background Gradient */}
      {/* <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #020010 0%, #001f3f 40%, #001020 80%, #020010 100%)" }}
      /> */}

      {/* 2. Cinematic Lens Overlays */}
      {/* <div className="film-grain" />
      <div className="cinematic-vignette" /> */}

      {/* 3. Mouse-Reactive Flare Layer (Top Layer) */}
      {/* <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-solar-yellow/5 rounded-full blur-[100px] pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePos.x - 200,
          y: mousePos.y - 200,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 0.5 }}
      /> */}

      {/* 4. The Realistic Sun System - Perfectly centered in the viewport slot next to the sidebar */}
      {/* <div className="fixed inset-y-0 right-0 lg:left-72 pointer-events-none z-0 flex items-center justify-center opacity-20">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <RealisticSun className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]" scale={1} rotate={false} />
        </div>
      </div> */}

      {/* Header (Sticky but z-indexed above the sun) */}
      <header className="sticky top-0 z-40 w-full glass border-b border-white/5 backdrop-blur-3xl">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
          <main className="relative flex-1 p-6 md:p-10 z-10">
            <div className="mx-auto max-w-screen-2xl">
              {children}
            </div>
          </main>

         
        </div>
      </div>
       {/* Footer */}
          <footer className="relative z-10 px-6 py-8 md:px-10 border-t border-white/5 bg-black/20 backdrop-blur-xl mt-auto">
            <Footer />
          </footer>
    </div>
  );
}

export default Layout;
