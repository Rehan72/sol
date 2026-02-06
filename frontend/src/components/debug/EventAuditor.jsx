import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, ChevronUp, ChevronDown, MousePointer2, Keyboard, Monitor, Zap } from 'lucide-react';

const EventAuditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [eventStats, setEventStats] = useState({
    click: 0,
    keydown: 0,
    scroll: 0,
    resize: 0,
    lastEvent: 'None',
    renderCount: 0
  });

  const statsRef = useRef(eventStats);
  const renderCountRef = useRef(0);

  // Update render count on every render
  useEffect(() => {
    renderCountRef.current += 1;
    setEventStats(prev => ({ ...prev, renderCount: renderCountRef.current }));
  }, []);

  const updateStat = useCallback((type) => {
    statsRef.current = {
      ...statsRef.current,
      [type]: statsRef.current[type] + 1,
      lastEvent: type.toUpperCase()
    };
    setEventStats(statsRef.current);
  }, []);

  useEffect(() => {
    const handleClick = () => updateStat('click');
    const handleKeydown = () => updateStat('keydown');
    
    // Throttled scroll/resize
    let scrollTimeout;
    const handleScroll = () => {
      if (!scrollTimeout) {
        updateStat('scroll');
        scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 100);
      }
    };

    let resizeTimeout;
    const handleResize = () => {
      if (!resizeTimeout) {
        updateStat('resize');
        resizeTimeout = setTimeout(() => { resizeTimeout = null; }, 200);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateStat]);

  if (process.env.NODE_ENV === 'production' && !window.location.search.includes('debug=true')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-9999 pointer-events-none">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto w-12 h-12 glass rounded-full flex items-center justify-center text-solar-yellow shadow-2xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Activity className="w-5 h-5 animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto glass-dark border border-white/10 rounded-2xl w-64 shadow-2xl overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-solar-yellow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">System Audit</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/5 rounded-md transition-colors"
                >
                  {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-red-500/20 rounded-md transition-colors text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <div className="p-4 space-y-3">
                <StatRow icon={<MousePointer2 className="w-3 h-3" />} label="Clicks" value={eventStats.click} />
                <StatRow icon={<Keyboard className="w-3 h-3" />} label="Keys" value={eventStats.keydown} />
                <StatRow icon={<Activity className="w-3 h-3" />} label="Scrolls" value={eventStats.scroll} />
                <StatRow icon={<Monitor className="w-3 h-3" />} label="Resizes" value={eventStats.resize} />
                
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold uppercase text-white/30">Last Event</span>
                    <span className="text-[8px] font-black uppercase text-solar-yellow">{eventStats.lastEvent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold uppercase text-white/30">Render Cycles</span>
                    <span className="text-[8px] font-black uppercase text-emerald-400">{eventStats.renderCount}</span>
                  </div>
                </div>

                <p className="text-[7px] font-bold uppercase text-center text-white/10 tracking-[0.2em] pt-2">
                  Real-time Perf Monitoring Active
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-2">
      <div className="text-white/20 group-hover:text-solar-yellow transition-colors">{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">{label}</span>
    </div>
    <span className="text-[9px] font-black tabular-nums text-white/90">{value}</span>
  </div>
);

export default EventAuditor;
