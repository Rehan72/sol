import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';

const OnboardingWaiting = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-deep-navy text-white overflow-hidden relative flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
          
          <div className="glass p-10 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 animate-pulse">
                  <Clock className="w-10 h-10 text-solar-yellow" />
              </div>

              <h1 className="text-2xl font-black uppercase tracking-tight mb-4">
                  Profile <span className="text-emerald-400">Submitted</span>
              </h1>
              
              <p className="text-white/60 mb-8 leading-relaxed">
                  Thank you for completing your profile. Your account is currently 
                  <span className="text-white font-bold ml-1">Waiting for Assignment</span>. 
                  <br /><br />
                  You will be notified once a Plant Admin assigns you to a Solar Power Plant.
              </p>

              <div className="bg-deep-navy/50 rounded-xl p-4 border border-white/5 mb-8">
                  <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Current Status</p>
                  <p className="text-solar-yellow font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2">
                       <span className="w-2 h-2 bg-solar-yellow rounded-full animate-ping" />
                       Pending Approval
                  </p>
              </div>

              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="w-full border-white/10 text-white/50 hover:text-white hover:bg-white/5"
              >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
          </div>

      </div>
    </div>
  );
};

export default OnboardingWaiting;
