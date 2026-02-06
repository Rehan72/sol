import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Clock, User, Shield, FileText } from 'lucide-react';

const AuditDetailModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-deep-navy border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex justify-between items-start ${
                log.phase === 'INSTALLATION' ? 'bg-solar-yellow/5' : 
                log.phase === 'SURVEY' ? 'bg-emerald-500/5' : 'bg-white/5'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                        log.phase === 'INSTALLATION' ? 'border-solar-yellow text-solar-yellow' :
                        log.phase === 'SURVEY' ? 'border-emerald-500 text-emerald-500' :
                        'border-white/20 text-white/50'
                    }`}>
                        {log.phase} Phase
                    </span>
                    <span className="text-white/40 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                    </span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">{log.action.replace('_', ' ')}</h2>
                <p className="text-white/60 text-sm mt-1">Entity: <span className="text-white font-bold">{log.entity}</span></p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white h-auto w-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-lg border border-white/10">
                        {log.performedBy.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase font-bold mb-0.5">Performed By</p>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{log.performedBy.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/5 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> {log.performedBy.role.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Change Diff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Old Value</p>
                        <p className="text-lg font-mono text-white/80 break-all">
                            {formatValue(log.oldValue)}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center justify-center text-white/20">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">New Value</p>
                        <p className="text-lg font-mono text-white/80 break-all">
                             {formatValue(log.newValue)}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {log.notes && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> System Notes
                        </p>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white/70 italic">
                            "{log.notes}"
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                <Button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors h-auto"
                >
                    Close
                </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const formatValue = (val) => {
    if (val === null || val === undefined) return <span className="text-white/30 italic">None</span>;
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    if (typeof val === 'object') return JSON.stringify(val);
    return val.toString();
};

export default AuditDetailModal;
