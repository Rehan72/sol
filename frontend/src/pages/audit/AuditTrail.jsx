import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuditLogs } from '../../api/audit';
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
    Copy,
    ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import DateTimePicker from '../../components/ui/DateTimePicker';
import AuditDetailModal from '../../components/audit/AuditDetailModal';

const PHASE_OPTIONS = [
    { value: 'ALL', label: 'All Phases' },
    { value: 'SURVEY', label: 'Survey' },
    { value: 'INSTALLATION', label: 'Installation' },
    { value: 'COMMISSIONING', label: 'Commissioning' },
    { value: 'LIVE', label: 'Live' },
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
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterPhase, setFilterPhase] = useState('ALL');
    const [filterAction, setFilterAction] = useState('ALL');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const data = await getAuditLogs(); // Fetch all for now
                setLogs(data);
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (filterPhase !== 'ALL' && log.phase !== filterPhase) return false;
            if (filterAction !== 'ALL' && log.action !== filterAction) return false;
            // Date logic could go here
            return true;
        });
    }, [logs, filterPhase, filterAction, dateRange]);

    const getActionIcon = (action) => {
        switch (action) {
            case 'CREATED': return <Plus className="w-4 h-4" />;
            case 'UPDATE': return <Edit className="w-4 h-4" />;
            case 'LOCKED': return <Lock className="w-4 h-4" />;
            case 'COMPLETED': case 'STEP_COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
            case 'STATUS_CHANGE': return <History className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getPhaseColor = (phase) => {
        switch (phase) {
            case 'SURVEY': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
            case 'INSTALLATION': return 'text-solar-yellow border-solar-yellow/30 bg-solar-yellow/10';
            case 'COMMISSIONING': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case 'LIVE': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
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

            {/* --- Premium Header Area --- */}
            <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent group"
                        >
                            <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-5 h-5 text-solar-yellow group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="text-xs text-solar-yellow font-black uppercase tracking-[0.2em]">Back</span>
                        </Button>
                    </div>

                    <div className="text-right">
                        <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            System Accountability Log
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                            Audit <span className="text-solar-yellow">Trail</span>
                        </h1>
                    </div>
                </div>

                {/* Filter & Action Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-12 mb-8">
                    <div className="flex flex-1 flex-col md:flex-row items-center gap-4 w-full">
                        <div className="w-full md:w-64">
                            <Select
                                options={PHASE_OPTIONS}
                                value={filterPhase}
                                onChange={(e) => setFilterPhase(e.target.value)}
                                icon={Filter}
                                className="bg-white/5 border-white/5 hover:border-white/10"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <Select
                                options={ACTION_OPTIONS}
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                icon={Zap}
                                className="bg-white/5 border-white/5 hover:border-white/10"
                            />
                        </div>
                        <div className="flex-1 w-full md:min-w-[300px]">
                            <DateTimePicker
                                mode="range"
                                value={dateRange.start ? dateRange : null}
                                onChange={(val) => setDateRange(val || { start: null, end: null })}
                                className="bg-white/5 border-white/5"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => { setFilterPhase('ALL'); setFilterAction('ALL'); setDateRange({ start: '', end: '' }); }}
                            variant="ghost"
                            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                        >
                            Reset Filters
                        </Button>
                        <Button 
                            variant="outline" 
                            className="bg-solar-yellow/10 border-solar-yellow/20 hover:border-solar-yellow/50 text-solar-yellow text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                        >
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-4">
                    {filteredLogs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group/card relative"
                        >
                            <div 
                                onClick={() => setSelectedLog(log)}
                                className="glass p-6 rounded-2xl border border-white/5 hover:border-solar-yellow/30 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-transform duration-500 group-hover/card:scale-110 ${
                                        log.action === 'COMPLETED' || log.action === 'STEP_COMPLETED' 
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                                        log.action === 'LOCKED' 
                                            ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                        'bg-white/5 border-white/10 text-white shadow-none'
                                    }`}>
                                        {getActionIcon(log.action)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black text-lg text-white tracking-tight uppercase">{log.entity}</h3>
                                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border ${getPhaseColor(log.phase)}`}>
                                                {log.phase}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            <span className="text-solar-yellow font-bold">{log.action.replace('_', ' ')}</span> • {log.notes}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center md:items-end gap-6 md:gap-1">
                                    <div className="text-right order-2 md:order-1">
                                        <p className="font-mono text-[11px] font-bold text-white/80">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <div className="flex items-center justify-end gap-2 text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
                                            <User className="w-3 h-3" />
                                            <span>{log.performedBy.name}</span>
                                        </div>
                                    </div>

                                    <div className="order-1 md:order-2">
                                        <Button
                                            variant="outline"
                                            className="bg-white/5 border-white/10 hover:border-solar-yellow/50 text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all group/btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedLog(log);
                                            }}
                                        >
                                            Details <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredLogs.length === 0 && (
                        <div className="text-center py-32 glass rounded-3xl border border-white/5">
                            <History className="w-16 h-16 mx-auto mb-6 text-white/10" />
                            <h3 className="text-xl font-bold text-white/40 uppercase tracking-widest">No Records Found</h3>
                            <p className="text-white/20 text-sm mt-2">Adjust your filters to see more results</p>
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
