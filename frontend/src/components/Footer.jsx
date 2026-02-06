import React from 'react';
import { Globe, Heart, ShieldCheck, Activity } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left side: Version and Privacy */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[9px] font-black tracking-[0.2em] uppercase text-solar-black">
        <span>© {currentYear} SOLARMAX OS</span>
        <div className="w-1 h-1 rounded-full bg-solar-black" />
        <a href="#" className="hover:text-solar-yellow transition-colors">Privacy Protocol</a>
        <div className="w-1 h-1 rounded-full bg-solar-black" />
        <a href="#" className="hover:text-solar-yellow transition-colors">Security Audit</a>
      </div>

      {/* Center: System Status Indicators */}
      <div className="flex items-center gap-8 text-[9px] font-black tracking-[0.3em] uppercase text-solar-black">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-solar-yellow" />
          <span>Sync: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Right side: Made with info */}
      <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-solar-black">
        <span>Architected with</span>
        <Heart className="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" />
        <span>for a greener Bharat</span>
        <Globe className="ml-2 w-3.5 h-3.5 text-solar-black" />
      </div>
    </div>
  );
}

export default Footer;