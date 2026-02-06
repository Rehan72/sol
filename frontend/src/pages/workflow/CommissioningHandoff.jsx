import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Calendar,
  AlertCircle,
  Hammer,
  ClipboardList
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import DateTimePicker from '../../components/ui/DateTimePicker';

// Mock Data for Commissioning Handoff
const HANDOFF_DATA = {
    plantName: 'Sector 45 Residence',
    installationTerm: 'Installation Team Alpha',
    startDate: '2023-10-18',
    completionDate: '2023-10-25',
    panelsInstalled: 92,
    inverterInstalled: true,
    checklist: [
        { label: 'Mounting completed', status: true },
        { label: 'Wiring completed', status: true },
        { label: 'Inverter tested', status: true },
        { label: 'Safety checks passed', status: true }
    ]
};

function CommissioningHandoff() {
  const navigate = useNavigate();
  const [commissioningDate, setCommissioningDate] = useState('');
  const [notes, setNotes] = useState('');
  const [gridSync, setGridSync] = useState(false);

  const handleStartCommissioning = () => {
    // Logic to start commissioning
    console.log('Starting Commissioning...');
    navigate('/dashboard'); // Or commissioning dashboard
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
      {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 py-8 mx-auto max-w-7xl">
         
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="w-12 h-12 rounded-full glass flex items-center justify-center p-0 hover:bg-white/10 group">
                    <ArrowLeft className="w-6 h-6 text-solar-yellow group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div>
                    <span className="text-solar-yellow font-black tracking-widest uppercase text-xs block mb-1">
                        Workflow Stage: Final Handoff
                    </span>
                    <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                        Installation <span className="text-white/40 mx-2">→</span> Commissioning
                    </h1>
                </div>
            </div>
            
             <div className="flex items-center gap-4">
                 <div className="glass px-4 py-2 rounded-lg flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10">
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                     <span className="font-bold uppercase tracking-wide text-sm text-emerald-400">Installation Verified</span>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Installation Summary & Checklist (differentiated from Survey Report) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Section 1: Installation Summary */}
                <div className="glass rounded-2xl p-6 relative overflow-hidden border-t-4 border-t-solar-yellow">
                    <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 mb-6">
                        <Hammer className="w-5 h-5 text-solar-yellow" /> Installation Summary
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60 text-sm">Team Name</span>
                                <span className="font-bold">{HANDOFF_DATA.installationTerm}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60 text-sm">Start Date</span>
                                <span className="font-bold">{HANDOFF_DATA.startDate}</span>
                            </div>
                             <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60 text-sm">Completion Date</span>
                                <span className="font-bold">{HANDOFF_DATA.completionDate}</span>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60 text-sm">Panels Installed</span>
                                <span className="font-black text-2xl text-white">{HANDOFF_DATA.panelsInstalled}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60 text-sm">Inverter Status</span>
                                <span className="font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Installed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Technical Checklist */}
                <div className="glass rounded-2xl p-6">
                     <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 mb-6">
                        <ClipboardList className="w-5 h-5 text-solar-yellow" /> QA Checklist
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {HANDOFF_DATA.checklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-white/80">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right: Commissioning Action Panel */}
            <div className="space-y-6">
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)] border border-solar-yellow/20 relative overflow-hidden top-0 sticky"
                 >
                     <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-solar-yellow to-orange-500" />
                     <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-white">
                        Start Commissioning
                     </h3>
                     <p className="text-xs text-white/50 mb-6">Initiate final testing and grid sync.</p>

                     <div className="space-y-6 relative z-10">
                         
                         <div>
                             <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Commissioning Date</label>
                             <div className="relative">
                                 <DateTimePicker 
                                    mode="single"
                                    placeholder="Select Date"
                                    value={commissioningDate ? new Date(commissioningDate) : null}
                                    onChange={(date) => {
                                        const val = date ? date.toISOString().split('T')[0] : '';
                                        setCommissioningDate(val);
                                    }}
                                 />
                             </div>
                         </div>

                          <div>
                             <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border border-white/10">
                                 <input 
                                    type="checkbox" 
                                    checked={gridSync}
                                    onChange={(e) => setGridSync(e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-solar-yellow focus:ring-solar-yellow/50"
                                 />
                                 <span className="text-sm font-bold">Grid Synchronization Required</span>
                             </label>
                         </div>

                         <div>
                             <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Commissioning Notes</label>
                             <textarea 
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-solar-yellow/50 focus:outline-none h-24 resize-none placeholder:text-white/20"
                                placeholder="Instructions for commissioning engineer..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                             />
                         </div>

                         <Button 
                            className="w-full py-6 font-black uppercase tracking-wider bg-solar-yellow hover:bg-gold text-deep-navy shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            onClick={handleStartCommissioning}
                            disabled={!commissioningDate}
                         >
                             <Zap className="w-5 h-5 mr-3" /> Start Commissioning
                         </Button>
                     </div>
                 </motion.div>
                 
                 <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                     <div className="text-xs text-orange-200/80">
                         <span className="font-bold text-orange-400 block mb-1">Critical Action</span>
                         Starting commissioning will lock all installation logs. Ensure all QA checks are verified.
                     </div>
                 </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default CommissioningHandoff;
