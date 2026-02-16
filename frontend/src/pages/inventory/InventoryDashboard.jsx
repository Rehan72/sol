import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Warehouse, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  Filter,
  Plus,
  Box,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInventory, getWarehouses, getStockTransactions } from '../../api/inventory';

const InventoryDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    recentMovements: 0,
    warehouses: 0
  });

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [inventoryRes, warehousesRes, transactionsRes] = await Promise.all([
                getInventory(),
                getWarehouses(),
                getStockTransactions()
            ]);
            
            setItems(inventoryRes || []);
            setWarehouses(warehousesRes || []);
            setTransactions(transactionsRes || []);
            
            // Calculate stats
            const total = inventoryRes?.reduce((acc, curr) => acc + curr.totalQuantity, 0) || 0;
            const low = inventoryRes?.filter(i => i.availableQuantity < 10).length || 0;
            const recent = transactionsRes?.length || 0;
            
            setStats({
                totalItems: total,
                lowStock: low,
                recentMovements: recent,
                warehouses: warehousesRes?.length || 0
            });
        } catch (error) {
            console.error("Failed to fetch inventory data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Solar Modules', count: items.filter(i => i.category === 'MODULE').length, color: 'text-solar-yellow', icon: Box },
    { name: 'Inverters', count: items.filter(i => i.category === 'INVERTER').length, color: 'text-blue-400', icon: Activity },
    { name: 'Cables & Wiring', count: items.filter(i => i.category === 'CABLE').length, color: 'text-orange-400', icon: Package },
    { name: 'Others', count: items.filter(i => !['MODULE', 'INVERTER', 'CABLE'].includes(i.category)).length, color: 'text-purple-400', icon: Warehouse },
  ];

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col p-8">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tighter uppercase mb-2"
          >
            INVENTORY <span className="text-solar-yellow italic">& STOCK</span>
          </motion.h1>
          <p className="text-white/50 text-sm font-medium">Global hardware management and real-time stock orchestration.</p>
        </div>

        <div className="flex gap-4">
          <Link to="/inventory/warehouses" className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300">
            <Warehouse className="w-4 h-4 text-solar-yellow" />
            <span className="text-[10px] font-black tracking-widest uppercase">Manage Warehouses</span>
          </Link>
          <button className="flex items-center gap-3 px-8 py-4 bg-solar-yellow hover:scale-105 text-black rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-widest uppercase">New Stock Entry</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-12 h-12 border-4 border-solar-yellow/20 border-t-solar-yellow rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative z-10">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Stock Units', value: stats.totalItems, icon: Box },
              { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, status: stats.lowStock > 0 ? 'text-red-500' : 'text-green-500' },
              { label: 'Recent Movements', value: stats.recentMovements, icon: Truck, trend: '+recent' },
              { label: 'Total Warehouses', value: stats.warehouses, icon: Warehouse },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/5 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-solar-yellow/10 transition-colors">
                   <stat.icon className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <span className={`text-4xl font-black tracking-tighter ${stat.status || 'text-white'}`}>{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-2 px-2">
                 <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Asset Categories</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="glass p-8 rounded-[2rem] border border-white/5 hover:border-solar-yellow/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${cat.color} group-hover:bg-white/10 transition-colors`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg tracking-tight mb-1">{cat.name}</p>
                        <p className="text-white/40 text-xs font-medium">In Stock Items</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-2xl font-black tracking-tight ${cat.color}`}>{cat.count}</p>
                       <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Unique SKUs</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Ledger */}
              <div className="glass p-8 rounded-[2.5rem] border border-white/10">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Stock Ledger (Live Feed)</h3>
                   <button className="text-solar-yellow text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                   {transactions.map((log, i) => (
                     <div key={log.id || i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2">
                        <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg ${log.type === 'STOCK_IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {log.type === 'STOCK_IN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                           </div>
                           <div>
                              <p className="text-sm font-bold">{log.item?.name || 'Stock Item'}</p>
                              <p className="text-[10px] text-white/40 font-medium uppercase truncate w-32 md:w-auto">SKU: {log.item?.sku || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`font-black ${log.type === 'STOCK_IN' ? 'text-green-500' : 'text-red-500'}`}>{log.type === 'STOCK_IN' ? '+' : '-'}{log.quantity}</p>
                           <p className="text-[9px] text-white/20 font-bold uppercase">{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </div>
                     </div>
                   ))}
                   {transactions.length === 0 && <p className="text-center text-white/20 py-8 italic">No recent transactions recorded.</p>}
                </div>
              </div>
            </div>

            {/* Warehouse Health */}
            <div>
               <div className="glass p-8 rounded-[2.5rem] border border-white/10 sticky top-24">
                  <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-8 text-center">Warehouse Health</h3>
                  
                  <div className="space-y-8 mb-12">
                     {warehouses.map((wh, i) => {
                       const load = Math.min(100, Math.floor((wh.items?.length || 0) * 10)); // Simplified load
                       const color = load > 80 ? 'bg-red-400' : load > 40 ? 'bg-solar-yellow' : 'bg-green-400';
                       return (
                         <div key={wh.id || i} className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                                <span className="text-white/60">{wh.name}</span>
                                <span className="text-white/80">{load}% Capacity</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${load}%` }}
                                  transition={{ duration: 1, delay: 0.5 + i*0.1 }}
                                  className={`h-full ${color}`} 
                                />
                             </div>
                         </div>
                       );
                     })}
                     {warehouses.length === 0 && <p className="text-center text-white/20 italic text-xs">No warehouses identified.</p>}
                  </div>

                  <div className="p-6 rounded-2xl bg-solar-yellow/5 border border-solar-yellow/20 italic text-xs text-center text-solar-yellow/80">
                    Audit inventory across all facilities to ensure optimal regional coverage.
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
