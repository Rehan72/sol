import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Map, 
  Users, 
  AlertCircle,
  Calendar,
  ChevronRight,
  FileText,
  Camera,
  Upload,
  Zap,
  Hammer,
  Lock,
  PlayCircle,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import SurveyReport from '../../components/reports/SurveyReport'; // Importing SurveyReport

// --- Constants & Mock Data ---

const PHASES = [
  { id: 'survey', label: 'Survey', status: 'completed', date: '12 Feb', description: 'Feasibility & Planning' },
  { id: 'installation', label: 'Installation', status: 'in_progress', date: 'Day 3/10', description: 'Execution Phase' },
  { id: 'commissioning', label: 'Commissioning', status: 'locked', date: 'Pending', description: 'Testing & Handoff' },
  { id: 'live', label: 'Live', status: 'pending', date: '-', description: 'Monitoring' }
];

const INSTALLATION_STEPS = [
  { id: 'mounting', label: 'Mounting', status: 'completed', date: '2023-10-18', completedBy: 'Installation Team Alpha' },
  { id: 'inverter', label: 'Inverter', status: 'in_progress', date: null, completedBy: null },
  { id: 'wiring', label: 'Wiring', status: 'pending', date: null, completedBy: null },
  { id: 'inspection', label: 'QC Inspection', status: 'pending', date: null, completedBy: null },
];

const INSTALLATION_DATA = {
    plantName: 'Sector 45 Residence',
    capacity: '5 MW',
    status: 'ACTIVE',
    startDate: '2023-10-15',
    assignedTeam: {
        name: 'Installation Team Alpha',
        lead: 'John Doe',
        contact: '+91 98765 43210'
    }
};

// --- Components ---

const TimelineNode = ({ phase, isLast }) => {
    const isActive = phase.status === 'in_progress';
    const isCompleted = phase.status === 'completed';
    const isLocked = phase.status === 'locked' || phase.status === 'pending';

    return (
        <div className="flex items-start flex-1 last:flex-none">
            <div className="relative flex flex-col items-center group cursor-default">
                <div className={`
                    w-4 h-4 rounded-full border-2 z-10 transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                      isActive ? 'bg-solar-yellow border-solar-yellow shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-125' : 
                      'bg-deep-navy border-white/20'}
                `}>
                   {isCompleted && <CheckCircle2 className="w-3 h-3 text-deep-navy absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <div className="mt-2 w-max text-center">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-solar-yellow' : isCompleted ? 'text-emerald-400' : 'text-white/30'}`}>
                        {phase.label}
                    </p>
                    <p className="text-[9px] text-white/40">{phase.date}</p>
                </div>
            </div>
            {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mt-[7px] relative">
                    <div className="absolute inset-0 bg-white/10" />
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        className="absolute inset-0 bg-emerald-500/50"
                    />
                </div>
            )}
        </div>
    );
};

function InstallationWorkflow() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState('installation');
  const [activeStepId, setActiveStepId] = useState('inverter');
  const [steps, setSteps] = useState(INSTALLATION_STEPS);

  const currentStep = steps.find(s => s.id === activeStepId);

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* --- Sticky Header / Timeline --- */}
      <div className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl bg-deep-navy/80">
          <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Page Title / Plant Info */}
                  <div>
                      <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                          <Button variant="ghost" className="h-4 p-0 hover:bg-transparent text-white/50 hover:text-white" onClick={() => navigate(-1)}>
                              <ArrowLeft className="w-3 h-3 mr-1" /> Back
                          </Button>
                          <span>/</span>
                          <span>{INSTALLATION_DATA.plantName}</span>
                      </div>
                      <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                          Execution <span className="text-solar-yellow">&</span> Progress
                      </h1>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 max-w-2xl px-4 md:px-12 flex items-start justify-between">
                      {PHASES.map((phase, index) => (
                          <TimelineNode key={phase.id} phase={phase} isLast={index === PHASES.length - 1} />
                      ))}
                  </div>
                  
                  {/* Audit Link */}
                  <Button 
                    variant="ghost" 
                    className="text-white/40 hover:text-white text-xs uppercase tracking-wider hidden lg:flex items-center gap-2"
                    onClick={() => navigate('/audit-trail')}
                  >
                      <Clock className="w-4 h-4" /> View History
                  </Button>
              </div>
          </div>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              
              {/* --- LEFT: Phase Navigation --- */}
              <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 px-2">Phases</h3>
                  
                  {/* Survey Phase Card */}
                  <div 
                      onClick={() => setActivePhase('survey')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                          activePhase === 'survey' 
                          ? 'bg-white/10 border-solar-yellow/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                  >
                      <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${activePhase === 'survey' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-emerald-400'}`}>
                              <Map className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                              Completed
                          </span>
                      </div>
                      <h4 className="font-bold text-lg">Survey</h4>
                      <p className="text-xs text-white/50 mt-1">Feasibility & Planning</p>
                      {activePhase === 'survey' && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                              <Button variant="ghost" size="sm" className="w-full justify-between text-white/60 hover:text-white p-0">
                                  View Report <ChevronRight className="w-4 h-4" />
                              </Button>
                          </div>
                      )}
                  </div>

                  {/* Installation Phase Card */}
                   <div 
                      onClick={() => setActivePhase('installation')}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                          activePhase === 'installation' 
                          ? 'bg-white/10 border-solar-yellow/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                  >
                      <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${activePhase === 'installation' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-solar-yellow'}`}>
                              <Hammer className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-solar-yellow/20 text-solar-yellow px-2 py-1 rounded-full border border-solar-yellow/30 animate-pulse">
                              In Progress
                          </span>
                      </div>
                      <h4 className="font-bold text-lg">Installation</h4>
                      <p className="text-xs text-white/50 mt-1">Execution Phase</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                          <Users className="w-3 h-3" /> {INSTALLATION_DATA.assignedTeam.name}
                      </div>
                  </div>

                  {/* Commissioning Phase Card */}
                   <div 
                      onClick={() => INSTALLATION_STEPS.some(s => s.status !== 'completed') ? null : setActivePhase('commissioning')} // Only allow if unlocked logic, or user click override for demo
                      className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                         activePhase === 'commissioning'
                         ? 'bg-white/10 border-solar-yellow'
                         : 'bg-white/5 border-white/5 opacity-80'
                      }`}
                  > 
                      {/* Lock Overlay if Installation not done (mocked as always locked for now unless clicked) */}
                       {/* For demo, we allow clicking, but visually it looks lockedish */}
                      <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${activePhase === 'commissioning' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-white/40'}`}>
                              <Zap className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/40 px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                          </span>
                      </div>
                      <h4 className="font-bold text-lg text-white/60">Commissioning</h4>
                      <p className="text-xs text-white/40 mt-1">Awaiting Installation</p>
                  </div>

              </div>

              {/* --- RIGHT: Active Phase Detail --- */}
              <div className="lg:col-span-2 flex flex-col h-full">
                  
                  {/* --- SURVEY VIEW --- */}
                  {activePhase === 'survey' && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                          <div className="glass rounded-3xl p-8 border-t-4 border-t-emerald-500">
                              <div className="flex justify-between items-start mb-6">
                                  <div>
                                       <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Survey Phase</h2>
                                       <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Completed on 12 Feb 2026</p>
                                  </div>
                                  <Button onClick={() => navigate('/handoff/review')} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                      <FileText className="w-4 h-4 mr-2" /> Full Report
                                  </Button>
                              </div>
                              <p className="text-white/60 mb-6">
                                  Site feasibility confirmed. Shadow analysis passed. Roof structure validated for 5MW capacity.
                              </p>
                              {/* Summary Grid */}
                              <div className="grid grid-cols-3 gap-4">
                                  {['Suitability: High', 'Shading: <5%', 'Structure: Concrete'].map((item, i) => (
                                      <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                                          <span className="text-xs font-bold uppercase text-white/80">{item}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          
                          {/* Embedded Report Preview (Mock) */}
                           <div className="opacity-50 hover:opacity-100 transition-opacity">
                                <SurveyReport /> 
                           </div>
                      </div>
                  )}

                  {/* --- INSTALLATION VIEW --- */}
                  {activePhase === 'installation' && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                          
                          {/* Header Card */}
                          <div className="glass rounded-2xl p-6 border-l-4 border-l-solar-yellow flex flex-col md:flex-row justify-between items-center gap-6">
                              <div>
                                  <h2 className="text-xl font-black uppercase tracking-wide">Installation Phase</h2>
                                  <p className="text-solar-yellow font-bold uppercase text-xs tracking-widest mt-1">Status: In Progress</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                  <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4" /> {INSTALLATION_DATA.assignedTeam.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" /> Started: {INSTALLATION_DATA.startDate}
                                  </div>
                              </div>
                          </div>

                          {/* Horizontal Stepper */}
                          <div className="glass rounded-2xl p-6 overflow-x-auto">
                              <div className="flex items-center justify-between min-w-[600px]">
                                  {steps.map((step, index) => (
                                      <div 
                                          key={step.id} 
                                          className="flex-1 flex flex-col items-center relative group cursor-pointer"
                                          onClick={() => setActiveStepId(step.id)}
                                      >   
                                          {/* Line */}
                                          {index !== 0 && (
                                              <div className={`absolute top-5 right-[50%] w-full h-[2px] -translate-y-1/2 -z-10 ${
                                                  step.status === 'completed' || step.status === 'in_progress' ? 'bg-solar-yellow' : 'bg-white/10'
                                              }`} />
                                          )}
                                          
                                          {/* Icon */}
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all mb-3 ${
                                              activeStepId === step.id ? 'scale-110 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : ''
                                          } ${
                                              step.status === 'completed' ? 'bg-solar-yellow border-solar-yellow text-deep-navy' :
                                              step.status === 'in_progress' ? 'bg-deep-navy border-solar-yellow text-solar-yellow' :
                                              'bg-deep-navy border-white/20 text-white/20'
                                          }`}>
                                              {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                               step.status === 'in_progress' ? <Zap className="w-5 h-5" /> :
                                               <Circle className="w-5 h-5" />}
                                          </div>
                                          
                                          {/* Label */}
                                          <span className={`text-xs font-bold uppercase tracking-wider text-center ${
                                              activeStepId === step.id ? 'text-white' : 'text-white/40'
                                          }`}>
                                              {step.label}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Active Step Detail */}
                          <AnimatePresence mode='wait'>
                              <motion.div
                                  key={activeStepId}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="glass rounded-3xl p-8 flex-1"
                              >
                                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                                      <div>
                                          <h3 className="text-2xl font-black uppercase">{currentStep?.label}</h3>
                                          <p className="text-white/40 text-sm">Step 0{steps.findIndex(s => s.id === activeStepId) + 1} of {steps.length}</p>
                                      </div>
                                      <div className={`px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs border ${
                                          currentStep?.status === 'in_progress' ? 'border-solar-yellow text-solar-yellow bg-solar-yellow/5' :
                                          currentStep?.status === 'completed' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' :
                                          'border-white/10 text-white/30'
                                      }`}>
                                          {currentStep?.status.replace('_', ' ')}
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      {/* Assigned Tasks / Info */}
                                      <div className="space-y-6">
                                          <div>
                                              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Assigned To</h4>
                                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold">R</div>
                                                  <div>
                                                      <p className="text-sm font-bold">Ravi Kumar</p>
                                                      <p className="text-xs text-white/40">Electrician</p>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <div>
                                              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Tasks</h4>
                                              <ul className="space-y-2">
                                                  {['Verify layout', 'Secure mounting rails', 'Torque check'].map((task, i) => (
                                                      <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center">
                                                              {currentStep?.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-solar-yellow" />}
                                                          </div>
                                                          {task}
                                                      </li>
                                                  ))}
                                              </ul>
                                          </div>
                                      </div>

                                      {/* inputs / photos */}
                                      <div className="space-y-6">
                                           <div>
                                              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Photos</h4>
                                              <div className="grid grid-cols-3 gap-2">
                                                  <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/10 cursor-pointer">
                                                      <PlusIcon />
                                                  </div>
                                              </div>
                                           </div>
                                           <div>
                                              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Notes</h4>
                                              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm min-h-[80px]" placeholder="Add remarks..." />
                                           </div>
                                      </div>
                                  </div>

                                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                      {currentStep?.status !== 'completed' && (
                                          <Button className="bg-solar-yellow text-deep-navy hover:bg-gold font-bold">
                                              Mark as Completed
                                          </Button>
                                      )}
                                  </div>
                              </motion.div>
                          </AnimatePresence>
                      </div>
                  )}

                  {/* --- COMMISSIONING VIEW --- */}
                  {activePhase === 'commissioning' && (
                      <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center h-[500px] border-2 border-dashed border-white/10 animate-in zoom-in-95 duration-500">
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                              <Lock className="w-8 h-8 text-white/20" />
                          </div>
                          <h2 className="text-2xl font-black uppercase text-white/40 mb-2">Phase Locked</h2>
                          <p className="text-white/30 max-w-sm mx-auto mb-8">
                              Complete the installation phase and submit the handoff report to unlock Commissioning.
                          </p>
                          <Button 
                              variant="outline" 
                              className="border-white/10 text-white/40 hover:text-white"
                              onClick={() => {
                                  // Demo override
                                  navigate('/commissioning/handoff');
                              }}
                          >
                              Go to Handoff (Demo Override)
                          </Button>
                      </div>
                  )}

              </div>
          </div>
      </div>
    </div>
  );
}

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

export default InstallationWorkflow;
