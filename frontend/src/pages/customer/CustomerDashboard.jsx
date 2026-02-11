import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  MapPin,
  Sun,
  Activity,
  LogOut,
  Calendar,
  FileText,
  ArrowRight,
  Wallet,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getCustomerProfile } from '../../api/customer';
import { useAuthStore } from '../../store/authStore';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { setOnboardingStatus } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState({
    id: 'Loading...',
    type: 'Solar Installation',
    location: 'TBD',
    property: 'Residential',
    status: 'Loading...',
    progress: [],
    quotation: null
  });
  console.log(request, 'request');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCustomerProfile();
        setProfile(data);

        // Update auth store with onboarding status
        setOnboardingStatus(data.isOnboarded || false);

        console.log(data, 'data');

        // Map backend state to UI
        if (data) {
          const progressSteps = [
            { id: 1, title: 'Request Submitted', completed: true },
            {
              id: 2,
              title: 'Survey Assigned',
              completed: ['ASSIGNED', 'COMPLETED', 'APPROVED'].includes(data.surveyStatus) || !!data.quotation || ['INSTALLATION_READY', 'INSTALLATION_SCHEDULED', 'INSTALLATION_STARTED', 'INSTALLATION_COMPLETED', 'QC_PENDING', 'QC_APPROVED', 'QC_REJECTED', 'COMMISSIONING', 'COMPLETED'].includes(data.installationStatus),
              current: data.surveyStatus === 'PENDING' && data.installationStatus === 'ONBOARDED'
            },
            {
              id: 3, title: 'Site Survey',
              completed: ['COMPLETED', 'APPROVED'].includes(data.surveyStatus) || !!data.quotation || ['INSTALLATION_READY', 'INSTALLATION_SCHEDULED', 'INSTALLATION_STARTED', 'INSTALLATION_COMPLETED', 'QC_PENDING', 'QC_APPROVED', 'QC_REJECTED', 'COMMISSIONING', 'COMPLETED'].includes(data.installationStatus),
              current: data.surveyStatus === 'ASSIGNED'
            },
            {
              id: 4, title: 'Quotation Ready',
              completed: !!data.quotation || ['INSTALLATION_READY', 'INSTALLATION_SCHEDULED', 'INSTALLATION_STARTED', 'INSTALLATION_COMPLETED', 'QC_PENDING', 'QC_APPROVED', 'QC_REJECTED', 'COMMISSIONING', 'COMPLETED'].includes(data.installationStatus),
              current: (data.surveyStatus === 'COMPLETED' || data.surveyStatus === 'APPROVED') && !data.quotation
            },
            {
              id: 5, title: 'Installation',
              completed: ['INSTALLATION_COMPLETED', 'QC_PENDING', 'QC_APPROVED', 'COMMISSIONING', 'COMPLETED'].includes(data.installationStatus),
              current: !!data.quotation && ['INSTALLATION_READY', 'INSTALLATION_SCHEDULED', 'INSTALLATION_STARTED', 'QC_REJECTED'].includes(data.installationStatus)
            },
            {
              id: 6, title: 'Commissioning',
              completed: ['COMMISSIONING', 'COMPLETED'].includes(data.installationStatus),
              current: data.installationStatus === 'QC_APPROVED'
            },
            {
              id: 7, title: 'Solar Activated',
              completed: data.installationStatus === 'COMPLETED',
              current: false // Final step, once completed it's no longer "processing"
            }
          ];

          setRequest({
            id: `SOL-${data.id?.split('-')[0].toUpperCase() || 'NEW'}`,
            type: `${data.solarType || 'Home'} Solar Installation`,
            location: `${data.city || 'TBD'}, ${data.state || 'TBD'}`,
            property: data.propertyType || 'Residential',
            status: data.installationStatus === 'ONBOARDED' ? (data.surveyStatus === 'ASSIGNED' ? 'Survey Assigned' : 'Onboarded') : 
                    data.installationStatus === 'COMPLETED' ? 'Live' : 
                    data.installationStatus === 'INSTALLATION_COMPLETED' ? 'Installation Done' : 
                    data.installationStatus,
            progress: progressSteps,
            quotation: data.quotation || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const isActivated = profile?.installationStatus === 'COMPLETED';
  const hasQuotation = !!request.quotation;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Sun className="w-12 h-12 text-solar-yellow" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col selection:bg-solar-yellow/30">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <main className="relative z-10 w-full px-6 md:px-12 py-8 mx-auto space-y-12 max-w-7xl">
        {/* HUD HEADER */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-8 mb-4 border-b border-white/5 pb-8">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-solar-yellow rounded-full" />
              <span className="text-solar-yellow text-[10px] font-black uppercase tracking-[0.4em]">
                Installation Tracker
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Control <span className="text-solar-yellow italic">Center</span>
            </h1>
          </motion.div>

          <div className={`glass px-6 py-3 h-auto rounded-xl text-[10px] font-black tracking-[0.3em] uppercase border ${hasQuotation
            ? 'border-solar-yellow/20 text-emerald-400'
            : 'border-white/10 text-white/40'
            }`}>
            <span className="text-white/40 mr-2">SYSTEM STATUS:</span>
            <span>{isActivated ? 'SYSTEM LIVE' : (hasQuotation ? 'QUOTATION READY' : (profile?.installationStatus || 'PENDING'))}</span>
          </div>
        </section>

        {/* METRIC HUD GRID - Only visible when procedure is complete */}
        <AnimatePresence>
          {isActivated && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden"
            >
              {[
                { label: 'System Capacity', value: `${(profile?.roofArea / 100 || 5.2).toFixed(1)} kW`, sub: 'Target Design', icon: Zap, color: 'from-solar-yellow/20' },
                { label: 'Annual Savings', value: `₹${(profile?.roofArea ? (profile.roofArea * 80).toLocaleString() : '42,500')}`, sub: 'Projected ROI', icon: Wallet, color: 'from-emerald-500/20' },
                { label: 'CO2 Offset', value: `${(profile?.roofArea ? (profile.roofArea * 0.005).toFixed(1) : '2.4')} Tons`, sub: 'Carbon Credits', icon: Sun, color: 'from-blue-500/20' },
                { label: 'Time To Active', value: isActivated ? 'Activated' : 'In Progress', sub: 'System Status', icon: Clock, color: 'from-purple-500/20' },
              ].map((metric, i) => (
                <div key={metric.label} className="glass p-8 rounded-[2rem] border border-white/5 relative group overflow-hidden transition-all duration-500 hover:border-white/20">
                  <div className={`absolute inset-0 bg-linear-to-br ${metric.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <metric.icon className="w-6 h-6 text-solar-yellow opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{metric.label}</p>
                    <p className="text-3xl font-black uppercase tracking-tighter mb-2 group-hover:text-solar-yellow transition-colors duration-500">{metric.value}</p>
                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest group-hover:text-white/30 transition-colors duration-500">{metric.sub}</p>
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* INTERACTIVE PROGRESS RADAR */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2.5rem] p-10 md:p-12 border border-white/5 bg-white/5 relative overflow-hidden group/radar">
              <div className="absolute top-0 right-0 w-64 h-64 bg-solar-yellow/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all duration-700 group-hover/radar:bg-solar-yellow/10" />
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    Installation <span className="text-solar-yellow italic">Radar</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center mt-3">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-lg">ID: {request.id}</p>
                    <div className="hidden sm:block h-3 w-px bg-white/10" />
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-solar-yellow/50" /> {request.location}
                    </p>
                    <div className="hidden sm:block h-3 w-px bg-white/10" />
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">TYPE: {request.property}</p>
                  </div>
                </div>
                <div className="px-5 py-2 glass border-solar-yellow/20 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.05)]">
                  <span className="text-solar-yellow font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <Activity className="w-3 h-3 animate-pulse" /> {request.status}
                  </span>
                </div>
              </div>

              {/* Advanced Timeline */}
              <div className="relative pl-4 md:pl-8">
                <div className="absolute left-[39px] md:left-[47px] top-6 bottom-6 w-[2px] bg-white/5" />
                <div className="space-y-10 relative z-10">
                  {request.progress.map((step, idx) => (
                    <div key={step.id} className="flex gap-8 group/step relative">
                      {/* Connector Line Fill */}
                      {idx < request.progress.length - 1 && step.completed && (
                        <div className="absolute left-[7px] md:left-[15px] top-[72px] w-[2px] h-[40px] bg-emerald-500/30 z-0" />
                      )}

                      <div className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 transition-all duration-700 flex items-center justify-center shrink-0 ${step.completed ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.1)]' :
                        step.current ? 'bg-solar-yellow/5 border-solar-yellow shadow-[0_0_35px_rgba(255,215,0,0.15)] scale-110' :
                          'bg-white/5 border-white/5 opacity-20'
                        }`}>
                        {step.completed ? <CheckCircle2 className="w-8 h-8 text-emerald-400 group-hover/step:scale-110 transition-transform duration-500" /> :
                          step.current ? <Activity className="w-8 h-8 text-solar-yellow animate-pulse" /> :
                            <Sun className="w-8 h-8 text-white/40" />
                        }
                      </div>

                      <div className="flex flex-col justify-center min-w-0">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 ${step.completed ? 'text-emerald-400/40' : step.current ? 'text-solar-yellow' : 'text-white/10'
                          }`}>
                          Phase 0{idx + 1} — {step.completed ? 'SUCCESS' : step.current ? 'ACTIVE PROCESS' : 'PENDING'}
                        </span>
                        <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tighter transition-all duration-500 ${step.completed ? 'text-emerald-400/60 line-through decoration-emerald-500/30' :
                          step.current ? 'text-white' : 'text-white/10'
                          }`}>
                          {step.title}
                        </h3>
                        {step.current && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[11px] text-white/40 mt-3 max-w-lg font-bold uppercase tracking-wider leading-relaxed border-l-2 border-solar-yellow/30 pl-4 py-1"
                          >
                            {profile?.surveyStatus === 'ASSIGNED' && step.title.toLowerCase().includes('survey')
                              ? `Operational team assigned: ${profile.assignedSurveyTeam}. Initiating site analysis.`
                              : `Global operations has dispatched the ${step.title.toLowerCase().includes('survey') ? 'survey' : 'installation'} strike team.`}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-solar-yellow/30 hover:bg-white/10 transition-all duration-500 cursor-pointer group flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-solar-yellow/10 flex items-center justify-center border border-solar-yellow/20 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-6 h-6 text-solar-yellow" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-white text-lg">Request Survey</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 group-hover:text-solar-yellow/40 transition-colors">Direct Coordination</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-solar-yellow group-hover:translate-x-2 transition-all" />
              </div>

              <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-500 cursor-pointer group flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-white text-lg">Documentation</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 group-hover:text-blue-400/40 transition-colors">Legal & Technical</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-blue-400 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <AnimatePresence>
              {request.quotation && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-dark rounded-[2.5rem] p-10 border border-emerald-500/20 relative overflow-hidden group/quote">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl opacity-0 group-hover/quote:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Wallet className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Solar Quote</h3>
                        <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest">Financial Summary</p>
                      </div>
                    </div>
                    
                    {/* Current Milestone Display */}
                    {(() => {
                      const total = request.quotation.total || request.quotation.final || 0;
                      const milestones = [
                        { id: 'M1', name: 'Survey Completion', percentage: 0.25 },
                        { id: 'M2', name: 'Installation Start', percentage: 0.40 },
                        { id: 'M3', name: 'Installation Complete', percentage: 0.25 },
                        { id: 'M4', name: 'Commissioning', percentage: 0.10 }
                      ];
                      
                      // Find the first unpaid milestone (current step)
                      const paidItems = request.quotation.breakdown?.filter(item => item.status === 'PAID') || [];
                      const currentMilestoneIndex = Math.min(paidItems.length, milestones.length - 1);
                      const currentMilestone = milestones[currentMilestoneIndex];
                      const currentAmount = Math.round(total * currentMilestone.percentage);
                      
                      const totalRemaining = total - currentAmount;
                      
                      return (
                        <div className="space-y-6">
                          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 transition-all duration-500 hover:border-emerald-500/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{currentMilestone.name}</p>
                            <p className="text-white/40 text-xs mb-6 font-bold uppercase tracking-wider leading-relaxed">Required before mobilization of project resources</p>
                            <p className="text-4xl font-black text-white tracking-tighter">₹{currentAmount.toLocaleString()}</p>
                          </div>
                          
                          <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1.5 text-emerald-400/50">Total Project Liability</p>
                            <p className="text-2xl font-black text-emerald-400 tracking-tight">₹{total.toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })()}

                    <Button 
                      onClick={() => navigate('/customer/payments')}
                      className="w-full mt-8 bg-linear-to-r from-emerald-500 to-emerald-600 text-deep-navy font-black py-8 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs shadow-[0_15px_30px_rgba(16,185,129,0.2)]"
                    >
                      Authorize Payment <ArrowRight className="w-4 h-4 ml-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/insights">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-solar-yellow/10 flex items-center justify-center border border-solar-yellow/20">
                  <Activity className="w-5 h-5 text-solar-yellow" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm">System Insights</h4>
              </div>
              
              <div className="relative mb-10">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-solar-yellow/20 rounded-full" />
                <p className="text-xs text-white/40 leading-relaxed font-black uppercase tracking-widest italic">
                  "Our orbital analysis confirms peak radiance levels. Project hardware is staged and awaiting dispatch clearance."
                </p>
              </div>

              {/* New Section: Plant & Region Details */}
              <div className="border-t border-white/5 pt-10 space-y-6">
                <h4 className="font-black uppercase tracking-widest text-[10px] text-white/30 mb-4 whitespace-nowrap">Operational Command & Control</h4>

                {/* Plant Details */}
                {profile?.plantDetails && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 font-mono">PLANT_ID: ASSIGNED</p>
                    <p className="text-sm font-black uppercase tracking-tighter text-white mb-1 leading-none">{profile.plantDetails.plantName}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">{profile.plantDetails.city}, {profile.plantDetails.state}</p>

                    {/* Owner Details */}
                    <div className="pt-4 border-t border-white/5 mt-4 group/contact">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Technical Lead</p>
                      <p className="text-xs font-black uppercase tracking-tight text-white group-hover:text-solar-yellow transition-colors mb-1">{profile.plantDetails.ownerName}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{profile.plantDetails.ownerPhone}</p>
                    </div>
                  </div>
                )}

                {/* Region Admin Details */}
                {profile?.regionDetails && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 font-mono">REGIONAL_HQ: ACTIVE</p>
                    <p className="text-sm font-black uppercase tracking-tighter text-white mb-2 leading-none">{profile.regionDetails.regionName || 'Global Operations'}</p>

                    {/* Admin Details */}
                    <div className="pt-4 border-t border-white/5 mt-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Regional Director</p>
                      <p className="text-xs font-black uppercase tracking-tight text-white mb-1">{profile.regionDetails.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{profile.regionDetails.phone}</p>
                    </div>
                  </div>
                )}

                {/* Survey Team Details */}
                {profile?.surveyTeam && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 font-mono">STRIKE_TEAM: {profile.surveyTeam.code}</p>
                    <p className="text-sm font-black uppercase tracking-tighter text-white mb-3">Field Survey Unit</p>

                    {profile.surveyTeam.teamLead && (
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Team Commander</p>
                        <p className="text-xs font-black uppercase tracking-tight text-white mb-1">{profile.surveyTeam.teamLead.name}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{profile.surveyTeam.teamLead.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate('/customer/cancellation')} 
              className="w-full text-[10px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-red-500/60 transition-all py-8"
            >
              Terminate Protocol
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
