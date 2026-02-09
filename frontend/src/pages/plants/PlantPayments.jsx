import React, { useEffect, useState } from 'react';
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
    Banknote,
    Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getPlantPayments } from '../../api/payments';

const PlantPayments = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await getPlantPayments();
                if (response && response.data) {
                    setPayments(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch payments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [id]);

    // Group payments by milestone for display
    const getMilestoneStatus = (milestonePayments) => {
        const completed = milestonePayments.filter(p => p.status === 'COMPLETED');
        const totalAmount = milestonePayments.reduce((sum, p) => sum + p.amount, 0);
        
        if (completed.length === milestonePayments.length) {
            return { status: 'PAID', amount: totalAmount, paidAmount: totalAmount };
        }
        return { status: 'DUE', amount: totalAmount, paidAmount: completed.reduce((sum, p) => sum + p.amount, 0) };
    };

    // Group payments by milestoneId
    const groupedPayments = payments.reduce((acc, payment) => {
        const key = payment.milestoneId;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(payment);
        return acc;
    }, {});

    const handleAction = (payment, type) => {
        setSelectedPayment(payment);
        setActionType(type);
        setIsConfirmOpen(true);
    };

    const confirmAction = () => {
        // For now, just close the modal - actual implementation would call API
        setIsConfirmOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-navy text-white flex items-center justify-center overflow-hidden flex-col">
                <div className="film-grain" />
                <div className="cinematic-vignette" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-solar-yellow" />
                </motion.div>
                <p className="mt-4 text-white/50 font-mono text-sm">Loading payments...</p>
            </div>
        );
    }

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
                        <p className="text-white/50">Manage payments for Plant #{id || 'Generic'}</p>
                    </div>
                </div>

                {payments.length === 0 ? (
                    <div className="glass rounded-3xl p-12 border border-white/5 bg-white/5 text-center">
                        <Wallet className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white/60 mb-2">No Payments Found</h3>
                        <p className="text-white/40">There are no payment records for this plant yet.</p>
                    </div>
                ) : (
                    <div className="glass rounded-3xl p-8 border border-white/5 bg-white/5 relative overflow-hidden">
                        <div className="grid grid-cols-1 gap-6">
                            {Object.entries(groupedPayments).map(([milestoneId, milestonePayments]) => {
                                const milestoneData = getMilestoneStatus(milestonePayments);
                                return (
                                    <motion.div 
                                        key={milestoneId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                                            milestoneData.status === 'PAID' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                            milestoneData.status === 'DUE' ? 'bg-solar-yellow/5 border-solar-yellow/20' :
                                            'bg-white/5 border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                                milestoneData.status === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' :
                                                milestoneData.status === 'DUE' ? 'bg-solar-yellow text-deep-navy border-solar-yellow' :
                                                'bg-white/5 text-white/30 border-white/10'
                                            }`}>
                                                {milestoneData.status === 'PAID' ? <CheckCircle2 className="w-5 h-5" /> : 
                                                 milestoneData.status === 'LOCKED' ? <Lock className="w-4 h-4" /> :
                                                 <Wallet className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white">Milestone {milestoneId}</h3>
                                                <p className="text-sm text-white/40">Amount: <span className="text-white font-mono">₹{milestoneData.amount.toLocaleString()}</span></p>
                                                <p className="text-xs text-white/30">Payments: {milestonePayments.length} transaction(s)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                                milestoneData.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                milestoneData.status === 'DUE' ? 'bg-solar-yellow/10 text-solar-yellow border-solar-yellow/20' :
                                                'bg-white/10 text-white/40 border-white/10'
                                            }`}>
                                                {milestoneData.status}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button 
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction(milestonePayments[0], 'UNLOCK')}
                                                    className="border-white/10 hover:bg-white/10 text-white/80"
                                                >
                                                    <Unlock className="w-4 h-4 mr-2" /> Unlock
                                                </Button>
                                                <Button 
                                                    size="sm"
                                                    onClick={() => handleAction(milestonePayments[0], 'MARK_PAID')}
                                                    className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                                >
                                                    <Banknote className="w-4 h-4 mr-2" /> Mark Paid
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
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
                                        ? `Are you sure you want to allow customer to pay for this milestone?`
                                        : `Confirm that payment has been received for this milestone?`}
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
