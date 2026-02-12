import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCostEstimation } from '../../api/costEstimation';
import { useToast } from '../../hooks/useToast';
import {
  ChevronDown, ChevronUp, Plus, Trash2, Save, CheckCircle,
  ArrowLeft, Calculator, Sun, Wrench, Zap, Cable, Radio,
  Shield, Activity, HardHat, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Default items per installation stage ─────────────────────────────
const STAGE_DEFAULTS = {
  stageDesign: {
    label: 'STAGE 1 — Design & Pre-Installation',
    icon: FileText,
    color: 'from-blue-500 to-cyan-400',
    items: [
      { item: 'Site Survey', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Structural Analysis', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Electrical Design & Drawings', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Net Metering Processing', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Transportation Charges', qty: 1, unit: 'Lot', rate: 0, amount: 0 },
    ],
  },
  stageMounting: {
    label: 'STAGE 2 — Mounting Structure Installation',
    icon: Wrench,
    color: 'from-orange-500 to-amber-400',
    items: [
      { item: 'GI / HDG Mounting Structure', qty: 1, unit: 'Set', rate: 0, amount: 0 },
      { item: 'Aluminum Rails', qty: 1, unit: 'Set', rate: 0, amount: 0 },
      { item: 'Anchor Bolts', qty: 1, unit: 'Set', rate: 0, amount: 0 },
      { item: 'Fasteners (SS Nuts & Bolts)', qty: 1, unit: 'Lot', rate: 0, amount: 0 },
      { item: 'Tilt Supports', qty: 1, unit: 'Set', rate: 0, amount: 0 },
      { item: 'Ballast Blocks (if required)', qty: 0, unit: 'Set', rate: 0, amount: 0 },
    ],
  },
  stagePanels: {
    label: 'STAGE 3 — Solar Panel Installation',
    icon: Sun,
    color: 'from-yellow-500 to-solar-gold',
    items: [
      { item: 'Solar Panels (Mono/Poly)', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Mid Clamps', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'End Clamps', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Module Earthing Lugs', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'MC4 Connectors', qty: 0, unit: 'Pair', rate: 0, amount: 0 },
      { item: 'DC Extension Cables', qty: 0, unit: 'Mtr', rate: 0, amount: 0 },
    ],
  },
  stageDcElectrical: {
    label: 'STAGE 4 — DC Side Electrical',
    icon: Cable,
    color: 'from-red-500 to-rose-400',
    items: [
      { item: 'DC Cables (Red & Black, UV)', qty: 0, unit: 'Mtr', rate: 0, amount: 0 },
      { item: 'DC Combiner Box', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'DC Isolator Switch', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'DC Fuse', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Surge Protection Device (SPD)', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Cable Trays / Conduits', qty: 0, unit: 'Mtr', rate: 0, amount: 0 },
      { item: 'Cable Ties & Markers', qty: 1, unit: 'Lot', rate: 0, amount: 0 },
    ],
  },
  stageInverter: {
    label: 'STAGE 5 — Inverter Installation',
    icon: Zap,
    color: 'from-emerald-500 to-green-400',
    items: [
      { item: 'Solar Inverter (String/Central)', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Mounting Bracket', qty: 1, unit: 'Set', rate: 0, amount: 0 },
      { item: 'AC Distribution Board', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'MCCB / MCB', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'AC Cables', qty: 0, unit: 'Mtr', rate: 0, amount: 0 },
      { item: 'CT Sensors (if needed)', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
    ],
  },
  stageGridConnection: {
    label: 'STAGE 6 — Grid Connection',
    icon: Radio,
    color: 'from-violet-500 to-purple-400',
    items: [
      { item: 'Net Meter (Bi-directional)', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Energy Meter', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Transformer (if HT)', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Grid Synchronization Panel', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
    ],
  },
  stageEarthing: {
    label: 'STAGE 7 — Earthing & Safety',
    icon: Shield,
    color: 'from-teal-500 to-cyan-400',
    items: [
      { item: 'Earthing Pits (Chemical)', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Copper Earthing Wire', qty: 0, unit: 'Mtr', rate: 0, amount: 0 },
      { item: 'Lightning Arrester', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Danger Boards', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Fire Extinguisher', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Insulation Mats', qty: 0, unit: 'Nos', rate: 0, amount: 0 },
    ],
  },
  stageMonitoring: {
    label: 'STAGE 8 — Monitoring System',
    icon: Activity,
    color: 'from-pink-500 to-rose-400',
    items: [
      { item: 'Data Logger', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'WiFi / 4G Router', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Monitoring Software License', qty: 1, unit: 'Nos', rate: 0, amount: 0 },
      { item: 'Internet Setup', qty: 1, unit: 'Job', rate: 0, amount: 0 },
    ],
  },
  stageLabour: {
    label: 'STAGE 9 — Installation Labour & Commissioning',
    icon: HardHat,
    color: 'from-amber-500 to-yellow-400',
    items: [
      { item: 'Installation Labour Charges', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Testing & Commissioning Charges', qty: 1, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Crane / Lifting Charges (if required)', qty: 0, unit: 'Job', rate: 0, amount: 0 },
      { item: 'Scaffolding', qty: 0, unit: 'Job', rate: 0, amount: 0 },
    ],
  },
};

const STAGE_KEYS = Object.keys(STAGE_DEFAULTS);

// ─── StageAccordion Component ──────────────────────────────────────────
const StageAccordion = ({ stageKey, config, items, onItemsChange, isOpen, onToggle, stageTotal }) => {
  const Icon = config.icon;

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      updated[index].amount = (updated[index].qty || 0) * (updated[index].rate || 0);
    }
    onItemsChange(stageKey, updated);
  };

  const addItem = () => {
    onItemsChange(stageKey, [...items, { item: '', qty: 0, unit: 'Nos', rate: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    onItemsChange(stageKey, items.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      layout
      className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.02]"
    >
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-[11px] font-black tracking-[0.15em] uppercase text-white/80">
              {config.label}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">{items.length} items</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-solar-yellow tabular-nums">
            ₹{stageTotal.toLocaleString('en-IN')}
          </span>
          {isOpen
            ? <ChevronUp size={18} className="text-white/40" />
            : <ChevronDown size={18} className="text-white/40" />
          }
        </div>
      </button>

      {/* Accordion Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_80px_80px_120px_120px_40px] gap-3 text-[10px] font-black uppercase tracking-widest text-white/30 px-1">
                <span>Item Description</span>
                <span className="text-center">Qty</span>
                <span className="text-center">Unit</span>
                <span className="text-right">Rate (₹)</span>
                <span className="text-right">Amount (₹)</span>
                <span></span>
              </div>

              {/* Item Rows */}
              {items.map((lineItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_80px_80px_120px_120px_40px] gap-3 items-center group"
                >
                  <input
                    type="text"
                    value={lineItem.item}
                    onChange={(e) => updateItem(index, 'item', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-solar-yellow/50 transition-colors"
                    placeholder="Item name..."
                  />
                  <input
                    type="number"
                    value={lineItem.qty || ''}
                    onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center outline-none focus:border-solar-yellow/50 transition-colors tabular-nums"
                    placeholder="0"
                    min="0"
                  />
                  <input
                    type="text"
                    value={lineItem.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center outline-none focus:border-solar-yellow/50 transition-colors"
                    placeholder="Unit"
                  />
                  <input
                    type="number"
                    value={lineItem.rate || ''}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right outline-none focus:border-solar-yellow/50 transition-colors tabular-nums"
                    placeholder="₹0"
                    min="0"
                  />
                  <div className="bg-solar-yellow/5 border border-solar-yellow/10 rounded-lg px-3 py-2 text-sm text-solar-yellow text-right font-bold tabular-nums">
                    ₹{(lineItem.amount || 0).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Item Button */}
              <button
                onClick={addItem}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-solar-yellow transition-colors px-1 py-2"
              >
                <Plus size={14} />
                <span className="font-bold uppercase tracking-widest">Add Item</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// ─── Main CostEstimationTemplate Component ──────────────────────────────
const CostEstimationTemplate = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [projectName, setProjectName] = useState('');
  const [systemCapacity, setSystemCapacity] = useState('');
  const [plantType, setPlantType] = useState('Grid-connected Rooftop');
  const [contingencyPercent, setContingencyPercent] = useState(3);
  const [gstPercent, setGstPercent] = useState(18);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Stage items state — initialized from defaults
  const [stageData, setStageData] = useState(() => {
    const initial = {};
    STAGE_KEYS.forEach((key) => {
      initial[key] = STAGE_DEFAULTS[key].items.map((i) => ({ ...i }));
    });
    return initial;
  });

  // Accordion open state — first stage open by default
  const [openStages, setOpenStages] = useState({ stageDesign: true });

  const toggleStage = (key) => {
    setOpenStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemsChange = (stageKey, items) => {
    setStageData((prev) => ({ ...prev, [stageKey]: items }));
  };

  // ─── Calculations ───
  const stageTotals = useMemo(() => {
    const totals = {};
    STAGE_KEYS.forEach((key) => {
      totals[key] = (stageData[key] || []).reduce((sum, item) => sum + (item.amount || 0), 0);
    });
    return totals;
  }, [stageData]);

  const subtotal = useMemo(() => Object.values(stageTotals).reduce((a, b) => a + b, 0), [stageTotals]);
  const contingencyAmount = useMemo(() => (subtotal * contingencyPercent) / 100, [subtotal, contingencyPercent]);
  const gstAmount = useMemo(() => ((subtotal + contingencyAmount) * gstPercent) / 100, [subtotal, contingencyAmount, gstPercent]);
  const totalProjectCost = useMemo(() => subtotal + contingencyAmount + gstAmount, [subtotal, contingencyAmount, gstAmount]);

  // ─── Save Handler ───
  const handleSave = async (finalize = false) => {
    if (!projectName.trim()) {
      addToast('Please enter a project name', 'error');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        projectName,
        systemCapacity: parseFloat(systemCapacity) || 0,
        plantType,
        contingencyPercent,
        gstPercent,
        contingencyAmount,
        gstAmount,
        subtotal,
        totalProjectCost,
        notes,
        ...stageData,
      };
      const created = await createCostEstimation(payload);
      addToast(`Estimation ${created.estimationNumber} saved!`, 'success');
      navigate('/cost-estimation');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save estimation', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Summary category mapping ───
  const summaryCategories = [
    { label: 'Design & Pre-Installation', key: 'stageDesign' },
    { label: 'Mounting Structure', key: 'stageMounting' },
    { label: 'Solar Modules', key: 'stagePanels' },
    { label: 'DC Electrical System', key: 'stageDcElectrical' },
    { label: 'Inverter & AC System', key: 'stageInverter' },
    { label: 'Grid Connection', key: 'stageGridConnection' },
    { label: 'Earthing & Safety', key: 'stageEarthing' },
    { label: 'Monitoring System', key: 'stageMonitoring' },
    { label: 'Labour & Commissioning', key: 'stageLabour' },
  ];

  return (
    <div className="relative p-6 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cost-estimation')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                Cost <span className="text-solar-yellow italic">Estimation</span>
              </h1>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                Solar Installation BOQ — Stage-wise Breakdown
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <Save size={16} /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-solar-yellow text-deep-navy text-sm font-bold hover:bg-solar-gold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              <CheckCircle size={16} /> Save & Finalize
            </button>
          </div>
        </div>

        {/* ─── Project Details ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-solar-yellow/50 transition-colors"
              placeholder="e.g. 10kW Rooftop Solar — Mr. Sharma"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">System Capacity (kW)</label>
            <input
              type="number"
              value={systemCapacity}
              onChange={(e) => setSystemCapacity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-solar-yellow/50 transition-colors tabular-nums"
              placeholder="e.g. 10"
              min="0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Plant Type</label>
            <select
              value={plantType}
              onChange={(e) => setPlantType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-solar-yellow/50 transition-colors appearance-none"
            >
              <option value="Grid-connected Rooftop" className="bg-deep-navy">Grid-connected Rooftop</option>
              <option value="Grid-connected Ground" className="bg-deep-navy">Grid-connected Ground</option>
              <option value="Off-Grid" className="bg-deep-navy">Off-Grid</option>
              <option value="Hybrid" className="bg-deep-navy">Hybrid</option>
            </select>
          </div>
        </div>

        {/* ─── Stage Accordions ─── */}
        <div className="space-y-3 mb-8">
          {STAGE_KEYS.map((key) => (
            <StageAccordion
              key={key}
              stageKey={key}
              config={STAGE_DEFAULTS[key]}
              items={stageData[key]}
              onItemsChange={handleItemsChange}
              isOpen={!!openStages[key]}
              onToggle={() => toggleStage(key)}
              stageTotal={stageTotals[key]}
            />
          ))}
        </div>

        {/* ─── Cost Summary Card ─── */}
        <div className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.03]">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <Calculator size={18} className="text-solar-yellow" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60">
                Final Cost Summary
              </h2>
            </div>
          </div>
          <div className="p-6">
            {/* Stage-wise breakdown table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                  <th className="text-left pb-3">Category</th>
                  <th className="text-right pb-3">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {summaryCategories.map(({ label, key }) => (
                  <tr key={key} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-white/70">{label}</td>
                    <td className="py-3 text-right text-white font-bold tabular-nums">
                      ₹{stageTotals[key].toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotal, Contingency, GST */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Subtotal</span>
                <span className="text-lg font-bold text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60">Contingency</span>
                  <input
                    type="number"
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-center text-white outline-none focus:border-solar-yellow/50 tabular-nums"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-white/30">%</span>
                </div>
                <span className="font-bold text-white/80 tabular-nums">₹{contingencyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60">GST</span>
                  <input
                    type="number"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-center text-white outline-none focus:border-solar-yellow/50 tabular-nums"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-white/30">%</span>
                </div>
                <span className="font-bold text-white/80 tabular-nums">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="mt-4 flex justify-between items-center p-4 rounded-xl bg-solar-yellow/10 border border-solar-yellow/20">
              <span className="text-sm font-black uppercase tracking-widest text-solar-yellow">Total Project Cost</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-solar-yellow to-solar-gold tabular-nums">
                ₹{totalProjectCost.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Notes / Remarks</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-solar-yellow/50 transition-colors resize-none"
                placeholder="Any additional notes about this estimation..."
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CostEstimationTemplate;
