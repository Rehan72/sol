import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { 
  Sun, 
  Battery, 
  Zap, 
  LineChart, 
  BarChart3,
  Search,
  Settings, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  Home,
  Building2,
  Car,
  Factory,
  CloudLightning,
  TrendingUp,
  Activity,
  Shield,
  DollarSign,
  Leaf
} from "lucide-react";
import { Button } from "../components/ui/button";
import SolarCalculator from "../components/sections/SolarCalculator";
import RealisticSun from "../components/ui/RealisticSun";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Sun movement and intensity
  const sunY = useTransform(scrollYProgress, [0, 0.5], ["0%", "80%"]);
  const sunScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 0.8, 0.4]);
  const skyBackground = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      "linear-gradient(180deg, #001f3f 0%, #003366 40%, #FF8C00 80%, #FFD700 100%)",
      "linear-gradient(180deg, #000c1a 0%, #001f3f 40%, #8B4513 80%, #FFA500 100%)",
      "linear-gradient(180deg, #00050a 0%, #000c1a 40%, #2F4F4F 80%, #708090 100%)",
      "linear-gradient(180deg, #000000 0%, #00050a 40%, #001f3f 80%, #003366 100%)"
    ]
  );



  const [activeStep, setActiveStep] = React.useState(0);
  const [comparisonMode, setComparisonMode] = React.useState("solar"); // "grid" or "solar"
  const [energyCycle, setEnergyCycle] = React.useState("day"); // "day" or "night"

  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-deep-navy text-white font-sans selection:bg-solar-yellow selection:text-deep-navy antialiased">
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

      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b-0 py-4 px-6 md:px-24 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <RealisticSun className="w-10 h-10" />
          <span className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>SOLAR<span className="text-solar-yellow italic">MAX</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Process", "Calculator", "Use Cases"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm font-bold hover:text-solar-yellow transition-colors">{item}</a>
          ))}
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <Button 
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-sm font-black tracking-widest uppercase hover:text-solar-yellow transition-colors cursor-pointer bg-transparent hover:bg-transparent"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="bg-solar-yellow text-deep-navy font-black rounded-full px-8 hover:scale-105 transition-transform cursor-pointer"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
      {/* Dynamic Background */}
      <motion.div 
        style={{ background: skyBackground }}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-6 md:px-24 overflow-hidden z-10">
        <motion.div 
          style={{ y: sunY, scale: sunScale, opacity: sunOpacity }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] aspect-square pointer-events-none"
        >
          {/* Ultra-Realistic Sun System */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* 1. Cinematic Lens Flare Elements (Reactive) */}
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]), x: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
              className="absolute inset-0 pointer-events-none z-50"
            >
              <div className="lens-flare-element w-32 h-32 bg-solar-yellow/20 -top-20 -left-20 animate-pulse" />
              <div className="lens-flare-element w-16 h-16 bg-blue-300/10 top-40 left-60" />
              <div className="lens-flare-element w-48 h-48 lens-flare-halo -bottom-40 -right-20" />
            </motion.div>

            {/* 2. Deep Volumetric Atmosphere */}
            <div className="absolute inset-[-60%] bg-radial-gradient from-solar-yellow/30 via-solar-gold/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />

            {/* 3. 3D Volumetric Light Shafts */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <motion.div
                key={i}
                animate={{ 
                  rotate: [angle, angle + 360], 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 25 + i * 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-[300%] h-2 volumetric-shaft"
                style={{ rotate: angle }}
              />
            ))}

            {/* 4. The Celestial Core (Spherical & Boiling) */}
            <div className="relative w-full h-full rounded-full sun-depth-shadow overflow-hidden sun-spherical-mask mix-blend-screen">
              {/* Boiling Plasma Overlay (SVG Filtered) */}
              <div className="absolute inset-0 z-20 plasma-boil-overlay bg-solar-yellow/30" />
              
              <motion.img 
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                src="/assets/sun_v2.png" 
                alt="Sun" 
                className="w-full h-full object-cover scale-125"
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

            {/* 5. Extreme Core Exposure */}
            <div className="absolute w-1/4 h-1/4 bg-white/40 blur-3xl rounded-full z-30" />
          </div>
        </motion.div>

        <div className="relative z-20 max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.3
                }
              }
            }}
            className="inline-flex items-center px-6 py-2 rounded-full bg-solar-yellow/5 border border-solar-yellow/20 backdrop-blur-md text-solar-yellow text-xs font-black tracking-[0.3em] uppercase mb-12 group hover:bg-solar-yellow/10 hover:border-solar-yellow/40 transition-all duration-500 overflow-hidden relative"
          >
            {/* Animated Glow Sweep */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-solar-yellow/20 to-transparent skew-x-12 z-0"
            />
            
            <div className="relative z-10 flex">
              {"THE FUTURE OF ENERGY".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      filter: "blur(0px)",
                      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                    }
                  }}
                  className={char === " " ? "mr-2" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Pulsing Dot */}
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-4 w-1.5 h-1.5 rounded-full bg-solar-yellow shadow-[0_0_10px_rgba(255,215,0,0.8)]"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-[10rem] font-black mb-8 leading-[0.85] rim-light uppercase tracking-tighter"
          >
            Harness <br /> 
            <span className="text-solar-yellow">The Infinite</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-blue-100/80 mb-12 max-w-xl leading-relaxed font-light"
          >
            Experience the next evolution of solar energy management. Smart, 
            cinematic, and ultra-efficient power at your fingertips.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-8"
          >
            <Button size="lg" className="bg-solar-yellow text-deep-navy hover:scale-105 transition-transform font-black px-12 py-8 rounded-full text-lg shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              EXPLORE ENERGY
            </Button>
            <Button variant="ghost" className="flex items-center gap-4 font-bold group text-white hover:text-solar-yellow transition-colors bg-transparent hover:bg-transparent h-auto p-0">
              <span className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-deep-navy transition-all">
                <ArrowRight className="w-6 h-6" />
              </span>
              VIEW PROCESS
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 1: About */}
      <section className="relative min-h-screen py-32 px-6 md:px-24 flex flex-col md:flex-row items-center gap-20 z-10 overflow-hidden">
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-solar-yellow font-black tracking-tighter uppercase text-sm mb-6 block">The Vision</span>
            <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] rim-light uppercase">
              Intelligence in <br /><span className="text-solar-yellow">Every Ray</span>
            </h2>
            <p className="text-xl text-blue-100/60 mb-12 leading-relaxed font-light max-w-xl">
              Our advanced Solar Management System uses AI to predict generation patterns and optimize battery usage, ensuring you have power when you need it most.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Zap, text: "AUTOMATED FLOW" },
                { icon: LineChart, text: "PREDICTIVE OPS" },
                { icon: Smartphone, text: "REMOTE COMMAND" },
                { icon: Globe, text: "GRID SYNC" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 rounded-2xl bg-solar-yellow/5 border border-solar-yellow/10 group-hover:bg-solar-yellow/20 group-hover:scale-110 transition-all">
                    <item.icon className="w-7 h-7 text-solar-yellow" />
                  </div>
                  <span className="font-black text-sm tracking-widest uppercase">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Backlight flare */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />
        </div>
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass p-4 rounded-3xl"
          >
            <img src="/assets/dashboard.png" alt="Dashboard UI" className="w-full rounded-2xl shadow-2xl" />
          </motion.div>
          {/* Floating Data Card */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-5 glass p-6 rounded-2xl hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-2">
              <Sun className="text-solar-yellow" />
              <span className="text-sm font-bold">Generation Peak</span>
            </div>
            <div className="text-3xl font-black text-solar-yellow">98.4%</div>
            <div className="text-xs text-green-400">+12% from yesterday</div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Key Features */}
      <section id="features" className="relative min-h-screen py-32 px-6 md:px-24 z-10 flex flex-col justify-center">
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-solar-yellow font-bold tracking-[0.3em] uppercase text-xs mb-6 block"
          >
            Core Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-[8rem] font-black mb-10 uppercase rim-light leading-[0.85] tracking-tighter"
          >
            Smart <br /><span className="text-solar-yellow">Systems</span>
          </motion.h2>
          <p className="text-blue-100/40 text-xl md:text-2xl font-light max-w-2xl mx-auto">Engineered for absolute performance and maximum visibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: "REAL-TIME FLOW", desc: "Track every watt generated and consumed as it happens.", icon: Activity },
            { title: "QUANTUM DATA", desc: "Detailed reports and trends to maximize your efficiency.", icon: BarChart3 },
            { title: "REMOTE OPS", desc: "Manage your system from intensive command centers.", icon: Zap },
            { title: "GRID DEFENSE", desc: "Seamless switching between grid, battery, and solar.", icon: Shield }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass p-12 rounded-[3rem] group cursor-pointer relative overflow-hidden hover:border-solar-yellow/30 transition-all font-sans"
            >
              <div className="absolute inset-0 bg-radial-gradient from-solar-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-solar-yellow/5 border border-solar-yellow/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-solar-yellow/20 group-hover:scale-110 transition-all">
                <feature.icon className={`w-8 h-8 text-solar-yellow`} />
              </div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-blue-100/50 group-hover:text-blue-100 transition-colors leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Energy Comparison Section */}
      <section className="relative py-40 px-6 md:px-24 z-10 overflow-hidden bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-solar-yellow font-black tracking-widest uppercase text-xs mb-6 block"
            >
              The Performance Gap
            </motion.span>
            <h2 className="text-5xl md:text-8xl font-black mb-10 uppercase rim-light">
              GRID VS <span className="text-solar-yellow">SOLARMAX</span>
            </h2>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-6 mb-16">
              <span className={`text-sm font-black tracking-widest uppercase transition-colors ${comparisonMode === 'grid' ? 'text-white' : 'text-white/20'}`}>Traditional Grid</span>
              <Button 
                variant="ghost"
                onClick={() => setComparisonMode(prev => prev === 'grid' ? 'solar' : 'grid')}
                className="w-24 h-12 glass rounded-full relative p-1 transition-all bg-transparent hover:bg-transparent"
              >
                <motion.div 
                  animate={{ x: comparisonMode === 'solar' ? 48 : 0 }}
                  className="w-10 h-10 bg-solar-yellow rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                />
              </Button>
              <span className={`text-sm font-black tracking-widest uppercase transition-colors ${comparisonMode === 'solar' ? 'text-solar-yellow' : 'text-white/20'}`}>SolarMax AI</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Representation */}
            <motion.div 
              key={comparisonMode}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-12 rounded-[4rem] aspect-square relative flex items-center justify-center overflow-hidden"
            >
              {/* Power Flow Animation */}
              <div className="absolute inset-0 z-0">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full ${comparisonMode === 'solar' ? 'bg-solar-yellow/20' : 'bg-red-500/10'}`} />
                <AnimatePresence>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                      key={`${comparisonMode}-pulse-${i}`}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 500, opacity: [0, 1, 0] }}
                      transition={{ 
                        duration: comparisonMode === 'solar' ? 1.5 : 4, 
                        repeat: Infinity, 
                        delay: i * 0.4,
                        ease: "linear"
                      }}
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full blur-sm ${comparisonMode === 'solar' ? 'bg-solar-yellow' : 'bg-red-500'}`}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div className="relative z-10 text-center">
                <div className="text-[12rem] font-black opacity-10 -mb-16">{comparisonMode === 'solar' ? '98%' : '45%'}</div>
                <h3 className="text-4xl font-black uppercase mb-4">{comparisonMode === 'solar' ? 'Optimal Efficiency' : 'High Energy Loss'}</h3>
                <p className="text-blue-100/40 max-w-sm mx-auto">
                  {comparisonMode === 'solar' 
                    ? 'Our AI algorithms predict demand and generation to minimize waste and maximize battery lifespan.' 
                    : 'Static distribution leads to significant energy leakage and frequent dependency on expensive grid peaks.'}
                </p>
              </div>
            </motion.div>

            {/* Metrics Breakdown */}
            <div className="space-y-8">
              {[
                { label: "Monthly Bill", grid: "₹8,500", solar: "₹450", icon: DollarSign },
                { label: "Efficiency Rate", grid: "42%", solar: "98.4%", icon: Activity },
                { label: "Carbon Footprint", grid: "High", solar: "Zero", icon: Leaf },
                { label: "Reliability", grid: "Legacy", solar: "Quantum", icon: Shield }
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass p-8 rounded-3xl flex items-center justify-between group hover:border-solar-yellow/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-solar-yellow/20 transition-all">
                      <metric.icon className="w-6 h-6 text-solar-yellow" />
                    </div>
                    <span className="font-bold text-blue-100/60 transition-colors group-hover:text-white uppercase tracking-widest text-sm">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <motion.div 
                      key={comparisonMode}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-2xl font-black ${comparisonMode === 'solar' ? 'text-solar-yellow' : 'text-red-500'}`}
                    >
                      {comparisonMode === 'solar' ? metric.solar : metric.grid}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="process" className="relative py-40 px-6 md:px-24 bg-black/40 z-10 overflow-hidden">
        <div className="text-center mb-32">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-solar-yellow font-black tracking-widest uppercase text-xs mb-6 block"
          >
            The Workflow
          </motion.span>
          <h2 className="text-5xl md:text-8xl font-black mb-10 uppercase rim-light">
            THE <span className="text-solar-yellow">LIFECYCLE</span> OF LIGHT
          </h2>
          <p className="text-blue-100/40 text-xl font-light">Tracing silent energy from the sun to your devices.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 hidden md:block -translate-y-1/2 overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="w-full h-full bg-linear-to-r from-transparent via-solar-yellow to-transparent"
             />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {[
              { label: "SUN", icon: Sun },
              { label: "PANELS", icon: Factory },
              { label: "INVERTER", icon: Zap },
              { label: "BATTERY", icon: Battery },
              { label: "GRID", icon: Globe },
              { label: "COMMAND", icon: Smartphone }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                onViewportEnter={() => setActiveStep(i)}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div 
                  animate={{ 
                    scale: activeStep === i ? 1.2 : 1,
                    borderColor: activeStep === i ? "rgba(255, 215, 0, 1)" : "rgba(255, 215, 0, 0.3)"
                  }}
                  className={`w-24 h-24 rounded-full glass border-2 flex items-center justify-center z-10 transition-all duration-500 ${activeStep === i ? 'shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''}`}
                >
                  <step.icon className={`w-10 h-10 ${activeStep === i ? 'text-solar-yellow' : 'text-white/40'}`} />
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-solar-yellow text-deep-navy text-[10px] font-black flex items-center justify-center transition-opacity ${activeStep === i ? 'opacity-100' : 'opacity-0'}`}>
                    0{i+1}
                  </div>
                </motion.div>
                <span className={`font-black text-sm tracking-widest uppercase transition-colors ${activeStep === i ? "text-white" : "text-white/40"}`}>{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Benefits */}
      {/* Section 4: Benefits */}
      <section className="relative py-40 px-6 md:px-24 z-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 relative">
            <motion.div
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              whileInView={{ rotate: -5, scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <img 
                src="/assets/panels.png" 
                alt="Solar Panels" 
                className="w-full max-w-2xl mx-auto drop-shadow-[0_0_50px_rgba(255,215,0,0.2)]"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-solar-yellow/5 blur-[120px] rounded-full z-0" />
          </div>
          <div className="flex-1">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-solar-yellow font-black tracking-widest uppercase text-xs mb-8 block"
            >
              Why SolarMax
            </motion.span>
            <h2 className="text-5xl md:text-[6rem] font-black mb-12 leading-[0.85] rim-light uppercase tracking-tighter">
              Harvest More <br /> than just <span className="text-solar-yellow">Power</span>
            </h2>
            <div className="space-y-12">
              {[
                { title: "REDUCE COSTS", desc: "Lower your monthly electricity bills by up to 80% with smart distribution." },
                { title: "CLEAN ENERGY", desc: "Decrease your carbon footprint and help save the planet with zero-waste systems." },
                { title: "TOTAL CONTROL", desc: "Absolute visibility into your production and usage habits from any device." }
              ].map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="flex gap-8 items-start group"
                >
                  <div className="mt-1 p-3 rounded-xl bg-solar-yellow/5 border border-solar-yellow/10 group-hover:bg-solar-yellow/20 transition-all">
                    <CheckCircle2 className="text-solar-yellow w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-3 uppercase tracking-wider">{benefit.title}</h4>
                    <p className="text-blue-100/40 leading-relaxed font-light text-lg">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="relative py-40 px-6 md:px-24 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: "CO2 OFFSET", value: "12,450", unit: "TONS", icon: CloudLightning },
            { label: "TOTAL SAVINGS", value: "4.2", unit: "M USD", icon: TrendingUp },
            { label: "SYSTEMS ONLINE", value: "8,920", unit: "ACTIVE", icon: Activity }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass p-16 rounded-[3rem] text-center flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-radial-gradient from-solar-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-[2rem] bg-solar-yellow/5 border border-solar-yellow/10 flex items-center justify-center mb-8 group-hover:bg-solar-yellow/20 group-hover:scale-110 transition-all">
                <stat.icon className="w-10 h-10 text-solar-yellow" />
              </div>
              <p className="text-6xl font-black text-white mb-4 tracking-tighter group-hover:scale-105 transition-transform">{stat.value}</p>
              <p className="text-sm font-black text-solar-yellow uppercase tracking-[0.3em]">{stat.unit} {stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="relative px-6 py-40 z-10 overflow-hidden">
        {/* Background Anchor Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none z-0">
          <span className="text-[20rem] md:text-[40rem] font-black text-white text-anchor-bg leading-none">CALC</span>
        </div>

        {/* Volumetric Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-solar-yellow/5 via-transparent to-transparent blur-[120px] z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-solar-yellow font-black tracking-widest uppercase text-sm mb-6 block"
            >
              Interactive Discovery
            </motion.span>
            <h2 className="text-5xl md:text-[8rem] font-black mb-10 uppercase rim-light leading-[0.85] tracking-tighter">
              CALCULATE <br /><span className="text-solar-yellow">YOUR IMPACT</span>
            </h2>
            <p className="text-blue-100/40 text-xl font-light max-w-2xl mx-auto">Precision projections for your transition to the infinite energy of the sun.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="glass rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative group"
          >
            {/* Animated Inner Rim Light */}
            <div className="absolute inset-0 border border-white/5 rounded-[4rem] pointer-events-none z-20 group-hover:border-solar-yellow/20 transition-colors duration-700" />
            
            <SolarCalculator />
          </motion.div>
        </div>
      </section>

      {/* National Solar Mission - PM Surya Ghar Section */}
      <section className="relative py-48 px-6 md:px-24 bg-deep-navy z-10 overflow-hidden">
        {/* Flag Inspired Volumetric Ambient Lighting */}
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Background Anchor Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none z-0">
          <span className="text-[20rem] md:text-[40rem] font-black text-white text-anchor-bg leading-none tracking-tighter">BHARAT</span>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24 relative z-10">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-1 bg-orange-500 rounded-full" />
                <span className="text-solar-yellow font-black tracking-[0.4em] uppercase text-xs">National Mission</span>
                <div className="w-12 h-1 bg-emerald-500 rounded-full" />
              </div>
              <h2 className="text-5xl md:text-[8rem] font-black mb-12 uppercase rim-light leading-[0.85] tracking-tighter">
                PM SURYA <br /><span className="text-solar-yellow text-glow">GHAR</span>
              </h2>
              <p className="text-blue-100/40 text-2xl font-light leading-relaxed mb-12">
                Harnessing the sun to power every household. Under the <span className="text-white font-bold">Muft Bijli Yojana</span>, 
                Indian citizens can receive up to ₹78,000 in direct bank transfers for residential solar installations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "ZERO COST", desc: "Up to 100% financing with low interest rates." },
                  { title: "DIRECT SUBSIDY", desc: "Instantly credited to your bank account." },
                  { title: "300 UNITS", desc: "Free electricity every month for your family." },
                  { title: "GOVT BACKED", desc: "A sustainable future for the next generation." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <h4 className="font-black text-sm tracking-widest uppercase mb-1">{item.title}</h4>
                      <p className="text-xs text-blue-100/20 uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
               className="relative"
             >
                <div className="glass p-4 rounded-[3rem] border-white/5 shadow-2xl overflow-hidden group">
                   <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-white/5 to-emerald-500/10 opacity-50" />
                   <img 
                    src="https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=800&q=80" 
                    alt="Indian Solar Development" 
                    className="w-full h-160 object-cover rounded-[2.5rem] grayscale-50 group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                   />
                   <div className="absolute bottom-12 left-12 right-12 glass p-8 rounded-3xl border-white/10 backdrop-blur-xl">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black text-solar-yellow uppercase tracking-[0.2em] mb-2">Scheme Status</p>
                          <p className="text-2xl font-black uppercase tracking-tighter">Active Nationwide</p>
                        </div>
                        <div className="flex -space-x-3">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-deep-navy bg-gray-800 flex items-center justify-center text-[10px] font-black overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(https://i.pravatar.cc/100?u=${i})` }} />
                           ))}
                           <div className="w-10 h-10 rounded-full border-2 border-deep-navy bg-solar-yellow text-deep-navy flex items-center justify-center text-[10px] font-black font-sans">
                              1.2M+
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Partners / Trust Section */}
      <section className="relative py-20 border-y border-white/5 bg-black/20 z-10">
        <div className="px-6 md:px-24">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-12">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             {["NASA", "Tesla", "Siemens", "Google", "IKEA"].map(name => (
               <span key={name} className="text-2xl md:text-3xl font-black italic tracking-tighter">{name}<span className="text-solar-yellow">.</span></span>
             ))}
          </div>
        </div>
      </section>

      {/* Section 5: Use Cases */}
      <section id="use-cases" className="relative py-48 px-6 md:px-24 bg-black/60 z-10 overflow-hidden">
        {/* Massive Background Anchor Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none z-0">
          <span className="text-[20rem] md:text-[40rem] font-black text-white text-anchor-bg leading-none">DEPLOY</span>
        </div>

        {/* Volumetric Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-solar-yellow/10 via-transparent to-transparent blur-[150px] z-0" />

        <div className="text-center mb-40 relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-solar-yellow font-black tracking-widest uppercase text-sm mb-8 block"
          >
            National Solar Mission Impact
          </motion.span>
          <h2 className="text-6xl md:text-[10rem] font-black mb-12 uppercase rim-light leading-[0.85] tracking-tighter">
            VERSATILE <br /><span className="text-solar-yellow">IMPACT</span>
          </h2>
          <p className="text-blue-100/40 text-2xl font-light max-w-3xl mx-auto">Empowering every sector with ultra-efficient, silent energy management.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
          {[
            { label: "RESIDENTIAL", icon: Home, img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
            { label: "COMMERCIAL", icon: Building2, img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
            { label: "EV CHARGING", icon: Car, img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80" },
            { label: "INDUSTRIAL", icon: Factory, img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80" }
          ].map((useCase, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ delay: i * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
              className="relative h-140 rounded-[3.5rem] overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
            >
              {/* Vibrant Image Layer */}
              <img src={useCase.img} alt={useCase.label} className="w-full h-full object-cover opacity-70 brightness-90 group-hover:opacity-100 group-hover:brightness-110 group-hover:scale-110 transition-all duration-700" />
              
              {/* Light Leak Overlay */}
              <div className="absolute inset-0 light-leak-overlay z-20 pointer-events-none" />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-deep-navy via-deep-navy/10 to-transparent z-10" />
              
              <div className="absolute bottom-16 left-12 z-20">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-20 h-20 glass rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-solar-yellow/30 group-hover:border-solar-yellow/50 transition-all duration-500 shadow-lg"
                >
                  <useCase.icon className="w-10 h-10 text-solar-yellow group-hover:scale-110 transition-transform" />
                </motion.div>
                <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:text-solar-yellow transition-colors">{useCase.label}</h3>
              </div>

              {/* Interactive Internal Glow */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-radial-gradient from-solar-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>


      {/* Trust Gallery Section */}
      <section className="relative py-48 px-6 md:px-24 bg-black/40 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-solar-yellow font-black tracking-widest uppercase text-xs mb-8 block"
              >
                Presence across Bharat
              </motion.span>
              <h2 className="text-5xl md:text-[6rem] font-black mb-12 uppercase rim-light leading-[0.85] tracking-tighter">
                TRUSTED BY <br /><span className="text-solar-yellow text-glow">LAKHS OF INDIANS</span>
              </h2>
              <p className="text-blue-100/40 text-xl font-light mb-12 leading-relaxed">
                From luxury residential complexes in Mumbai to industrial zones in Bangalore, we power Bharat's most ambitious projects.
              </p>
              <div className="flex gap-12">
                 <div>
                    <p className="text-4xl font-black text-white mb-2 tracking-tighter">10,000+</p>
                    <p className="text-xs font-black text-solar-yellow uppercase tracking-widest">Homeowners</p>
                 </div>
                 <div className="w-px h-16 bg-white/10" />
                 <div>
                    <p className="text-4xl font-black text-white mb-2 tracking-tighter">1.2GW</p>
                    <p className="text-xs font-black text-solar-yellow uppercase tracking-widest">Power Managed</p>
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
                 "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e2?auto=format&fit=crop&w=600&q=80",
                 "https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&w=600&q=80",
                 "https://images.unsplash.com/photo-1548337138-e87d889cc988?auto=format&fit=crop&w=600&q=80"
               ].map((img, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                   className={`rounded-3xl overflow-hidden glass ${i % 2 === 1 ? 'mt-12' : ''}`}
                 >
                    <img src={img} alt="Installation" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-125 brightness-75 hover:brightness-100" />
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Energy Anatomy Section */}
      <section className="relative py-48 px-6 md:px-24 z-10 overflow-hidden bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-24">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-solar-yellow animate-pulse" />
                <span className="text-solar-yellow font-black tracking-[0.4em] uppercase text-xs">
                  System Architecture v2.0
                </span>
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-black uppercase rim-light leading-none">
                TECHNICAL <br /><span className="text-solar-yellow">INTELLIGENCE</span>
              </h2>
            </div>
            
            <div className="flex flex-col items-end gap-6">
               <div className="flex glass p-2 rounded-2xl border-white/5 relative z-20 shadow-2xl">
                 <button 
                   onClick={() => setEnergyCycle("day")}
                   className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${energyCycle === "day" ? "bg-solar-yellow text-deep-navy shadow-[0_0_30px_rgba(255,215,0,0.3)]" : "text-white/40 hover:text-white"}`}
                 >
                   <Sun className="w-4 h-4" />
                   Peak Generation
                 </button>
                 <button 
                   onClick={() => setEnergyCycle("night")}
                   className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${energyCycle === "night" ? "bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "text-white/40 hover:text-white"}`}
                 >
                   <Battery className="w-4 h-4" />
                   Quantum Discharge
                 </button>
               </div>
               <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex gap-6">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Online</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Grid Balanced</span>
               </div>
            </div>
          </div>

          <div className="relative aspect-video glass rounded-[4rem] border-white/5 flex items-center justify-center p-20 overflow-hidden group/canvas">
             {/* Background Matrix Grid */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
             
             {/* Orbital Rings for Central Hub */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[400px] h-[400px] border border-white/5 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[500px] h-[500px] border border-white/5 rounded-full border-dashed"
                />
             </div>

             {/* SVG Laser Path Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
                <defs>
                   <linearGradient id="lineGradDay" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                   <linearGradient id="lineGradNight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                </defs>
                {/* Connecting Lines (Simulated Paths) */}
                <path d="M 200 200 L 480 340" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" fill="none" transform="translate(0, 0)" />
                <path d="M 200 480 L 480 340" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
                <path d="M 800 340 L 480 340" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
             </svg>

             {/* Central Hub (Home) */}
             <motion.div 
               animate={{ 
                 borderColor: energyCycle === "day" ? "rgba(255,215,0,0.5)" : "rgba(59,130,246,0.5)",
                 boxShadow: energyCycle === "day" ? "0 0 80px rgba(255,215,0,0.15)" : "0 0 80px rgba(59,130,246,0.15)"
               }}
               className="w-56 h-56 glass rounded-[3rem] border-2 flex flex-col items-center justify-center z-30 relative group duration-500"
             >
                <div className="absolute -inset-4 border border-white/5 rounded-[4rem] animate-[ping_3s_infinite]" />
                <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6 relative overflow-hidden group-hover:bg-white/10 transition-colors">
                   <Home className={`w-10 h-10 ${energyCycle === "day" ? "text-solar-yellow" : "text-blue-400"}`} />
                   {/* Scanning Beam */}
                   <motion.div 
                      animate={{ top: ["-100%", "200%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-white/10 skew-y-12 h-1/2 w-full"
                   />
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-1">Central Console</p>
                   <p className={`text-sm font-black tracking-widest uppercase ${energyCycle === "day" ? "text-solar-yellow" : "text-blue-400"}`}>
                      {energyCycle === "day" ? "Hybrid Supply" : "Battery Mode"}
                   </p>
                </div>

                {/* Local Telemetry Data */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-white/20 uppercase tracking-[0.3em] flex gap-4">
                   <span>LOAD: 12.4kW</span>
                   <span className="text-green-500">SYNC: ACTIVE</span>
                </div>
             </motion.div>

             {/* Peripheral Nodes */}
             <div className="absolute inset-0 z-20">
                {/* 1. Generation Node */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: energyCycle === "day" ? 1 : 0.3,
                    scale: energyCycle === "day" ? 1 : 0.9,
                    filter: energyCycle === "day" ? "blur(0px)" : "blur(2px)" 
                  }}
                  className="absolute top-[18%] left-[18%] flex flex-col items-center"
                >
                   <div className="w-28 h-28 glass rounded-full border-2 border-solar-yellow/30 flex items-center justify-center relative shadow-[0_0_40px_rgba(255,215,0,0.1)] group">
                      <div className="absolute inset-0 border-t-2 border-solar-yellow/20 rounded-full animate-spin-slow" />
                      <Sun className="text-solar-yellow w-12 h-12" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 glass rounded-full text-[8px] font-black tracking-[0.2em] text-solar-yellow uppercase border-solar-yellow/20">
                         {energyCycle === "day" ? "GEN: 42.8 kWh" : "GEN: 0.0 kWh"}
                      </div>
                   </div>
                   <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mt-6">Solar Array A1</span>
                </motion.div>

                {/* 2. Battery Node */}
                <div className="absolute bottom-[18%] left-[18%] flex flex-col items-center">
                   <div className="w-28 h-28 glass rounded-full border-2 border-green-500/30 flex items-center justify-center relative shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                      <div className="absolute inset-0 border-b-2 border-green-500/20 rounded-full animate-[spin_4s_linear_infinite]" />
                      <Battery className="text-green-500 w-12 h-12" />
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 glass rounded-full text-[8px] font-black tracking-[0.2em] text-green-500 uppercase border-green-500/20">
                         {energyCycle === "day" ? "STATE: CHARGING (85%)" : "STATE: DISCHARGING (42%)"}
                      </div>
                   </div>
                   <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mt-6">Solid State Core</span>
                </div>

                {/* 3. Grid Node */}
                <div className="absolute top-1/2 right-[18%] -translate-y-1/2 flex flex-col items-center">
                   <div className="w-28 h-28 glass rounded-full border-2 border-blue-500/30 flex items-center justify-center relative shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                      <div className="absolute inset-2 border-l-2 border-blue-500/20 rounded-full animate-[spin_5s_linear_infinite]" />
                      <Globe className="text-blue-500 w-12 h-12" />
                      <div className="absolute top-1/2 -right-32 -translate-y-1/2 whitespace-nowrap text-[8px] font-black text-white/20 uppercase tracking-[0.4em] origin-left rotate-90">
                         GRID FREQUENCY: 50.04 Hz
                      </div>
                   </div>
                   <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mt-6">Active Grid Sync</span>
                </div>
             </div>

             {/* Enhanced Energy Flow Particles */}
             <div className="absolute inset-0 pointer-events-none z-20">
                <AnimatePresence>
                   {/* Day Flow Particles */}
                   {energyCycle === "day" && [
                      { from: [-280, -220], to: [0, 0], color: "#FFD700" }, // Sun to Home
                      { from: [-280, -220], to: [-280, 220], color: "#FFD700" }, // Sun to Battery
                      { from: [320, 0], to: [0, 0], color: "#3B82F6", opacity: 0.2 } // Grid (Standby)
                   ].map((path, i) => (
                      <React.Fragment key={`day-cycle-${i}`}>
                        {[...Array(3)].map((_, j) => (
                           <motion.div
                             key={`day-particle-${i}-${j}`}
                             className="absolute w-1.5 h-1.5 rounded-full blur-[1px]"
                             style={{ backgroundColor: path.color }}
                             initial={{ left: `calc(50% + ${path.from[0]}px)`, top: `calc(50% + ${path.from[1]}px)`, opacity: 0 }}
                             animate={{ 
                                left: [`calc(50% + ${path.from[0]}px)`, `calc(50% + ${path.to[0]}px)`],
                                top: [`calc(50% + ${path.from[1]}px)`, `calc(50% + ${path.to[1]}px)`],
                                opacity: [0, path.opacity || 1, 0],
                                scale: [0.5, 1, 0.5]
                             }}
                             transition={{ duration: 2.5, repeat: Infinity, delay: (i * 0.5) + (j * 0.8), ease: "easeInOut" }}
                           />
                        ))}
                      </React.Fragment>
                   ))}

                   {/* Night Flow Particles */}
                   {energyCycle === "night" && [
                      { from: [-280, 220], to: [0, 0], color: "#22C55E" }, // Battery to Home
                      { from: [320, 0], to: [0, 0], color: "#3B82F6" } // Grid to Home
                   ].map((path, i) => (
                      <React.Fragment key={`night-cycle-${i}`}>
                        {[...Array(3)].map((_, j) => (
                           <motion.div
                             key={`night-particle-${i}-${j}`}
                             className="absolute w-1.5 h-1.5 rounded-full blur-[1px]"
                             style={{ backgroundColor: path.color }}
                             initial={{ left: `calc(50% + ${path.from[0]}px)`, top: `calc(50% + ${path.from[1]}px)`, opacity: 0 }}
                             animate={{ 
                                left: [`calc(50% + ${path.from[0]}px)`, `calc(50% + ${path.to[0]}px)`],
                                top: [`calc(50% + ${path.from[1]}px)`, `calc(50% + ${path.to[1]}px)`],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.5, 0.5]
                             }}
                             transition={{ duration: 2, repeat: Infinity, delay: (i * 0.4) + (j * 0.7), ease: "linear" }}
                           />
                        ))}
                      </React.Fragment>
                   ))}
                </AnimatePresence>
             </div>

             {/* Side Console Logs */}
             <div className="absolute top-10 left-10 w-48 h-32 glass border-white/5 p-4 hidden md:block z-40 overflow-hidden">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                   <Activity className="w-3 h-3 text-solar-yellow" />
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live Telemetry</span>
                </div>
                <div className="space-y-1 font-mono text-[6px] text-solar-yellow/60">
                   <p className="animate-pulse">{">"} INITIALIZING SYNC...</p>
                   <p className={energyCycle === "day" ? "text-solar-yellow" : "text-blue-400"}>
                      {">"} MODE: {energyCycle.toUpperCase()}
                   </p>
                   <p className="text-green-500">{">"} EFFICIENCY: 98.4%</p>
                   <p className="text-white/20">{">"} PING: 24ms</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-40 px-6 md:px-24 border-t border-white/5 z-10 bg-black/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <Sun className="text-solar-yellow w-12 h-12" />
              <span className="text-4xl font-black tracking-tighter">SOLAR<span className="text-solar-yellow italic">MAX</span></span>
            </div>
            <p className="text-blue-100/30 text-xl font-light max-w-md leading-relaxed mb-12">
              Leading the transition to a sustainable future through intelligent solar technology and high-fidelity energy management.
            </p>
            <div className="flex gap-6">
              {[Globe, Zap, Activity].map((Icon, i) => (
                <Button key={i} size="icon" variant="ghost" className="w-14 h-14 rounded-2xl glass border-white/5 hover:bg-solar-yellow/20 hover:text-solar-yellow transition-all">
                  <Icon className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black tracking-[0.3em] uppercase text-solar-yellow mb-10">Solutions</h4>
            <ul className="space-y-6 text-blue-100/40 font-light text-lg">
              {["Residential", "Commercial", "Storage", "Smart Grid"].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-sm font-black">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black tracking-[0.3em] uppercase text-solar-yellow mb-10">Company</h4>
            <ul className="space-y-6 text-blue-100/40 font-light text-lg">
              {["Process", "Impact", "About", "Contact"].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-sm font-black">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-blue-100/20 text-xs font-black tracking-widest uppercase">
          <p>© 2024 SOLARMAX. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-12 mt-8 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
