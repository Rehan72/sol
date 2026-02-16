import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Power, 
  Zap, 
  Battery, 
  Activity, 
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';

const DeviceControlPanel = ({ plantId, isOnline }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [inverterState, setInverterState] = useState(true);
  const [activePowerLimit, setActivePowerLimit] = useState(100);
  const [peakShaving, setPeakShaving] = useState(false);

  const handleToggleInverter = async () => {
    setLoading(true);
    try {
        const endpoint = inverterState ? 'stop' : 'start';
        await client.post(`/control/${plantId}/${endpoint}`);
        setInverterState(!inverterState);
        showToast(`Inverter ${inverterState ? 'stopped' : 'started'} successfully`, 'success');
    } catch (error) {
        showToast('Failed to toggle inverter', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handlePowerLimitChange = async (e) => {
    const limit = parseInt(e.target.value);
    setActivePowerLimit(limit);
    // Debounce actual API call in real implementation
    // For now, commit on release (onMouseUp)
  };

  const commitPowerLimit = async () => {
    setLoading(true);
    try {
        await client.post(`/control/${plantId}/power-limit`, { limit: activePowerLimit });
        showToast(`Active power limit set to ${activePowerLimit}%`, 'success');
    } catch (error) {
        showToast('Failed to set power limit', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleTogglePeakShaving = async () => {
      setLoading(true);
      try {
          await client.post(`/control/${plantId}/peak-shaving`, { enabled: !peakShaving });
          setPeakShaving(!peakShaving);
          showToast(`Peak shaving ${!peakShaving ? 'enabled' : 'disabled'}`, 'success');
      } catch (error) {
          showToast('Failed to toggle peak shaving', 'error');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Sliders className="w-6 h-6 text-solar-yellow" />
                <h3 className="text-xl font-black tracking-tighter uppercase italic">Device Control</h3>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    {isOnline ? 'Device Online' : 'Device Offline'}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inverter Toggle */}
            <div className={`p-6 rounded-3xl border transition-all ${inverterState ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="flex justify-between items-start mb-4">
                    <Power className={`w-8 h-8 ${inverterState ? 'text-emerald-400' : 'text-red-400'}`} />
                    <button 
                        onClick={handleToggleInverter}
                        disabled={loading || !isOnline}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${inverterState ? 'bg-emerald-500' : 'bg-white/10'} relative`}
                    >
                        <motion.div 
                            layout
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                            animate={{ x: inverterState ? 24 : 0 }}
                        />
                    </button>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Inverter State</p>
                <p className={`text-xl font-black ${inverterState ? 'text-emerald-400' : 'text-red-400'}`}>
                    {inverterState ? 'RUNNING' : 'STOPPED'}
                </p>
            </div>

            {/* Active Power Limit */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                    <Zap className="w-8 h-8 text-solar-yellow" />
                    <span className="text-2xl font-black text-solar-yellow">{activePowerLimit}%</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Active Power Limit</p>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={activePowerLimit}
                    onChange={handlePowerLimitChange}
                    onMouseUp={commitPowerLimit}
                    disabled={loading || !isOnline}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-solar-yellow"
                />
            </div>

            {/* Peak Shaving Mode */}
            <div className={`p-6 rounded-3xl border transition-all ${peakShaving ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                    <Battery className={`w-8 h-8 ${peakShaving ? 'text-blue-400' : 'text-white/40'}`} />
                    <button 
                        onClick={handleTogglePeakShaving}
                        disabled={loading || !isOnline}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${peakShaving ? 'bg-blue-500' : 'bg-white/10'} relative`}
                    >
                        <motion.div 
                            layout
                            className="w-4 h-4 bg-white rounded-full shadow-lg"
                            animate={{ x: peakShaving ? 24 : 0 }}
                        />
                    </button>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Peak Shaving</p>
                <p className={`text-xl font-black ${peakShaving ? 'text-blue-400' : 'text-white/60'}`}>
                    {peakShaving ? 'ACTIVE' : 'DISABLED'}
                </p>
            </div>
        </div>

        {!isOnline && (
            <div className="absolute inset-0 bg-deep-navy/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="w-12 h-12 text-white/20" />
                    <p className="text-white/40 font-black tracking-widest uppercase text-xs">Device Offline - Controls Locked</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default DeviceControlPanel;
