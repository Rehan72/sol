import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Wallet, 
    CheckCircle2, 
    Lock, 
    Unlock, 
    Sun, 
    AlertCircle,
    Banknote
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_PAYMENT_MILESTONES } from '../../data/mockData';

const PlantPayments = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Plant ID (not really used with mock data but good practice)
    const [milestones, setMilestones] = useState(MOCK_PAYMENT_MILESTONES);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'UNLOCK' or 'MARK_PAID'
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const handleAction = (milestone, type) => {
        setSelectedMilestone(milestone);
        setActionType(type);
        setIsConfirmOpen(true);
    };

    const confirmAction = () => {
        if (!selectedMilestone) return;

        setMilestones(prev => prev.map(m => {
            if (m.id === selectedMilestone.id) {
                if (actionType === 'UNLOCK') {
                    return { ...m, status: 'DUE' };
                } else if (actionType === 'MARK_PAID') {
                    return { ...m, status: 'PAID', date: new Date().toISOString().split('T')[0] };
                }
            }
            return m;
        }));
        setIsConfirmOpen(false);
    };

    return (
        <div className="min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Cinematic Background */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            {/* Navbar */}
             <div className="relative z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-solar-yellow/20 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-solar-yellow" />
                    </div>
                    <span className="font-black tracking-tighter uppercase text-lg">Solar<span className="text-solar-yellow">Connect</span> Admin</span>
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white">Payment Control</h1>
                        <p className="text-white/50">Manage milestones for Plant #{id || 'Generic'}</p>
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="grid grid-cols-1 gap-6">
                        {milestones.map((milestone, idx) => (
                            <motion.div 
                                key={milestone.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                                    milestone.status === 'PAID' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                    milestone.status === 'DUE' ? 'bg-solar-yellow/5 border-solar-yellow/20' :
                                    'bg-white/5 border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                            milestone.status === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' :
                                            milestone.status === 'DUE' ? 'bg-solar-yellow text-deep-navy border-solar-yellow' :
                                            'bg-white/5 text-white/30 border-white/10'
                                    }`}>
                                        {milestone.status === 'PAID' ? <CheckCircle2 className="w-5 h-5" /> : 
                                         milestone.status === 'LOCKED' ? <Lock className="w-4 h-4" /> :
                                         <Wallet className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{milestone.name}</h3>
                                        <p className="text-sm text-white/40">Amount: <span className="text-white font-mono">₹{milestone.amount.toLocaleString()}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                        milestone.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        milestone.status === 'DUE' ? 'bg-solar-yellow/10 text-solar-yellow border-solar-yellow/20' :
                                        'bg-white/10 text-white/40 border-white/10'
                                    }`}>
                                        {milestone.status}
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {milestone.status === 'LOCKED' && (
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAction(milestone, 'UNLOCK')}
                                                className="border-white/10 hover:bg-white/10 text-white/80"
                                            >
                                                <Unlock className="w-4 h-4 mr-2" /> Unlock
                                            </Button>
                                        )}
                                        {milestone.status === 'DUE' && (
                                            <Button 
                                                size="sm"
                                                onClick={() => handleAction(milestone, 'MARK_PAID')}
                                                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                            >
                                                <Banknote className="w-4 h-4 mr-2" /> Mark Paid
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONFIRM ACTION MODAL */}
            <AnimatePresence>
                {isConfirmOpen && selectedMilestone && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsConfirmOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-deep-navy border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    actionType === 'UNLOCK' ? 'bg-solar-yellow/10 text-solar-yellow' : 'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                    {actionType === 'UNLOCK' ? <Unlock className="w-8 h-8" /> : <Banknote className="w-8 h-8" />}
                                </div>

                                <h2 className="text-xl font-bold text-white mb-2">
                                    {actionType === 'UNLOCK' ? 'Unlock Milestone?' : 'Mark as Paid?'}
                                </h2>
                                <p className="text-white/50 mb-6 text-sm">
                                    {actionType === 'UNLOCK' 
                                        ? `Are you sure you want to allow customer to pay for ${selectedMilestone.name}?`
                                        : `Confirm that payment of ₹${selectedMilestone.amount.toLocaleString()} has been received offline for ${selectedMilestone.name}?`}
                                </p>

                                <div className="flex gap-4 w-full">
                                    <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="flex-1 border border-white/10 hover:bg-white/5 text-white/60">
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={confirmAction} 
                                        className={`flex-1 font-bold ${
                                            actionType === 'UNLOCK' ? 'bg-solar-yellow text-deep-navy hover:bg-solar-yellow/90' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                        }`}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlantPayments;
