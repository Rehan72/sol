import React, { useState, useMemo } from 'react';
import { motion ,AnimatePresence} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  History, 
  Filter, 
  Download, 
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Zap,
  Hammer,
  Map,
  Lock,
  Edit,
  Plus,
  MoreVertical,
  Eye,
  Copy
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import DateTimePicker from '../../components/ui/DateTimePicker';
import AuditDetailModal from '../../components/audit/AuditDetailModal';

// --- Mock Data ---
const MOCK_AUDIT_LOGS = [
  {
    id: "AUD-105",
    phase: "INSTALLATION",
    action: "STEP_COMPLETED",
    entity: "QC Inspection",
    performedBy: { name: "Ravi Kumar", role: "INSTALLATION_TEAM" },
    timestamp: "2026-02-18T16:45:00",
    oldValue: "PENDING",
    newValue: "COMPLETED",
    notes: "All safety checks passed. Wiring verified."
  },
  {
    id: "AUD-104",
    phase: "INSTALLATION",
    action: "UPDATE",
    entity: "Wiring Step",
    performedBy: { name: "Ravi Kumar", role: "INSTALLATION_TEAM" },
    timestamp: "2026-02-18T14:12:00",
    oldValue: "IN_PROGRESS",
    newValue: "COMPLETED",
    notes: "Cabling completed for Array 1."
  },
  {
    id: "AUD-103",
    phase: "INSTALLATION",
    action: "STATUS_CHANGE",
    entity: "Installation Phase",
    performedBy: { name: "Amit Singh", role: "PLANT_ADMIN" },
    timestamp: "2026-02-15T10:01:00",
    oldValue: "PENDING",
    newValue: "IN_PROGRESS",
    notes: "Installation started. Assigned to Team Alpha."
  },
  {
    id: "AUD-102",
    phase: "SURVEY",
    action: "LOCKED",
    entity: "Survey Report",
    performedBy: { name: "System", role: "SYSTEM" },
    timestamp: "2026-02-12T18:40:05",
    oldValue: "OPEN",
    newValue: "LOCKED",
    notes: "Survey report auto-locked upon approval."
  },
  {
    id: "AUD-101",
    phase: "SURVEY",
    action: "COMPLETED",
    entity: "Feasibility Check",
    performedBy: { name: "Rohit Sharma", role: "SURVEY_TEAM" },
    timestamp: "2026-02-12T18:40:00",
    oldValue: "IN_PROGRESS",
    newValue: "COMPLETED",
    notes: "Site is feasible. Report submitted."
  },
  {
    id: "AUD-100",
    phase: "PLANT",
    action: "CREATED",
    entity: "Plant Profile",
    performedBy: { name: "Admin", role: "REGION_ADMIN" },
    timestamp: "2026-02-10T09:00:00",
    oldValue: null,
    newValue: "CREATED",
    notes: "New plant registered: Delhi Solar Plant"
  }
];

const PHASE_OPTIONS = [
    { value: 'ALL', label: 'All Phases' },
    { value: 'SURVEY', label: 'Survey' },
    { value: 'INSTALLATION', label: 'Installation' },
    { value: 'COMMISSIONING', label: 'Commissioning' },
    { value: 'PLANT', label: 'Plant General' }
];

const ACTION_OPTIONS = [
    { value: 'ALL', label: 'All Actions' },
    { value: 'CREATED', label: 'Created' },
    { value: 'UPDATE', label: 'Updated' },
    { value: 'STATUS_CHANGE', label: 'Status Changed' },
    { value: 'LOCKED', label: 'Locked' },
    { value: 'COMPLETED', label: 'Completed' }
];

function AuditTrail() {
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Filters
  const [filterPhase, setFilterPhase] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Filter Logic
  const filteredLogs = useMemo(() => {
      return MOCK_AUDIT_LOGS.filter(log => {
          if (filterPhase !== 'ALL' && log.phase !== filterPhase) return false;
          if (filterAction !== 'ALL' && log.action !== filterAction) return false;
          // Date logic could go here
          return true;
      });
  }, [filterPhase, filterAction, dateRange]);

  const getActionIcon = (action) => {
      switch(action) {
          case 'CREATED': return <Plus className="w-4 h-4" />;
          case 'UPDATE': return <Edit className="w-4 h-4" />;
          case 'LOCKED': return <Lock className="w-4 h-4" />;
          case 'COMPLETED': case 'STEP_COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
          case 'STATUS_CHANGE': return <History className="w-4 h-4" />;
          default: return <FileText className="w-4 h-4" />;
      }
  };

  const getPhaseColor = (phase) => {
      switch(phase) {
          case 'SURVEY': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
          case 'INSTALLATION': return 'text-solar-yellow border-solar-yellow/30 bg-solar-yellow/10';
          case 'COMMISSIONING': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
          default: return 'text-white/50 border-white/20 bg-white/5';
      }
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
       {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="w-12 h-12 rounded-full glass flex items-center justify-center p-0 hover:bg-white/10 group">
                    <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                        Audit Trail <span className="text-white/40">&</span> History
                    </h1>
                    <p className="text-white/50 text-sm">System accountability log for <span className="text-white font-bold">Delhi Solar Plant</span></p>
                </div>
            </div>
            
            <Button variant="outline" className="hidden md:flex items-center gap-2 border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                <Download className="w-4 h-4" /> Export Log
            </Button>
         </div>

         {/* Filter Bar */}
         <div className="glass rounded-2xl p-6 mb-8 border-t border-white/10 overflow-visible relative z-20">
             <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
                <div className="w-full md:w-48 lg:w-56">
                    <Select 
                        label="Filter by Phase" 
                        options={PHASE_OPTIONS} 
                        value={filterPhase}
                        onChange={(e) => setFilterPhase(e.target.value)}
                        icon={Filter}
                    />
                </div>
                <div className="w-full md:w-48 lg:w-56">
                    <Select 
                        label="Action Type" 
                        options={ACTION_OPTIONS} 
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        icon={Zap}
                    />
                </div>
                
                {/* Date Selection */}
                <div className="relative w-full md:flex-1 min-w-[300px]">
                    <DateTimePicker 
                        label="Date Range" 
                        mode="range"
                        value={dateRange.start ? dateRange : null} // Handle potential empty string initial state safely
                        onChange={(val) => setDateRange(val || { start: null, end: null })}
                    />
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-transparent select-none">Reset</label>
                    <Button 
                        onClick={() => { setFilterPhase('ALL'); setFilterAction('ALL'); }}
                        className="w-full md:w-auto px-8 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 whitespace-nowrap"
                    >
                        Reset
                    </Button>
                </div>
             </div>
         </div>

         {/* Timeline */}
         <div className="relative pl-8 md:pl-0">
             {/* Vertical Line for Mobile */}
             <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 md:hidden" />

             <div className="space-y-6">
                 {filteredLogs.map((log, index) => (
                     <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative md:grid md:grid-cols-[150px_1fr] gap-8 group ${openMenuId === log.id ? 'z-50' : 'z-auto'}`}
                     >
                         {/* Time Column (Desktop) */}
                         <div className="hidden md:block text-right pt-4">
                             <p className="font-mono text-sm text-white/80">{new Date(log.timestamp).toLocaleDateString()}</p>
                             <p className="text-xs text-white/40">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                         </div>

                         {/* Card */}
                         <div 
                             onClick={() => setSelectedLog(log)}
                             className="glass p-5 rounded-2xl border border-white/5 hover:border-solar-yellow/30 transition-all cursor-pointer relative"
                         >
                             {/* Mobile Time */}
                             <div className="md:hidden absolute top-4 right-4 text-right">
                                <p className="text-[10px] text-white/40 font-mono">{new Date(log.timestamp).toLocaleDateString()}</p>
                             </div>

                             <div className="flex items-start gap-4">
                                 {/* Icon */}
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                     log.action === 'COMPLETED' || log.action === 'STEP_COMPLETED' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                                     log.action === 'LOCKED' ? 'bg-red-500/20 border-red-500 text-red-500' :
                                     'bg-white/10 border-white/20 text-white'
                                 }`}>
                                     {getActionIcon(log.action)}
                                 </div>

                                 <div className="flex-1">
                                     <div className="flex items-center gap-2 mb-1">
                                         <h3 className="font-bold text-lg text-white">{log.entity}</h3>
                                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${getPhaseColor(log.phase)}`}>
                                             {log.phase}
                                         </span>
                                     </div>
                                     <p className="text-white/60 text-sm mb-3">
                                         Action: <span className="text-white">{log.action.replace('_', ' ')}</span> • {log.notes}
                                     </p>
                                     <div className="flex items-center gap-2 text-xs text-white/40">
                                         <User className="w-3 h-3" />
                                         <span className="font-bold text-white/60">{log.performedBy.name}</span>
                                         <span>({log.performedBy.role.replace('_', ' ')})</span>
                                     </div>
                                 </div>

                                 {/* Context Menu */}
                                 <div className="relative self-center">
                                     <Button 
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === log.id ? null : log.id);
                                        }}
                                        className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                     >
                                         <MoreVertical className="w-5 h-5" />
                                     </Button>

                                     {/* Dropdown */}
                                     <AnimatePresence>
                                         {openMenuId === log.id && (
                                             <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className="absolute right-0 top-10 w-48 bg-deep-navy border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                onClick={(e) => e.stopPropagation()}
                                             >
                                                <div className="p-1">
                                                     <Button 
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedLog(log);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full justify-start px-4 py-3 text-sm font-bold text-white hover:bg-white/5 rounded-lg flex items-center gap-2 h-auto"
                                                     >
                                                         <Eye className="w-4 h-4 text-solar-yellow" /> View Details
                                                     </Button>
                                                     <Button 
                                                        variant="ghost"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full justify-start px-4 py-3 text-sm font-bold text-white hover:bg-white/5 rounded-lg flex items-center gap-2 h-auto"
                                                     >
                                                         <Copy className="w-4 h-4 text-blue-400" /> Copy Data
                                                     </Button>
                                                </div>
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>
                             </div>
                         </div>
                     </motion.div>
                 ))}
             </div>
             
             {filteredLogs.length === 0 && (
                 <div className="text-center py-20 text-white/30">
                     <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                     <p>No audit logs found for selected filters.</p>
                 </div>
             )}

         </div>
      </div>

      {/* Modal */}
      <AuditDetailModal 
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
}

export default AuditTrail;
