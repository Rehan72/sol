import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  RefreshCcw, 
  Plus, 
  Save, 
  Trash2, 
  TrendingUp, 
  Globe,
  Settings2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';

const PricingSettings = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { showToast } = useToast();
  const [financialSim, setFinancialSim] = useState({
    cost: 500000,
    gstBenefit: null,
    loanModel: null
  });

  const fetchRules = async () => {
    try {
      const response = await client.get('/pricing/rules');
      setRules(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showToast('Failed to fetch pricing rules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await client.post('/pricing/sync-market');
      showToast('Market rates synced successfully with Google insights!', 'success');
      fetchRules();
    } catch (error) {
      showToast('Failed to sync market rates', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await client.patch(`/pricing/rules/${id}`, data);
      showToast('Rule updated successfully', 'success');
      fetchRules();
    } catch (error) {
      showToast('Failed to update rule', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      await client.delete(`/pricing/rules/${id}`);
      showToast('Rule deleted', 'success');
      fetchRules();
    } catch (error) {
      showToast('Failed to delete rule', 'error');
    }
  };

  const runSimulation = async () => {
    try {
        const [gstRes, loanRes] = await Promise.all([
            client.get(`/financials/gst-benefit?cost=${financialSim.cost}`),
            client.get(`/financials/loan-model?cost=${financialSim.cost}&rate=8.5&years=10`)
        ]);
        setFinancialSim(prev => ({
            ...prev,
            gstBenefit: gstRes.data,
            loanModel: loanRes.data
        }));
    } catch (error) {
        showToast('Simulation failed', 'error');
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      <div className="absolute inset-0 bg-deep-navy -z-20" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-lighter uppercase mb-2"
            >
              PRICING<span className="text-solar-yellow italic">ENGINE</span>
            </motion.h1>
            <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
              Automated Cost Estimation & Market Sync
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black tracking-tighter uppercase transition-all ${
                syncing 
                  ? 'bg-white/5 text-white/20' 
                  : 'bg-solar-yellow text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.3)]'
              }`}
            >
              <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync with Market'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {/* Market Intelligence card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-solar-yellow/10 blur-[60px] rounded-full -mr-16 -mt-16" />
              <Globe className="w-12 h-12 text-solar-yellow mb-6" />
              <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Market Intelligence</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Our automated engine syncs with current market indicators. Last sync performed on all rules marked with <TrendingUp className="inline w-3 h-3 text-solar-yellow" />.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <CheckCircle2 className="w-5 h-5 text-solar-yellow" />
                   <div>
                     <div className="text-[10px] font-black tracking-widest uppercase text-white/40">Panel Rate Index</div>
                     <div className="text-lg font-bold tracking-tight">₹40 - ₹60 / Wp</div>
                   </div>
                 </div>
              </div>
            </motion.div>

            {/* Financial Simulator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2rem] border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                  <Calculator className="text-solar-yellow w-6 h-6" />
                  <h3 className="text-xl font-black tracking-tighter uppercase italic text-white/80 font-inter">Financial Simulator</h3>
              </div>
              
              <div className="space-y-6">
                  <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Project Capital (₹)</label>
                      <input 
                          type="number" 
                          value={financialSim.cost}
                          onChange={(e) => setFinancialSim(prev => ({ ...prev, cost: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black tracking-tighter text-solar-yellow focus:outline-none focus:border-solar-yellow/50 transition-all"
                      />
                  </div>

                  <button 
                      onClick={runSimulation}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
                  >
                      Recalculate Projections
                  </button>

                  <AnimatePresence mode="wait">
                      {financialSim.gstBenefit && (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                           >
                              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">ITC Tax Benefit</span>
                                      <Percent className="w-3 h-3 text-emerald-400" />
                                  </div>
                                  <div className="text-xl font-black tracking-tighter">₹{financialSim.gstBenefit.gstAmount.toLocaleString()}</div>
                              </div>

                              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">Monthly EMI</span>
                                      <IndianRupee className="w-3 h-3 text-blue-400" />
                                  </div>
                                  <div className="text-xl font-black tracking-tighter">₹{financialSim.loanModel.monthlyEmi.toLocaleString()}</div>
                              </div>
                           </motion.div>
                      )}
                  </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Pricing Rules Table/List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
                <RefreshCcw className="w-10 h-10 text-solar-yellow/30 animate-spin mb-4" />
                <p className="text-white/20 font-black tracking-widest uppercase text-xs">Initializing Engine...</p>
              </div>
            ) : rules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
                <AlertCircle className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-white/20 font-black tracking-widest uppercase text-xs">No entries found. Sync now.</p>
              </div>
            ) : (
              rules.map((rule, idx) => (
                <motion.div 
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass p-6 rounded-3xl border border-white/10 hover:border-solar-yellow/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-solar-yellow/10 flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-solar-yellow" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-white/5 text-white/40">{rule.category}</span>
                           {rule.lastMarketSyncAt && (
                             <span className="flex items-center gap-1 text-[8px] font-black tracking-widest uppercase text-solar-yellow/60">
                               <TrendingUp className="w-2.5 h-2.5" /> Market Synced
                             </span>
                           )}
                        </div>
                        <h4 className="text-lg font-bold tracking-tighter truncate max-w-[200px]">{rule.itemName}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <div className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">Base Rate</div>
                        <div className="flex items-center gap-2">
                           <span className="text-xl font-black tracking-tighter">₹{rule.baseRate}</span>
                           <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">/ {rule.unit}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                         <button 
                           onClick={() => {
                             const newRate = prompt('Enter new base rate:', rule.baseRate);
                             if (newRate && !isNaN(newRate)) handleUpdate(rule.id, { baseRate: parseFloat(newRate) });
                           }}
                           className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                         >
                           <Settings2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(rule.id)}
                           className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            <button className="w-full py-6 rounded-3xl border border-white/5 border-dashed bg-white/2 text-white/20 hover:text-solar-yellow hover:bg-solar-yellow/5 hover:border-solar-yellow/20 transition-all flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-black tracking-widest uppercase text-xs">Define Custom Pricing Rule</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingSettings;
