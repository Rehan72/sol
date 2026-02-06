import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserPlus, 
    MapPin, 
    CheckCircle2, 
    X, 
    Search,
    Hammer,
    Zap,
    Battery,
    Briefcase
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock Pending Users
const MOCK_PENDING_USERS = [
    {
        id: 1,
        name: 'Ravi Kumar',
        email: 'ravi.k@example.com',
        location: 'Dwarka, Delhi',
        experience: '3-5 Years',
        skills: ['panel_installation', 'dc_wiring'],
        submittedAt: '2026-02-18'
    },
    {
        id: 2,
        name: 'Mohan Lal',
        email: 'mohan.l@example.com',
        location: 'Sector 62, Noida',
        experience: '5+ Years',
        skills: ['inverter_setup', 'earthing'],
        submittedAt: '2026-02-19'
    },
    {
        id: 3,
        name: 'Suresh Raina',
        email: 'suresh.r@example.com',
        location: 'Vasant Vihar, Delhi',
        experience: '1-3 Years',
        skills: ['panel_installation'],
        submittedAt: '2026-02-19'
    }
];

const SKILL_LABELS = {
    'panel_installation': 'Mounting',
    'dc_wiring': 'Wiring',
    'inverter_setup': 'Inverter',
    'earthing': 'Earthing'
};

const PendingUsers = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const handleAssignClick = (user) => {
        setSelectedUser(user);
        setIsAssignModalOpen(true);
    };

    const confirmAssignment = () => {
        // API Call here
        setIsAssignModalOpen(false);
        // Toast or feedback
        alert(`User ${selectedUser.name} assigned successfully!`);
        setSelectedUser(null);
    };

    return (
        <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
             {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 right-[-20%] w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
             {/* Header */}
             <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
                        Pending <span className="text-solar-yellow">Onboarding</span>
                    </h1>
                    <p className="text-white/50">Assign pending solar installers to your plant teams.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 w-64">
                    <Search className="w-5 h-5 text-white/30" />
                    <input 
                        type="text" 
                        placeholder="Search by location..." 
                        className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PENDING_USERS.map((user) => (
                    <div key={user.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-solar-yellow/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none">{user.name}</h3>
                                    <p className="text-xs text-white/40 mt-1">{user.email}</p>
                                </div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg">
                                <UserPlus className="w-5 h-5 text-solar-yellow" />
                            </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                {user.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Briefcase className="w-4 h-4 text-purple-400" />
                                {user.experience} Exp
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {user.skills.map(skill => (
                                <span key={skill} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 uppercase font-bold">
                                    {SKILL_LABELS[skill] || skill}
                                </span>
                            ))}
                        </div>

                        <Button 
                            onClick={() => handleAssignClick(user)}
                            className="w-full bg-solar-yellow text-deep-navy font-bold hover:bg-gold group-hover:scale-[1.02] transition-transform"
                        >
                            Assign to Team
                        </Button>
                    </div>
                ))}
            </div>

            {/* ASSIGN MODAL */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsAssignModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative w-full max-w-lg bg-deep-navy border border-white/10 rounded-2xl shadow-2xl p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black uppercase text-white">Assign User</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsAssignModalOpen(false)} className="text-white/40 hover:text-white h-auto p-1">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                        {selectedUser?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{selectedUser?.name}</p>
                                        <p className="text-xs text-white/50">{selectedUser?.location}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Assign to Plant</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                                            <option>Delhi Solar Plant (5MW)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Assign Team</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                                            <option>Installation Team Alpha</option>
                                            <option>Installation Team Bravo</option>
                                            <option>Survey Team A</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Role</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                                            <option>Technician</option>
                                            <option>Electrician</option>
                                            <option>Helper</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button variant="ghost" className="flex-1 text-white/50" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold" onClick={confirmAssignment}>
                                        Confirm & Activate
                                    </Button>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
};

export default PendingUsers;
