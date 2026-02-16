import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Zap, Sun, Wind, Thermometer, Activity, 
  AlertTriangle, RefreshCcw, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';
import DeviceControlPanel from './DeviceControlPanel';

const LiveMonitor = () => {
  const { plantId } = useParams();
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [liveRes, historyRes, forecastRes] = await Promise.all([
        client.get(`/monitoring/live/${plantId}`),
        client.get(`/monitoring/history/${plantId}?limit=24`),
        client.get(`/monitoring/forecast/${plantId}`)
      ]);
      setLiveData(liveRes.data);
      setForecast(forecastRes.data);
      // Reverse history to show chronological order for chart
      setHistory([...historyRes.data].reverse().map(log => ({
        time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        kw: log.kwGeneration,
        efficiency: log.efficiency
      })));
    } catch (error) {
      if (error.response?.status === 403) {
        showToast('Elite access required for live monitoring', 'error');
      } else {
        showToast('Failed to fetch telemetry', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s update
    return () => clearInterval(interval);
  }, [plantId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-deep-navy">
        <Activity className="w-12 h-12 text-solar-yellow animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-8 relative overflow-hidden flex flex-col">
        {/* Background Effects */}
        <div className="film-grain" />
        <div className="cinematic-vignette" />
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                        LIVE<span className="text-solar-yellow italic">TELEMETRY</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    {liveData?.anomaly?.status !== 'STABLE' && (
                        <div className={`px-6 py-3 glass rounded-2xl border ${liveData?.anomaly?.status === 'CRITICAL' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'} flex items-center gap-3 animate-pulse`}>
                            <AlertTriangle className={`w-5 h-5 ${liveData?.anomaly?.status === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`} />
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Diagnostic Alert</p>
                                <p className={`text-sm font-bold ${liveData?.anomaly?.status === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{liveData?.anomaly?.status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <MetricCard 
                    label="Instant Generation" 
                    value={`${liveData?.currentKw || 0} kW`} 
                    icon={Zap} 
                    color="solar-yellow"
                />
                <MetricCard 
                    label="System Efficiency" 
                    value={`${liveData?.efficiency || 0}%`} 
                    icon={Activity} 
                    color="emerald-400"
                />
                <MetricCard 
                    label="Irradiance" 
                    value={`${liveData?.irradiance || 0} W/m²`} 
                    icon={Sun} 
                    color="orange-400"
                />
                <MetricCard 
                    label="Ambient Temp" 
                    value={`${liveData?.ambientTemp || 0}°C`} 
                    icon={Thermometer} 
                    color="blue-400"
                />
            </div>

            {/* Device Control Panel */}
            <div className="mb-12">
                <DeviceControlPanel plantId={plantId} isOnline={liveData?.isActive || true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generation Curve */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/10"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold tracking-tighter uppercase italic">24H Generation Flow</h3>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-[10px] font-bold text-solar-yellow/60 uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-solar-yellow" /> Generation (kW)
                            </span>
                        </div>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBFF00" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FBFF00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#ffffff20" 
                                    fontSize={10} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#ffffff20" 
                                    fontSize={10} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0A0B10', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="kw" 
                                    stroke="#FBFF00" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorGen)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Efficiency Index & Forecast */}
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-8 rounded-[2.5rem] border border-white/10"
                    >
                        <h3 className="text-xl font-bold tracking-tighter uppercase italic mb-6 text-emerald-400">Health index</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle 
                                        cx="96" cy="96" r="80" 
                                        stroke="rgba(255,255,255,0.05)" 
                                        strokeWidth="12" fill="transparent" 
                                    />
                                    <circle 
                                        cx="96" cy="96" r="80" 
                                        stroke={liveData?.anomaly?.status === 'CRITICAL' ? '#EF4444' : liveData?.anomaly?.status === 'WARNING' ? '#F59E0B' : '#10B981'} 
                                        strokeWidth="12" 
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 80}
                                        strokeDashoffset={2 * Math.PI * 80 * (1 - (liveData?.efficiency || 0) / 100)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">{liveData?.efficiency}%</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-40">Efficiency</span>
                                </div>
                            </div>
                            <p className="mt-8 text-center text-xs text-white/40 leading-relaxed font-bold uppercase tracking-tight">
                                {liveData?.anomaly?.message || 'System performance is operating within normal variance parameters.'}
                            </p>
                            <div className="mt-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black tracking-widest uppercase text-white/60">
                                AI Confidence: {liveData?.anomaly?.confidence || 98}%
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-8 rounded-[2.5rem] border border-white/10"
                    >
                        <h3 className="text-xl font-bold tracking-tighter uppercase italic mb-6">7-Day Forecast</h3>
                        <div className="space-y-4">
                            {forecast.slice(0, 5).map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/2 rounded-2xl border border-white/5 group hover:border-solar-yellow/20 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white/30 tracking-tight">{f.date}</span>
                                        <span className="text-sm font-bold">{f.expectedKw} kW/h</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Conf.</p>
                                            <p className="text-xs font-bold text-solar-yellow">{f.weatherConfidence}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, color }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 blur-2xl rounded-full -mr-8 -mt-8`} />
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-${color}/10 text-${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/20" />
        </div>
        <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tighter">{value}</p>
    </motion.div>
);

export default LiveMonitor;
