import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCostEstimations, deleteCostEstimation } from '../../api/costEstimation';
import { useToast } from '../../hooks/useToast';
import {
  Plus, Search, Calculator, ArrowRight, Trash2,
  FileText, CheckCircle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';

const CostEstimationList = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEstimations = async () => {
    try {
      const data = await getAllCostEstimations();
      setEstimations(data);
    } catch (error) {
      addToast('Failed to load estimations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this estimation?')) return;
    try {
      await deleteCostEstimation(id);
      addToast('Estimation deleted', 'success');
      setEstimations((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const filtered = estimations.filter((est) =>
    est.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    est.estimationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative p-6 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              Cost <span className="text-solar-yellow italic">Estimations</span>
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
              BOQ Templates — Solar Installation Projects
            </p>
          </div>
          {/* <button
            onClick={() => navigate('/cost-estimation/create')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-solar-yellow text-deep-navy text-sm font-bold hover:bg-solar-gold transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            <Plus size={16} /> New Estimation
          </button> */}

          <Button
            onClick={() => navigate('/cost-estimation/create')}
            className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold flex items-center gap-2 px-6"
          >
            <Plus className="w-5 h-5" /> New Estimation
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name or estimation number..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-solar-yellow/50 transition-colors"
          />
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Calculator size={48} className="mx-auto mb-4 text-white/10" />
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-2">No Estimations Found</p>
            <p className="text-white/20 text-xs">Create your first cost estimation template</p>
          </motion.div>
        )}

        {/* Estimation Cards */}
        <div className="grid gap-4">
          {filtered.map((est, index) => (
            <motion.div
              key={est.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/cost-estimation/${est.id}`)}
              className="group relative p-5 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] transition-all cursor-pointer hover:border-solar-yellow/20 overflow-hidden"
            >
              {/* Left Hover Indicator */}
              <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-solar-yellow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solar-yellow/20 to-solar-gold/10 flex items-center justify-center border border-solar-yellow/10">
                    <FileText size={20} className="text-solar-yellow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-white">{est.projectName || 'Untitled Project'}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${est.status === 'FINALIZED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-white/5 text-white/40 border-white/10'
                        }`}>
                        {est.status === 'FINALIZED' ? <span className="flex items-center gap-1"><CheckCircle size={10} /> Finalized</span> : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="font-mono">{est.estimationNumber}</span>
                      <span>•</span>
                      <span>{est.systemCapacity || 0} kW</span>
                      <span>•</span>
                      <span>{est.plantType}</span>
                      <span>•</span>
                      <span>{new Date(est.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    {est.quotationId && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-solar-yellow/10 border border-solar-yellow/20 text-[10px] font-bold text-solar-yellow uppercase tracking-wider">
                        <FileText size={10} /> Linked to Quotation
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-0.5">Total Cost</p>
                    <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-solar-yellow to-solar-gold tabular-nums">
                      ₹{(est.totalProjectCost || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  {est.status !== 'FINALIZED' && (
                    <button
                      onClick={(e) => handleDelete(est.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <ArrowRight size={16} className="text-white/20 group-hover:text-solar-yellow transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CostEstimationList;
