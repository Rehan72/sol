import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardCheck,
    Map,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    HardDrive,
    Hammer,
    Zap,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getAllCustomers } from '../../api/customer';
import { useAuthStore } from '../../store/authStore';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('surveys'); // 'surveys' | 'installations'

    useEffect(() => {
        fetchAssignedTasks();
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            setLoading(true);
            // In a real scenario, we would filter by assignedTo === user.id backend-side
            // For now, fetching all and filtering client-side or showing all for demo
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const surveyTasks = customers.filter(c =>
        !c.surveyStatus || c.surveyStatus === 'PENDING' || c.surveyStatus === 'IN_PROGRESS' || c.surveyStatus === 'ASSIGNED'
    );

    // We want to show installations where survey is completed or installation has started
    const installationTasks = customers.filter(c =>
        c.surveyStatus === 'COMPLETED' || c.installationStatus === 'IN_PROGRESS' || c.installationStatus === 'ASSIGNED'
    );

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-2">{label}</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                    <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-full bg-white/5 border border-white/10 ${color.replace('text-', 'text-opacity-80 text-')}`}>
                        Active
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-deep-navy text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            Welcome, <span className="text-solar-yellow">{user?.name || 'Employee'}</span>
                        </h1>
                        <p className="text-white/40 text-sm font-medium tracking-wide mt-1">
                            Here is your assigned work for today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Online</p>
                            <p className="text-[10px] text-white/30">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
                            <Zap className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Pending Surveys" value={surveyTasks.length} icon={Map} color="text-solar-yellow" />
                    <StatCard label="Installations" value={installationTasks.length} icon={Hammer} color="text-emerald-400" />
                    <StatCard label="Reports Due" value="0" icon={ClipboardCheck} color="text-red-400" />
                    <StatCard label="Total Completed" value="12" icon={LayoutDashboard} color="text-blue-400" />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Task List */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tabs */}
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setActiveTab('surveys')}
                                className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${activeTab === 'surveys'
                                    ? 'bg-solar-yellow text-deep-navy shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                My Surveys
                            </button>
                            <button
                                onClick={() => setActiveTab('installations')}
                                className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${activeTab === 'installations'
                                    ? 'bg-emerald-500 text-deep-navy shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Installations
                            </button>
                        </div>

                        {/* List Content */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 text-white/20 uppercase tracking-widest text-xs font-bold animate-pulse">Loading Tasks...</div>
                            ) : (
                                (activeTab === 'surveys' ? surveyTasks : installationTasks).length === 0 ? (
                                    <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center opacity-60">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <ClipboardCheck className="w-8 h-8 text-white/20" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white/40 uppercase">No Active Tasks</h3>
                                        <p className="text-white/20 text-sm mt-2 max-w-xs">You are all caught up! Check back later for new assignments.</p>
                                    </div>
                                ) : (
                                    (activeTab === 'surveys' ? surveyTasks : installationTasks).map((task) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                                        >
                                            {/* Left Hover Indicator */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />

                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${activeTab === 'surveys'
                                                            ? 'bg-solar-yellow/10 text-solar-yellow border-solar-yellow/20'
                                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            }`}>
                                                            {activeTab === 'surveys' ? task.surveyStatus || 'PENDING' : task.installationStatus || 'PENDING'}
                                                        </span>
                                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> Due: {new Date().toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-solar-yellow transition-colors">{task.name}</h3>
                                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                                        <MapPin className="w-4 h-4" />
                                                        {task.city || 'Location Unknown'}, {task.state}
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => {
                                                        if (activeTab === 'surveys') {
                                                            navigate('/surveys/create', { state: { customer: task } });
                                                        } else {
                                                            navigate(`/installation-workflow/${task.id}`, { state: { customer: task } });
                                                        }
                                                    }}
                                                    className={`uppercase font-bold tracking-wider text-[10px] h-8 px-3 ${activeTab === 'surveys'
                                                        ? 'bg-solar-yellow/10 hover:bg-solar-yellow/20 text-solar-yellow border border-solar-yellow/30'
                                                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        }`}
                                                >
                                                    {activeTab === 'surveys' ? (
                                                        task.surveyStatus === 'IN_PROGRESS' ? 'Resume Survey' : 'Start Survey'
                                                    ) : (
                                                        task.installationStatus === 'INSTALLATION_COMPLETED' ? 'View Installation' : 'Manage Installation'
                                                    )} <ChevronRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                )
                            )}
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button onClick={() => navigate('/surveys/create')} className="w-full justify-start bg-solar-yellow text-deep-navy font-bold uppercase tracking-wider hover:bg-gold">
                                    <Map className="w-4 h-4 mr-2" /> New Site Survey
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-white/10 text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-wider text-xs font-bold">
                                    <AlertCircle className="w-4 h-4 mr-2" /> Report Issue
                                </Button>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Notifications</h3>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-3 items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                        <div>
                                            <p className="text-xs text-white/80 leading-relaxed">New installation assigned: Sector 45 Residence.</p>
                                            <p className="text-[10px] text-white/30 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;
