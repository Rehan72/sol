import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useParams } from 'react-router-dom';
import { motion as fMotion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

const SolarPanel = ({ id, position, status = 'active', onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Status colors
  const statusColors = {
    active: '#10B981', // Emerald
    warning: '#FBBF24', // Amber
    fault: '#EF4444', // Red
  };

  useFrame((state) => {
    if (meshRef.current) {
        // Subtle tilt animation
        meshRef.current.rotation.x = -Math.PI / 6 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group 
        position={position} 
        onPointerOver={() => {
            setHovered(true);
            onHover({ id, status });
        }} 
        onPointerOut={() => {
            setHovered(false);
            onHover(null);
        }}
    >
        {/* Frame */}
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 0.05, 1.8]} />
            <meshStandardMaterial 
                color={hovered ? statusColors[status] : '#1A1C25'} 
                metalness={0.8} 
                roughness={0.2}
            />
            {/* Cell Pattern (Emissive) */}
            <mesh position={[0, 0.03, 0]}>
                <boxGeometry args={[0.95, 0.01, 1.75]} />
                <meshStandardMaterial 
                    color="#002244" 
                    emissive="#004488" 
                    emissiveIntensity={hovered ? 2 : 0.5} 
                />
            </mesh>
        </mesh>
        
        {/* Connection Cables (Simplified) */}
        <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8]} />
            <meshStandardMaterial color="#333" />
        </mesh>
    </group>
  );
};

const PlantBase = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0A0B10" transparent opacity={0.5} />
    </mesh>
);

const SolarPlant3D = () => {
    const { plantId } = useParams();
    const [selectedId, setSelectedId] = useState(null);
    const [hoveredData, setHoveredData] = useState(null);

    return (
        <div className="w-full h-[calc(100vh-280px)] min-h-[600px] relative overflow-hidden flex flex-col rounded-[2.5rem] glass border border-white/10 shadow-2xl">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            {/* Cinematic HUD Header */}
            <div className="absolute top-8 left-10 z-20 pointer-events-none">
                <fMotion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-1"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-solar-yellow rounded-full animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                            DIGITAL<span className="text-solar-yellow italic">TWIN</span>
                        </h1>
                    </div>
                    <fMotion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 192 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="flex items-center gap-2 mt-2"
                    >
                        <div className="h-px bg-white/20 flex-1" />
                        <span className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase whitespace-nowrap">Asset Layer 4.2</span>
                    </fMotion.div>
                </fMotion.div>
            </div>

            {/* Diagnostic HUD (Top Right) */}
            <div className="absolute top-8 right-10 z-20 flex flex-col gap-3">
                {[
                    { label: "SYSTEM STABILITY", value: "99.98%", status: "NOMINAL", delay: 0.2 },
                    { label: "DATA LATENCY", value: "12ms", status: "LOW", delay: 0.3 },
                    { label: "VIRTUAL SYNC", value: "REAL-TIME", status: "ACTIVE", delay: 0.4 }
                ].map((item, idx) => (
                    <fMotion.div
                        key={idx}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay, duration: 0.6 }}
                    >
                        <DiagnosisCard {...item} />
                    </fMotion.div>
                ))}
            </div>

            {/* Detailed Selection HUD (Bottom Left) */}
            <AnimatePresence>
                {hoveredData && (
                    <fMotion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-10 left-10 z-20 p-6 glass border border-white/20 rounded-[2rem] w-80 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-solar-yellow/5 blur-2xl rounded-full" />
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                            <Box className="w-5 h-5 text-solar-yellow" />
                            Panel <span className="text-solar-yellow">#{hoveredData.id}</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DataField label="Output" value="342.1 W" />
                            <DataField label="Efficiency" value="21.8%" />
                            <DataField label="Temperature" value="41.2°C" />
                            <DataField label="Status" value="OPTIMAL" color="text-emerald-400" />
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-widest">
                                <span>Health Scan</span>
                                <span>99.2%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                <fMotion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '99.2%' }}
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                                />
                            </div>
                        </div>
                    </fMotion.div>
                )}
            </AnimatePresence>

            {/* Controls HUD (Bottom Right) */}
            <fMotion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-10 right-10 z-20 p-5 glass border border-white/10 rounded-3xl w-64 backdrop-blur-md"
            >
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 border-b border-white/5 pb-2 ml-1">Interface Controls</h4>
                <div className="space-y-2">
                    <HintRow label="Orbit" action="Left Drag" />
                    <HintRow label="Zoom" action="Scroll" />
                    <HintRow label="Pan" action="Right Drag" />
                    <HintRow label="Inspect" action="Hover" />
                </div>
            </fMotion.div>

            <Canvas shadows dpr={[1, 2]} className="z-10 bg-transparent flex-1">
                <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={40} />
                <OrbitControls 
                    enableDamping 
                    dampingFactor={0.05}
                    maxPolarAngle={Math.PI / 2.2} 
                    minDistance={8} 
                    maxDistance={25}
                    autoRotate
                    autoRotateSpeed={0.3}
                />
                
                <ambientLight intensity={0.4} />
                <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, 5, -10]} intensity={0.5} color="#FBFF00" />
                
                <Suspense fallback={null}>
                    {/* Glowing Grid */}
                    <gridHelper args={[40, 40, '#ffffff05', '#ffffff10']} position={[0, -0.79, 0]} />
                    
                    {/* Render a grid of panels */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        Array.from({ length: 5 }).map((_, j) => (
                            <SolarPanel 
                                key={`${i}-${j}`} 
                                id={`${i}${j}`}
                                position={[i * 1.8 - 4.5, 0, j * 2.5 - 5]} 
                                status={Math.random() > 0.95 ? 'warning' : 'active'}
                                onHover={(data) => setHoveredData(data)}
                            />
                        ))
                    ))}
                    
                    <PlantBase />
                    <ContactShadows 
                        position={[0, -0.81, 0]} 
                        opacity={0.65} 
                        scale={25} 
                        blur={2.5} 
                        far={5} 
                    />
                    
                    <Environment preset="night" />
                    <Sparkles count={150} scale={20} size={1.5} speed={0.4} color="#FBFF00" opacity={0.2} />
                </Suspense>
            </Canvas>

            {/* Scanning Line Effect */}
            <fMotion.div
                animate={{ y: ['0%', '100%', '0%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-[3px] bg-solar-yellow/10 blur-md pointer-events-none z-30"
            />
            
            {/* HUD Scanline */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        </div>
    );
};

const DiagnosisCard = ({ label, value, status }) => (
    <div className="glass p-4 rounded-2xl border border-white/10 min-w-40 backdrop-blur-3xl">
        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-black text-white">{value}</span>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                status === 'NOMINAL' ? 'bg-emerald-500/10 text-emerald-400' : 
                status === 'ACTIVE' ? 'bg-solar-yellow/10 text-solar-yellow' : 'bg-white/5 text-white/40'
            }`}>{status}</span>
        </div>
    </div>
);

const DataField = ({ label, value, color = "text-white" }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
);

const HintRow = ({ label, action }) => (
    <div className="flex justify-between items-center text-[8px] group-hover:bg-white/5 p-1 rounded-lg transition-colors">
        <span className="text-white/40 font-bold uppercase tracking-widest">{label}</span>
        <span className="text-solar-yellow font-black uppercase px-2 py-1 bg-solar-yellow/5 border border-solar-yellow/10 rounded-md shadow-[0_0_10px_rgba(255,215,0,0.1)]">{action}</span>
    </div>
);

export default SolarPlant3D;
