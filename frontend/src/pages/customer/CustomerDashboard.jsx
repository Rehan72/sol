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
              completed: data.surveyStatus === 'ASSIGNED' || data.surveyStatus === 'COMPLETED' || !!data.quotation || data.installationStatus === 'ACTIVATED',
              current: data.surveyStatus === 'PENDING' && data.installationStatus === 'ONBOARDED'
            },
            {
              id: 3, title: 'Site Survey',
              completed: data.surveyStatus === 'COMPLETED' || !!data.quotation || data.installationStatus === 'ACTIVATED',
              current: data.surveyStatus === 'ASSIGNED'
            },
            {
              id: 4, title: 'Quotation Ready',
              completed: !!data.quotation || data.installationStatus === 'ACTIVATED',
              current: data.surveyStatus === 'COMPLETED' && !data.quotation
            },
            {
              id: 5, title: 'Installation',
              completed: data.installationStatus === 'ACTIVATED',
              current: !!data.quotation && data.installationStatus !== 'ACTIVATED'
            },
            {
              id: 6, title: 'Solar Activated',
              completed: data.installationStatus === 'ACTIVATED',
              current: data.installationStatus === 'ACTIVATED'
            }
          ];

          setRequest({
            id: `SOL-${data.id?.split('-')[0].toUpperCase() || 'NEW'}`,
            type: `${data.solarType || 'Home'} Solar Installation`,
            location: `${data.city || 'TBD'}, ${data.state || 'TBD'}`,
            property: data.propertyType || 'Residential',
            status: data.installationStatus === 'ONBOARDED' ? (data.surveyStatus === 'ASSIGNED' ? 'Survey Assigned' : 'Onboarded') : data.installationStatus,
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

  const isActivated = profile?.installationStatus === 'ACTIVATED';
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
    <div className="relative text-white selection:bg-solar-yellow/30">
      <main className="relative z-10 w-full px-6 py-6 mx-auto space-y-12 max-w-7xl">
        {/* HUD HEADER */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 text-solar-yellow mb-2 font-black tracking-[0.4em] uppercase text-[10px]">
              <div className="h-px w-8 bg-solar-yellow" /> Installation Tracker
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Control <span className="text-solar-yellow/80">Center</span>
            </h1>
          </motion.div>

          <div className={`glass px-6 py-3 h-auto rounded-xl text-[10px] font-black tracking-[0.3em] uppercase border ${hasQuotation
            ? 'border-solar-yellow/20 text-emerald-400'
            : 'border-white/10 text-white/40'
            }`}>
            <span className="text-white/40 mr-2">SYSTEM STATUS:</span>
            <span>{hasQuotation ? 'QUOTATION READY' : (profile?.installationStatus || 'PENDING')}</span>
          </div>
        </section>

        {/* METRIC HUD GRID - Only visible when procedure is complete */}
        <AnimatePresence>
          {isActivated && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden"
            >
              {[
                { label: 'System Capacity', value: `${(profile?.roofArea / 100 || 5.2).toFixed(1)} kW`, sub: 'Target Design', icon: Zap, color: 'from-solar-yellow/20' },
                { label: 'Annual Savings', value: `₹${(profile?.roofArea ? (profile.roofArea * 80).toLocaleString() : '42,500')}`, sub: 'Projected ROI', icon: Wallet, color: 'from-emerald-500/20' },
                { label: 'CO2 Offset', value: `${(profile?.roofArea ? (profile.roofArea * 0.005).toFixed(1) : '2.4')} Tons`, sub: 'Carbon Credits', icon: Sun, color: 'from-blue-500/20' },
                { label: 'Time To Active', value: isActivated ? 'Activated' : 'In Progress', sub: 'System Status', icon: Clock, color: 'from-purple-500/20' },
              ].map((metric, i) => (
                <div key={metric.label} className="glass p-6 rounded-3xl border border-white/10 relative group overflow-hidden">
                  <div className={`absolute inset-0 bg-linear-to-br ${metric.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <metric.icon className="w-5 h-5 text-white/40 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{metric.label}</p>
                    <p className="text-3xl font-black uppercase tracking-tighter mb-1">{metric.value}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{metric.sub}</p>
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* INTERACTIVE PROGRESS RADAR */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-10 border border-white/10 bg-black/40 relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    Installation <span className="text-solar-yellow">Radar</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center mt-2">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">ID: {request.id}</p>
                    <div className="hidden sm:block h-3 w-px bg-white/10" />
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-solar-yellow/50" /> {request.location}
                    </p>
                    <div className="hidden sm:block h-3 w-px bg-white/10" />
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">TYPE: {request.property}</p>
                  </div>
                </div>
                <div className="px-5 py-2 glass border-solar-yellow/20 rounded-xl">
                  <span className="text-solar-yellow font-black uppercase tracking-widest text-[10px]">
                    STATUS: {request.status}
                  </span>
                </div>
              </div>

              {/* Advanced Timeline */}
              <div className="relative">
                <div className="absolute left-[39px] top-0 bottom-0 w-px bg-white/5" />
                <div className="space-y-12">
                  {request.progress.map((step, idx) => (
                    <div key={step.id} className="flex gap-8 group/step relative">
                      <div className={`relative z-10 w-20 h-20 rounded-2xl border transition-all duration-500 flex items-center justify-center ${step.completed ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                        step.current ? 'bg-solar-yellow/10 border-solar-yellow shadow-[0_0_30px_rgba(255,215,0,0.2)]' :
                          'bg-white/5 border-white/5 opacity-30 grayscale'
                        }`}>
                        {step.completed ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> :
                          step.current ? <Activity className="w-8 h-8 text-solar-yellow animate-pulse" /> :
                            <Sun className="w-8 h-8 text-white/20" />
                        }
                      </div>

                      <div className="flex flex-col justify-center">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${step.completed ? 'text-emerald-400/50' : step.current ? 'text-solar-yellow' : 'text-white/20'
                          }`}>
                          Phase {idx + 1}: {step.completed ? 'SUCCESS' : step.current ? 'PROCESSING' : 'WAITING'}
                        </span>
                        <h3 className={`text-xl font-black uppercase tracking-tight ${step.completed ? 'text-emerald-400 line-through decoration-emerald-400' :
                          step.current ? 'text-white' : 'text-white/20'
                          }`}>
                          {step.title}
                        </h3>
                        {step.current && (
                          <p className="text-xs text-white/50 mt-2 max-w-md font-bold uppercase tracking-wider">
                            {profile?.surveyStatus === 'ASSIGNED' && step.title.toLowerCase().includes('survey')
                              ? `Admin has assigned team: ${profile.assignedSurveyTeam}`
                              : `Admin has assigned the ${step.title.toLowerCase().includes('survey') ? 'survey' : 'installation'} team.`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[2rem] border border-white/10 hover:border-solar-yellow/50 transition-all cursor-pointer group flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase tracking-wider text-white">Request Survey</h4>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Direct Coordination</p>
                </div>
                <MapPin className="w-6 h-6 text-solar-yellow/40 group-hover:text-solar-yellow" />
              </div>
              <div className="glass p-8 rounded-[2rem] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase tracking-wider text-white">Documentation</h4>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Legal & Technical</p>
                </div>
                <FileText className="w-6 h-6 text-blue-500/40 group-hover:text-blue-500" />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <AnimatePresence>
              {request.quotation && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-dark rounded-[2.5rem] p-8 border border-emerald-500/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Solar Quote</h3>
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Current Step</p>
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
                        <>
                          <div className="bg-solar-yellow/10 border border-solar-yellow/30 rounded-2xl p-6 mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-solar-yellow mb-2">{currentMilestone.name}</p>
                            <p className="text-white/50 text-xs mb-3">Required before mobilization of material</p>
                            <p className="text-3xl font-black text-white">₹{currentAmount.toLocaleString()}</p>
                          </div>
                          
                          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-6 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 text-emerald-400">Total Remaining</p>
                            <p className="text-2xl font-black text-emerald-400">₹{totalRemaining.toLocaleString()}</p>
                          </div>
                        </>
                      );
                    })()}
                    <Button 
                      onClick={() => navigate('/customer/payments')}
                      className="w-full bg-emerald-500 text-deep-navy font-black py-7 rounded-xl hover:bg-emerald-400 transition-all uppercase tracking-[0.2em] text-[10px]"
                    >
                      Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass p-8 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-solar-yellow" />
                <h4 className="font-black uppercase tracking-widest text-xs">Expert Insights</h4>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wider italic mb-8">
                "Our automated analysis shows your roof area is optimized for maximum solar absorption. Admin is coordinating the next dispatch."
              </p>

              {/* New Section: Plant & Region Details */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs text-white/60">Logistics & Support</h4>

                {/* Plant Details */}
                {profile?.plantDetails && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Assigned Plant</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.plantDetails.plantName}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{profile.plantDetails.city}, {profile.plantDetails.state}</p>

                    {/* Owner Details */}
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Owner Contact</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.plantDetails.ownerName}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.plantDetails.ownerPhone}</p>
                      {profile.plantDetails.ownerEmail && <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.plantDetails.ownerEmail}</p>}
                    </div>
                  </div>
                )}

                {/* Region Admin Details */}
                {profile?.regionDetails && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Regional Office</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white mb-1">{profile.regionDetails.regionName || 'Region Admin'}</p>

                    {/* Admin Details */}
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Admin Contact</p>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.regionDetails.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.regionDetails.phone}</p>
                      {profile.regionDetails.email && <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.regionDetails.email}</p>}
                    </div>
                  </div>
                )}

                {/* Plant Admin Details */}
                {profile?.plantAdminName && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Plant Administrator</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.plantAdminName}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Phone: {profile.plantAdminPhone}</p>
                    {profile.plantAdminEmail && <p className="text-[10px] text-white/40 uppercase tracking-widest">Email: {profile.plantAdminEmail}</p>}
                  </div>
                )}

                {/* Survey Team Details */}
                {profile?.surveyTeam && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Assigned Survey Team</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.surveyTeam.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Code: {profile.surveyTeam.code}</p>

                    {profile.surveyTeam.teamLead && (
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Team Lead</p>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">{profile.surveyTeam.teamLead.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile.surveyTeam.teamLead.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button variant="link" size="sm" onClick={() => navigate('/customer/cancellation')} className="w-full text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-red-500 transition-colors">
              Terminate Installation Request
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
