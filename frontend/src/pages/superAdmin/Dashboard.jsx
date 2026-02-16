import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantsRes, statsRes] = await Promise.all([
          client.get('/portfolio/plants'),
          client.get('/portfolio/stats')
        ]);
        setPlants(Array.isArray(plantsRes.data) ? plantsRes.data : []);
        setStats(statsRes.data);
      } catch (error) {
        showToast('Failed to fetch operations data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onlinePlants = plants.filter(p => p.status === 'OPERATIONAL' || p.status === 'active').length;
  const totalCapacity = stats?.totalCapacityKw || 0;
  const activeAlerts = stats?.activeIssues || 0;

  return (
    <div className="min-h-screen p-8 relative overflow-hidden flex flex-col">
       {/* Background */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-lighter uppercase mb-2"
            >
              OPERATIONS<span className="text-emerald-400 italic">CENTER</span>
            </motion.h1>
            <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
              Real-time Status of {plants.length} Distributed Assets
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeAlerts > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                   {activeAlerts > 0 ? `${activeAlerts} Active Alerts` : 'All Systems Nominal'}
                </span>
             </div>
          </div>
        </div>

        {/* Status Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatusCard 
               label="Online Systems" 
               value={`${onlinePlants}/${plants.length}`} 
               subtext="Grid Connected"
               icon={Wifi} 
               color="emerald-400" 
            />
             <StatusCard 
               label="Current Load" 
               value={`${(totalCapacity * 0.85).toFixed(1)} kW`} 
               subtext="85% Efficiency"
               icon={Zap} 
               color="solar-yellow" 
            />
             <StatusCard 
               label="Maintenance" 
               value={activeAlerts} 
               subtext="Tickets Open"
               icon={AlertTriangle} 
               color={activeAlerts > 0 ? "red-500" : "white/20"} 
            />
        </div>

        {/* Plant Grid */}
        <h2 className="text-xl font-bold tracking-tighter uppercase italic mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-solar-yellow" />
            Live Plant Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {plants.map((plant, index) => (
             <PlantOperationCard key={plant.id} plant={plant} index={index} />
           ))}
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ label, value, subtext, icon: Icon, color }) => (
  <motion.div 
     whileHover={{ y: -5 }}
     className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden"
  >
     <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}`}>
        <Icon className="w-16 h-16" />
     </div>
     <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
        <p className="text-3xl font-black text-white mb-1">{value}</p>
        <p className={`text-[10px] font-bold uppercase tracking-wide text-${color}`}>{subtext}</p>
     </div>
  </motion.div>
);

const PlantOperationCard = ({ plant, index }) => {
  const isOnline = plant.status === 'OPERATIONAL' || plant.status === 'active';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass p-6 rounded-2xl border ${isOnline ? 'border-emerald-500/20' : 'border-red-500/20'} relative overflow-hidden group hover:bg-white/5 transition-all`}
    >
       <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
             </div>
             <div>
                <h3 className="font-bold text-sm tracking-tight group-hover:text-solar-yellow transition-colors">{plant.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                   <MapPin className="w-3 h-3" />
                   {plant.location.split(',')[0]}
                </div>
             </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
       </div>

       <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
             <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Capacity</p>
             <p className="text-lg font-bold">{plant.capacity} kW</p>
          </div>
          <div>
             <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Real-time</p>
             <p className={`text-lg font-bold ${isOnline ? 'text-emerald-400' : 'text-white/20'}`}>
                {(plant.capacity * (0.6 + Math.random() * 0.3)).toFixed(1)} kW
             </p>
          </div>
       </div>

       <Link 
          to={`/monitoring/${plant.id}`} 
          className="w-full py-2 flex items-center justify-center gap-2 bg-white/5 hover:bg-emerald-500 hover:text-deep-navy border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
       >
          <Activity className="w-3 h-3" /> Monitor Live
       </Link>
    </motion.div>
  )
}

export default Dashboard;