import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Map, 
  ShieldCheck, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Rocket
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import SurveyReport from '../../components/reports/SurveyReport';
import Select from '../../components/ui/Select';
import DateTimePicker from '../../components/ui/DateTimePicker';

// Mock Data for Handoff
const HANDOFF_DATA = {
    surveyTeam: 'Survey Team A',
    surveyDate: '12 Feb 2026',
    status: 'Ready for Review',
    plantName: 'Sector 45 Residence'
};

const INSTALLATION_TEAMS = [
    { value: 'team_alpha', label: 'Installation Team Alpha' },
    { value: 'team_beta', label: 'Solar Installers Beta' },
    { value: 'team_gamma', label: 'Gamma Rays Crew' }
];

function HandoffReview() {
  const navigate = useNavigate();
  const [assignForm, setAssignForm] = useState({
      teamId: '',
      startDate: '',
      notes: ''
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAssign = () => {
      // Logic to assign team and trigger installation
      console.log('Assigning Installation Team:', assignForm);
      // Navigate to Workflow or Success page
      navigate('/installation-workflow');
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
                        Workflow Stage: Handoff
                    </span>
                    <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                        Survey <span className="text-white/40 mx-2">→</span> Installation
                    </h1>
                </div>
            </div>
            
             <div className="flex items-center gap-4">
                 <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="font-bold uppercase tracking-wide text-sm">Survey Submitted</span>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Survey Report (Read-only) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
                        <FileText className="w-5 h-5 text-solar-yellow" /> Implementation Report
                     </h2>
                     <Button variant="ghost" size="sm" className="text-solar-yellow hover:text-white">
                        Download PDF
                     </Button>
                </div>
                
                <SurveyReport /> 
            </div>

            {/* Right: Plant Admin Controls */}
            <div className="space-y-6">
                 {/* Summary Card */}
                 <div className="glass rounded-2xl p-6 border-t-4 border-t-emerald-400">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Feasibility Check
                     </h3>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center py-2 border-b border-white/5">
                             <span className="text-white/60 text-sm">Feasibility Status</span>
                             <span className="font-black text-emerald-400 uppercase">Approved</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-white/5">
                             <span className="text-white/60 text-sm">Survey Team</span>
                             <span className="font-bold">{HANDOFF_DATA.surveyTeam}</span>
                         </div>
                         <div className="flex justify-between items-center py-2">
                             <span className="text-white/60 text-sm">Completion Date</span>
                             <span className="font-bold">{HANDOFF_DATA.surveyDate}</span>
                         </div>
                     </div>
                 </div>

                 {/* Assignment Form */}
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)] border border-solar-yellow/20 relative overflow-hidden"
                 >
                     <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-solar-yellow to-orange-500" />
                     <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-white">
                        Assign Installation
                     </h3>
                     <p className="text-xs text-white/50 mb-6">Select team to execute this project.</p>

                     <div className="space-y-6 relative z-10">
                         <Select 
                            label="Installation Team"
                            options={INSTALLATION_TEAMS}
                            value={assignForm.teamId}
                            onChange={(e) => setAssignForm({...assignForm, teamId: e.target.value})}
                            icon={ShieldCheck}
                            placeholder="Select Team..."
                         />
                         
                         <div>
                             <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Target Start Date</label>
                             <div className="relative">
                                 <DateTimePicker 
                                    mode="single"
                                    placeholder="Select Date"
                                    value={assignForm.startDate ? new Date(assignForm.startDate) : null}
                                    onChange={(date) => {
                                        const val = date ? date.toISOString().split('T')[0] : '';
                                        setAssignForm({...assignForm, startDate: val});
                                    }}
                                 />
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Admin Instructions</label>
                             <textarea 
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-solar-yellow/50 focus:outline-none h-24 resize-none placeholder:text-white/20"
                                placeholder="Special notes for the installation crew..."
                                value={assignForm.notes}
                                onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})}
                             />
                         </div>

                         <Button 
                            className="w-full py-6 font-black uppercase tracking-wider bg-solar-yellow text-deep-navy hover:bg-gold shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                            onClick={handleAssign}
                            disabled={!assignForm.teamId || !assignForm.startDate}
                         >
                             <Rocket className="w-5 h-5 mr-3" /> Assign & Start
                         </Button>
                     </div>
                 </motion.div>
                 
                 <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                     <div className="text-xs text-orange-200/80">
                         <span className="font-bold text-orange-400 block mb-1">Process Note</span>
                         Assigning a team will lock the survey report permanently and notify the Installation Lead immediately.
                     </div>
                 </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default HandoffReview;
