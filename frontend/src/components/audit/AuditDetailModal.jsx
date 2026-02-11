import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Clock, User, Shield, FileText, History } from 'lucide-react';
import { Button } from '../ui/button';

const AuditDetailModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  const isPositive = log.action === 'COMPLETED' || log.action === 'STEP_COMPLETED';
  const isNegative = log.action === 'LOCKED';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-deep-navy/90 border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden glass"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Premium Header Area --- */}
            <div className="relative overflow-hidden">
                {/* Status Glow Background */}
                <div className={`absolute inset-0 opacity-10 blur-3xl -z-10 ${
                    log.phase === 'INSTALLATION' ? 'bg-solar-yellow' :
                    log.phase === 'SURVEY' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />

                <div className="p-8 pb-6 flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                log.phase === 'INSTALLATION' ? 'border-solar-yellow/30 bg-solar-yellow/10 text-solar-yellow' :
                                log.phase === 'SURVEY' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                'border-blue-500/30 bg-blue-500/10 text-blue-400'
                            }`}>
                                {log.phase} Phase
                            </span>
                            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                                isPositive ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                isNegative ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                'bg-white/5 border-white/10 text-white'
                            }`}>
                                <History className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                                {log.action.replace('_', ' ')}
                            </h2>
                        </div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                             Target Entity <ArrowRight className="w-3 h-3 text-solar-yellow" /> <span className="text-white tracking-widest">{log.entity}</span>
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full glass border border-white/10 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* --- Body Content --- */}
            <div className="p-8 pt-2 space-y-8">

              {/* Performed By Panel */}
              <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-solar-yellow/5 transition-colors -z-10" />
                  <div className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 glass-light">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-solar-yellow/20 to-transparent flex items-center justify-center font-black text-xl border-2 border-solar-yellow shadow-[0_0_20px_rgba(255,215,0,0.1)] text-solar-yellow">
                      {log.performedBy.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1.5">Action Executed By</p>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-white tracking-tight">{log.performedBy.name}</span>
                        <span className="text-[9px] px-3 py-1 rounded-full bg-white/10 text-white/60 border border-white/10 flex items-center gap-1.5 font-black uppercase tracking-widest shadow-inner">
                          <Shield className="w-3 h-3 text-solar-yellow" /> {log.performedBy.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Comparison Grid */}
              <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center">State Transition</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Visual Connector Line */}
                    <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-deep-navy border border-white/10 items-center justify-center z-10 shadow-lg">
                        <ArrowRight className="w-4 h-4 text-solar-yellow" />
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Before
                      </p>
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5 min-h-[80px] flex items-center">
                        <p className="font-mono text-base text-white/80 break-all leading-relaxed">
                            {formatValue(log.oldValue)}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-solar-yellow/5 border border-solar-yellow/10 hover:border-solar-yellow/30 transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-widest text-solar-yellow/60 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-solar-yellow/40" /> After
                      </p>
                      <div className="bg-solar-yellow/10 p-4 rounded-xl border border-solar-yellow/10 min-h-[80px] flex items-center">
                        <p className="font-mono text-base text-white font-bold break-all leading-relaxed">
                            {formatValue(log.newValue)}
                        </p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Notes Context */}
              {log.notes && (
                <div className="relative group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2 px-1">
                        <FileText className="w-3.5 h-3.5 text-solar-yellow" /> System Observation
                    </p>
                    <div className="p-6 rounded-2xl bg-white/5 border-l-4 border-l-solar-yellow border-y border-r border-white/10 glass-light">
                        <p className="text-white/80 italic leading-relaxed font-medium">
                            "{log.notes}"
                        </p>
                    </div>
                </div>
              )}
            </div>

            {/* --- Footer Area --- */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-white/5 border-white/10 hover:border-solar-yellow/50 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] px-10 py-3 rounded-full transition-all group/btn"
              >
                Dismiss Modal
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const formatValue = (val) => {
  if (val === null || val === undefined) return <span className="text-white/30 italic">Not set</span>;
  if (typeof val === 'boolean') return <span className={val ? 'text-emerald-400' : 'text-red-400'}>{val ? 'Active' : 'Inactive'}</span>;
  if (typeof val === 'object') return <pre className="text-xs">{JSON.stringify(val, null, 2)}</pre>;
  return val.toString();
};

export default AuditDetailModal;
