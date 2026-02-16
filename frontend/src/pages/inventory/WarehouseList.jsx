import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  User, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { getWarehouses } from '../../api/inventory';

const WarehouseList = () => {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const res = await getWarehouses();
            setWarehouses(res || []);
        } catch (error) {
            console.error("Failed to fetch warehouses", error);
        } finally {
            setLoading(false);
        }
    };
    fetchWarehouses();
  }, []);

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col p-8">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <WarehouseIcon className="w-8 h-8 text-solar-yellow" />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                WAREHOUSE <span className="text-solar-yellow italic">NETWORK</span>
              </h1>
              <p className="text-white/50 text-sm font-medium">Manage storage facilities and hardware distribution logs.</p>
           </div>
        </div>

        <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-solar-yellow hover:text-black border border-white/10 rounded-2xl transition-all duration-300 group">
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black tracking-widest uppercase">Add Facility</span>
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-12 h-12 border-4 border-solar-yellow/20 border-t-solar-yellow rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {warehouses.map((wh, idx) => {
            const itemCount = wh.items?.length || 0;
            const load = Math.min(100, itemCount * 10);
            return (
              <motion.div
                key={wh.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-solar-yellow/20 group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-8">
                   <span className={`text-[9px] font-black tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border ${
                     load > 80 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                     load > 40 ? 'bg-solar-yellow/10 border-solar-yellow/20 text-solar-yellow' : 
                     'bg-green-500/10 border-green-500/20 text-green-500'
                   }`}>
                     {load}% CAPACITY
                   </span>
                </div>

                <div className="mb-12">
                   <h3 className="text-2xl font-black tracking-tight mb-6 group-hover:text-solar-yellow transition-colors">{wh.name}</h3>
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/50">
                         <MapPin className="w-4 h-4 text-solar-yellow/70" />
                         <span className="text-xs font-medium">{wh.location || 'Location Pending'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/50">
                         <User className="w-4 h-4 text-solar-yellow/70" />
                         <span className="text-xs font-bold text-white/80">Manager Assigned</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-8">
                      <div>
                         <p className="text-2xl font-black tracking-tighter">{itemCount}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-white/20">SKUs in Stock</p>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${
                               load > 80 ? 'bg-red-500' : load > 40 ? 'bg-solar-yellow' : 'bg-green-500'
                            }`} style={{ width: `${load}%` }} />
                         </div>
                      </div>
                   </div>

                   <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-solar-yellow hover:text-black border border-white/10 transition-all flex items-center justify-center">
                      <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            );
          })}
          {warehouses.length === 0 && (
            <div className="md:col-span-2 text-center py-20 glass rounded-[2.5rem] border border-white/5">
                <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No warehouses found in your network.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseList;
