import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Leaf, 
  Trees, 
  TrendingUp,
  Activity,
  Globe,
  Sun,
  Battery
} from 'lucide-react';

const HolographicPreview = ({ formData }) => {
  const [stats, setStats] = useState({
    dailyGen: 0,
    annualGen: 0,
    co2Offset: 0,
    treesPlanted: 0
  });

  // Calculate stats based on capacity
  useEffect(() => {
    const capacity = parseFloat(formData.capacity) || 0;
    // Rough estimates: 
    // 4 units per kW per day
    // 0.82 kg CO2 per kWh
    // 1 tree absorbs ~25kg CO2 per year
    
    const daily = capacity * 4;
    const annual = daily * 365;
    const co2 = (annual * 0.82) / 1000; // tons
    const trees = (co2 * 1000) / 25;

    setStats({
      dailyGen: daily,
      annualGen: annual / 1000, // MWh
      co2Offset: co2,
      treesPlanted: trees
    });
  }, [formData.capacity]);

  const StatItem = ({ icon: Icon, label, value, unit, delay }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-solar-yellow/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-4 p-4 border-b border-white/5 group-hover:bg-white/5 transition-colors rounded-lg">
        <div className="w-10 h-10 rounded-lg bg-solar-yellow/10 flex items-center justify-center text-solar-yellow">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black tabular-nums tracking-tight">
              {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span className="text-xs font-bold text-solar-yellow">{unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="sticky top-8 space-y-6">
      <div className="relative overflow-hidden rounded-3xl glass border border-white/10 p-6 min-h-[500px] flex flex-col">
        {/* Holographic scanning effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-solar-yellow/20 shadow-[0_0_20px_rgba(255,215,0,0.5)] z-0"
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_2px,transparent_2px)] bg-size-[100%_4px] opacity-10" />
        </div>

        {/* 3D Model Placeholder / Visualizer */}
        <div className="relative h-48 mb-6 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-solar-yellow/30 rounded-full animate-spin-slow" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] border border-dashed border-white/20 rounded-full animate-reverse-spin" />
          </div>
          
          <div className="relative z-10 text-center">
            {formData.capacity ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key="active"
                className="text-center"
              >
                <Sun className="w-12 h-12 text-solar-yellow mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-bold text-white">System Online</p>
                <p className="text-xs text-solar-yellow">{formData.capacity} kW Array</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key="idle"
                className="text-center"
              >
                 <Globe className="w-12 h-12 text-white/20 mx-auto mb-2" />
                 <p className="text-xs uppercase tracking-widest text-white/40">Waiting for input...</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-solar-yellow" />
            Projected Impact
          </h3>
          
          <StatItem 
            icon={Zap} 
            label="Daily Generation" 
            value={stats.dailyGen} 
            unit="kWh" 
            delay={0.1} 
          />
          <StatItem 
            icon={TrendingUp} 
            label="Annual Output" 
            value={stats.annualGen} 
            unit="MWh" 
            delay={0.2} 
          />
          <StatItem 
            icon={Leaf} 
            label="CO₂ Offset" 
            value={stats.co2Offset} 
            unit="Tons" 
            delay={0.3} 
          />
          <StatItem 
            icon={Trees} 
            label="Equivalent Trees" 
            value={stats.treesPlanted} 
            unit="Trees" 
            delay={0.4} 
          />
        </div>

        {/* Status Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
           <span>SYNC: ACTIVE</span>
           <span className="text-solar-yellow animate-pulse">● LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default HolographicPreview;
