import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCostEstimationById, finalizeCostEstimation, generateQuotationFromEstimation } from '../../api/costEstimation';
import { useToast } from '../../hooks/useToast';
import {
  ArrowLeft, CheckCircle, Loader2, Printer, Lock,
  Sun, Wrench, Zap, Cable, Radio, Shield, Activity,
  HardHat, FileText, Calculator
} from 'lucide-react';
import { motion } from 'framer-motion';

const STAGE_META = {
  stageDesign: { label: 'Stage 1 — Design & Pre-Installation', icon: FileText, color: 'from-blue-500 to-cyan-400' },
  stageMounting: { label: 'Stage 2 — Mounting Structure', icon: Wrench, color: 'from-orange-500 to-amber-400' },
  stagePanels: { label: 'Stage 3 — Solar Panels', icon: Sun, color: 'from-yellow-500 to-solar-gold' },
  stageDcElectrical: { label: 'Stage 4 — DC Side Electrical', icon: Cable, color: 'from-red-500 to-rose-400' },
  stageInverter: { label: 'Stage 5 — Inverter Installation', icon: Zap, color: 'from-emerald-500 to-green-400' },
  stageGridConnection: { label: 'Stage 6 — Grid Connection', icon: Radio, color: 'from-violet-500 to-purple-400' },
  stageEarthing: { label: 'Stage 7 — Earthing & Safety', icon: Shield, color: 'from-teal-500 to-cyan-400' },
  stageMonitoring: { label: 'Stage 8 — Monitoring System', icon: Activity, color: 'from-pink-500 to-rose-400' },
  stageLabour: { label: 'Stage 9 — Labour & Commissioning', icon: HardHat, color: 'from-amber-500 to-yellow-400' },
};

const STAGE_KEYS = Object.keys(STAGE_META);

const CostEstimationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [generatingQuotation, setGeneratingQuotation] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCostEstimationById(id);
        setEstimation(data);
      } catch (error) {
        addToast('Failed to load estimation', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleFinalize = async () => {
    if (!confirm('Finalize this estimation? It cannot be edited after this.')) return;
    try {
      setFinalizing(true);
      const updated = await finalizeCostEstimation(id);
      setEstimation(updated);
      addToast('Estimation finalized!', 'success');
    } catch (error) {
      addToast('Failed to finalize', 'error');
    } finally {
      setFinalizing(false);
    }
  };

  const handleGenerateQuotation = async () => {
    if (!confirm('Generate a formal quotation from this estimation?')) return;
    try {
      setGeneratingQuotation(true);
      const quotation = await generateQuotationFromEstimation(id);
      addToast('Quotation generated successfully!', 'success');
      navigate(`/quotations/${quotation.id}`);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to generate quotation', 'error');
    } finally {
      setGeneratingQuotation(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-white min-h-[50vh]">
        <Loader2 className="mb-4 animate-spin text-solar-yellow" size={32} />
        <span className="text-sm text-white/40 uppercase tracking-widest font-bold">Loading Estimation...</span>
      </div>
    );
  }

  if (!estimation) {
    return <div className="p-10 text-white/40 text-center">Estimation not found</div>;
  }

  const stageTotal = (stageKey) =>
    (estimation[stageKey] || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="relative p-6 text-white overflow-hidden print:bg-white print:text-black">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cost-estimation')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tighter">{estimation.projectName}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  estimation.status === 'FINALIZED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-white/5 text-white/40 border-white/10'
                }`}>
                  {estimation.status === 'FINALIZED' ? <span className="flex items-center gap-1"><Lock size={10} /> Finalized</span> : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                {estimation.estimationNumber} • {estimation.systemCapacity} kW • {estimation.plantType}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              <Printer size={16} /> Print
            </button>
            {estimation.status === 'FINALIZED' && !estimation.quotationId && (
              <button
                onClick={handleGenerateQuotation}
                disabled={generatingQuotation}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-solar-yellow text-deep-navy text-sm font-bold hover:bg-solar-gold transition-all disabled:opacity-50"
              >
                {generatingQuotation ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Generate Quotation
              </button>
            )}
            {estimation.quotationId && (
               <button
                onClick={() => navigate(`/quotations/${estimation.quotationId}`)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                <FileText size={16} className="text-solar-yellow" />
                View Quotation
              </button>
            )}
            {estimation.status !== 'FINALIZED' && (
              <button
                onClick={handleFinalize}
                disabled={finalizing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
              >
                {finalizing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Finalize
              </button>
            )}
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold">{estimation.projectName}</h1>
          <p className="text-sm text-gray-600">{estimation.estimationNumber} • {estimation.systemCapacity} kW • {estimation.plantType}</p>
          <p className="text-sm text-gray-600">Date: {new Date(estimation.createdAt).toLocaleDateString('en-IN')}</p>
        </div>

        {/* Meta Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'System Capacity', value: `${estimation.systemCapacity} kW`, icon: Sun },
            { label: 'Plant Type', value: estimation.plantType, icon: Zap },
            { label: 'Estimation #', value: estimation.estimationNumber, icon: FileText },
            { label: 'Created', value: new Date(estimation.createdAt).toLocaleDateString('en-IN'), icon: Calculator },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="p-4 border border-white/5 bg-black/20 rounded-xl text-center print:border-gray-200 print:bg-gray-50">
              <Icon size={18} className="mx-auto mb-2 text-solar-yellow print:text-gray-600" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 print:text-gray-500">{label}</p>
              <p className="text-lg font-bold text-white print:text-black">{value}</p>
            </div>
          ))}
        </div>

        {/* Stage Tables */}
        <div className="space-y-6 mb-8">
          {STAGE_KEYS.map((key) => {
            const meta = STAGE_META[key];
            const items = estimation[key] || [];
            const Icon = meta.icon;
            if (items.length === 0) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/10 rounded-2xl overflow-hidden print:border-gray-300"
              >
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 print:bg-gray-100 print:border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center print:bg-gray-400`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-white/70 print:text-black">{meta.label}</h3>
                  </div>
                  <span className="text-sm font-bold text-solar-yellow tabular-nums print:text-black">
                    ₹{stageTotal(key).toLocaleString('en-IN')}
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 print:text-gray-600 print:border-gray-200">
                      <th className="text-left p-3 pl-6">Item</th>
                      <th className="text-center p-3">Qty</th>
                      <th className="text-center p-3">Unit</th>
                      <th className="text-right p-3">Rate (₹)</th>
                      <th className="text-right p-3 pr-6">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-gray-200">
                    {items.map((lineItem, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] print:hover:bg-white">
                        <td className="p-3 pl-6 text-white/80 print:text-black">{lineItem.item}</td>
                        <td className="p-3 text-center text-white/60 tabular-nums print:text-black">{lineItem.qty}</td>
                        <td className="p-3 text-center text-white/40 print:text-gray-600">{lineItem.unit}</td>
                        <td className="p-3 text-right text-white/60 tabular-nums print:text-black">₹{(lineItem.rate || 0).toLocaleString('en-IN')}</td>
                        <td className="p-3 pr-6 text-right font-bold text-white tabular-nums print:text-black">₹{(lineItem.amount || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            );
          })}
        </div>

        {/* Cost Summary */}
        <div className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.03] print:border-gray-300 print:bg-gray-50">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60 flex items-center gap-2 print:text-black">
              <Calculator size={16} className="text-solar-yellow print:text-gray-600" />
              Final Cost Summary
            </h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm mb-4">
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {STAGE_KEYS.map((key) => {
                  const total = stageTotal(key);
                  if (total === 0) return null;
                  return (
                    <tr key={key}>
                      <td className="py-2.5 text-white/60 print:text-gray-600">{STAGE_META[key].label.split(' — ')[1]}</td>
                      <td className="py-2.5 text-right font-bold text-white tabular-nums print:text-black">₹{total.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="space-y-2 border-t border-white/10 pt-4 print:border-gray-300">
              <div className="flex justify-between">
                <span className="text-sm text-white/50 print:text-gray-600">Subtotal</span>
                <span className="font-bold text-white tabular-nums print:text-black">₹{(estimation.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50 print:text-gray-600">Contingency ({estimation.contingencyPercent}%)</span>
                <span className="font-bold text-white/80 tabular-nums print:text-black">₹{(estimation.contingencyAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50 print:text-gray-600">GST ({estimation.gstPercent}%)</span>
                <span className="font-bold text-white/80 tabular-nums print:text-black">₹{(estimation.gstAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center p-4 rounded-xl bg-solar-yellow/10 border border-solar-yellow/20 print:bg-yellow-50 print:border-yellow-300">
              <span className="text-sm font-black uppercase tracking-widest text-solar-yellow print:text-black">Total Project Cost</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-solar-yellow to-solar-gold tabular-nums print:text-black">
                ₹{(estimation.totalProjectCost || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {estimation.notes && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 print:bg-gray-50 print:border-gray-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 print:text-gray-500">Notes</p>
                <p className="text-sm text-white/70 print:text-black">{estimation.notes}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CostEstimationView;
