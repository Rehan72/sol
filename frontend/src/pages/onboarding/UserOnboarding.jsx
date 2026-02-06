import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  Navigation,
  Hammer,
  Zap,
  Battery
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const SKILLS_OPTIONS = [
    { id: 'panel_installation', label: 'Panel Installation', icon: Hammer },
    { id: 'dc_wiring', label: 'DC Wiring', icon: Zap },
    { id: 'inverter_setup', label: 'Inverter Setup', icon: Battery },
    { id: 'earthing', label: 'Earthing / Lightning Arrestor', icon: Zap },
    { id: 'site_survey', label: 'Site Survey', icon: MapPin },
];

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      country: 'India',
      state: '',
      city: '',
      pincode: '',
      skills: [],
      experience: ''
  });

  const handleNext = () => {
      if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
      if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
      // API call would go here
      console.log('Submitting profile:', formData);
      navigate('/onboarding/waiting');
  };

  const toggleSkill = (skillId) => {
      setFormData(prev => ({
          ...prev,
          skills: prev.skills.includes(skillId) 
              ? prev.skills.filter(id => id !== skillId)
              : [...prev.skills, skillId]
      }));
  };

  return (
    <div className="min-h-screen bg-deep-navy text-white overflow-hidden relative flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
          
          {/* Header */}
          <div className="text-center mb-10">
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                  Complete Your <span className="text-solar-yellow">Profile</span>
              </h1>
              <p className="text-white/50">Step {step} of 3 • {step === 1 ? 'Location Details' : step === 2 ? 'Work Profile' : 'Confirmation'}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden max-w-xs mx-auto">
                  <motion.div 
                      className="h-full bg-solar-yellow"
                      initial={{ width: '33%' }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                  />
              </div>
          </div>

          {/* Form Card */}
          <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden min-h-[400px]">
              <AnimatePresence mode='wait'>
                  
                  {/* STEP 1: LOCATION */}
                  {step === 1 && (
                      <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                      >
                          <h2 className="text-xl font-bold flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-solar-yellow" />
                              Where are you based?
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">State</label>
                                  <input 
                                    type="text" 
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-solar-yellow/50"
                                    placeholder="e.g. Delhi"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">City / Area</label>
                                  <input 
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-solar-yellow/50"
                                    placeholder="e.g. Dwarka" 
                                   />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Pincode</label>
                                  <input 
                                    type="text"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-solar-yellow/50"
                                    placeholder="e.g. 110075" 
                                  />
                              </div>
                          </div>
                      </motion.div>
                  )}

                  {/* STEP 2: SKILLS */}
                  {step === 2 && (
                      <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                      >
                          <h2 className="text-xl font-bold flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-solar-yellow" />
                              What are your skills?
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {SKILLS_OPTIONS.map(skill => {
                                  const Icon = skill.icon;
                                  const isSelected = formData.skills.includes(skill.id);
                                  return (
                                     <div 
                                        key={skill.id}
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                                            isSelected 
                                            ? 'bg-solar-yellow text-deep-navy border-solar-yellow font-bold' 
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                        }`}
                                     >
                                         <Icon className="w-5 h-5" />
                                         <span className="text-sm">{skill.label}</span>
                                         {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                                     </div>
                                  );
                              })}
                          </div>

                          <div className="space-y-2 mt-4">
                              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Years of Experience</label>
                              <select 
                                  value={formData.experience}
                                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                  className="w-full bg-deep-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-solar-yellow/50"
                              >
                                  <option value="">Select Experience</option>
                                  <option value="0-1">0-1 Years</option>
                                  <option value="1-3">1-3 Years</option>
                                  <option value="3-5">3-5 Years</option>
                                  <option value="5+">5+ Years</option>
                              </select>
                          </div>
                      </motion.div>
                  )}

                  {/* STEP 3: CONFIRMATION */}
                  {step === 3 && (
                      <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="text-center py-8"
                      >
                          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                          </div>
                          <h2 className="text-2xl font-black uppercase mb-2">All Set!</h2>
                          <p className="text-white/60 mb-8 max-w-sm mx-auto">
                              Your profile details have been captured. Submit your profile to request assignment to a solar plant.
                          </p>
                          
                          <div className="bg-white/5 rounded-xl p-4 text-left max-w-sm mx-auto border border-white/10">
                              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                                  <span className="text-xs text-white/40">Location</span>
                                  <span className="text-sm font-bold">{formData.city}, {formData.state}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-white/40">Skills</span>
                                  <span className="text-sm font-bold">{formData.skills.length} Selected</span>
                              </div>
                          </div>
                      </motion.div>
                  )}

              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                  {step > 1 ? (
                      <Button onClick={handleBack} variant="ghost" className="text-white/40 hover:text-white">
                          <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                  ) : <div></div>}

                  {step < 3 ? (
                      <Button onClick={handleNext} className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold">
                          Continue <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                  ) : (
                      <Button onClick={handleSubmit} className="bg-emerald-500 text-white font-bold hover:bg-emerald-600 px-8">
                          Submit & Finish
                      </Button>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default UserOnboarding;
