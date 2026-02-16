import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  Users, 
  Zap, 
  TrendingUp, 
  MapPin, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Leaf,
  Droplets,
  ShieldCheck,
  ZapOff,
  Globe,
  Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';

const PortfolioDashboard = () => {
  const [stats, setStats] = useState(null);
  const [plants, setPlants] = useState([]);
  const [esgData, setEsgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, plantsRes, esgRes] = await Promise.all([
          client.get('/portfolio/stats'),
          client.get('/portfolio/plants'),
          client.get('/audit/esg-report')
        ]);
        setStats(statsRes.data);
        setPlants(Array.isArray(plantsRes.data) ? plantsRes.data : []);
        setEsgData(esgRes.data);
      } catch (error) {
        showToast('Failed to fetch portfolio data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 

  return (
    <div className="min-h-screen p-8 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-solar-yellow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-lighter uppercase mb-2"
            >
              PORTFOLIO<span className="text-solar-yellow italic">ANALYTICS</span>
            </motion.h1>
            <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
              Aggregate Performance Across {stats?.totalPlants} Solar Plants
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-3 glass rounded-2xl border border-white/10 flex items-center gap-3">
              <Globe className="w-5 h-5 text-solar-yellow" />
              <div className="text-right">
                <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Network Health</p>
                <p className="text-sm font-bold">98.2% Optimal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard 
            title="Total Revenue" 
            value={`₹${(stats?.totalRevenue / 10000000).toFixed(2)}Cr`} 
            icon={IndianRupee} 
            trend="+12.5%" 
            color="solar-yellow"
          />
          <KpiCard 
            title="Active Capacity" 
            value={`${(stats?.totalCapacityKw / 1000).toFixed(1)} MW`} 
            icon={Zap} 
            trend="+240 kW" 
            color="emerald-400"
          />
          <KpiCard 
            title="Daily Gen (Est)" 
            value={`${stats?.estimatedDailyGeneration?.toLocaleString()} kWh`} 
            icon={Sun} 
            trend="+5%" 
            color="orange-400"
          />
          <KpiCard 
            title="Carbon Offset" 
            value={`${esgData?.totalCarbonOffsetTon?.toLocaleString() || stats?.carbonOffsetMetricTons?.toLocaleString()} T`} 
            icon={Leaf} 
            trend="+82kg Today" 
            color="emerald-400"
          />
        </div>

        {/* Anomaly Alert Bar */}
        <AnimatePresence>
          {stats?.activeIssues > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 glass border border-red-500/20 rounded-2xl bg-red-500/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-500/10 rounded-xl">
                  <ZapOff className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-red-500 tracking-widest leading-none mb-1">Critical System Anomaly</p>
                  <p className="text-sm font-bold text-white/80">{stats.activeIssues} plants reporting efficiency bottlenecks / suspected hardware faults.</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                Deploy Maintenance
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plant Performance Table */}
          <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tighter uppercase italic">Plant Performance</h3>
              <button className="text-[10px] font-black tracking-widest uppercase text-solar-yellow hover:text-white transition-colors">View All Plants</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-6 text-[10px] font-black tracking-widest uppercase text-white/40 border-b border-white/10">Plant Name</th>
                    <th className="p-6 text-[10px] font-black tracking-widest uppercase text-white/40 border-b border-white/10">Location</th>
                    <th className="p-6 text-[10px] font-black tracking-widest uppercase text-white/40 border-b border-white/10">Users</th>
                    <th className="p-6 text-[10px] font-black tracking-widest uppercase text-white/40 border-b border-white/10 text-center">Health</th>
                    <th className="p-6 text-[10px] font-black tracking-widest uppercase text-white/40 border-b border-white/10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Array.isArray(plants) && plants.map((plant) => (
                    <tr key={plant.id} className="hover:bg-white/2 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${plant.status === 'OPERATIONAL' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
                          <span className="font-bold tracking-tight group-hover:text-solar-yellow transition-colors">{plant.name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <MapPin className="w-3 h-3" />
                          {plant.location}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-bold">{plant.customers}</span>
                      </td>
                      <td className="p-6 text-center">
                         <div className="flex flex-col items-center gap-1">
                            <span className={`text-sm font-bold ${plant.healthScore > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{plant.healthScore}%</span>
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500" style={{ width: `${plant.healthScore}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Insights & Alerts */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-solar-yellow w-6 h-6" />
                  <h3 className="text-lg font-bold tracking-tighter uppercase italic">System Health</h3>
                </div>
                <div className="space-y-6">
                   <HealthMetric label="Inverter Health" value="99.4%" color="emerald-400" />
                   <HealthMetric label="Grid Stability" value="92.1%" color="emerald-400" />
                   <HealthMetric label="Data Latency" value="1.2s" color="amber-400" />
                </div>
             </div>

             <div className="glass p-8 rounded-[2rem] border border-white/10">
                <div className="flex items-center gap-3 mb-6 font-bold uppercase tracking-tighter italic">
                  <Leaf className="text-emerald-400 w-5 h-5" />
                  ESG Impact 2.0
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <Droplets className="w-5 h-5 text-blue-400" />
                         <div>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Water Offset</p>
                            <p className="text-sm font-black">{esgData?.waterSavedLiters?.toLocaleString() || '120k'} L</p>
                         </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/20" />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <IndianRupee className="w-5 h-5 text-solar-yellow" />
                         <div>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Carbon Credits</p>
                            <p className="text-sm font-black">{esgData?.carbonCreditsEarned?.toLocaleString() || '450'} Units</p>
                         </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/20" />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-400" />
                         <div>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Compliance</p>
                            <p className="text-sm font-black">{esgData?.complianceStatus || '98.5%'}</p>
                         </div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-500 text-[8px] font-black uppercase rounded text-deep-navy">Verified</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group transition-all"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 blur-2xl rounded-full -mr-8 -mt-8`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}/10 border border-${color}/20 text-${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
        <ArrowUpRight className="w-3 h-3" /> {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">{title}</p>
      <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
    </div>
  </motion.div>
);

const HealthMetric = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
      <span>{label}</span>
      <span className={`text-${color}`}>{value}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}`} style={{ width: value }} />
    </div>
  </div>
);

export default PortfolioDashboard;
