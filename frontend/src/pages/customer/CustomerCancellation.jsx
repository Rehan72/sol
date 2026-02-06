import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Info, CheckCircle2, XCircle, Sun } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { CANCELLATION_RULES } from '../../data/mockData';

const CustomerCancellation = () => {
    const navigate = useNavigate();
    const [currentStage] = useState('Survey Completed'); // Mock current stage
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [reason, setReason] = useState('');

    const rule = CANCELLATION_RULES[currentStage];
    const paidAmount = 50000; // Mock paid amount (Booking + Survey)
    const refundAmount = (paidAmount * rule.refundPercentage) / 100 - rule.fee;

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowConfirm(false);
        // Simulate API call
    };

    if (isSubmitted) {
        return (
             <div className="min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="film-grain" />
                <div className="cinematic-vignette" />
                 <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 glass p-12 rounded-3xl border border-white/10 text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-solar-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 text-solar-yellow">
                        <Clock className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Refund Requested</h2>
                    <p className="text-white/60 mb-8">
                        Our team is reviewing your request. Based on the current stage, the estimated refund of <span className="text-white font-bold">₹{refundAmount.toLocaleString()}</span> will be processed within 5-7 business days upon approval.
                    </p>
                    <Button onClick={() => navigate('/customer/dashboard')} className="w-full bg-white/10 hover:bg-white/20">
                        Return to Dashboard
                    </Button>
                </motion.div>
             </div>
        )
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
                    <span className="font-black tracking-tighter uppercase text-lg">Solar<span className="text-solar-yellow">Connect</span></span>
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-12 max-w-2xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white text-red-400">Cancel Installation</h1>
                        <p className="text-white/50">Request project cancellation and refund</p>
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 border border-red-500/20 bg-gradient-to-b from-red-900/10 to-transparent">
                    
                    {/* Stage Info */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                        <Info className="w-6 h-6 text-solar-yellow" />
                        <div>
                            <p className="text-xs text-white/50 uppercase font-bold">Current Project Stage</p>
                            <p className="font-bold text-white text-lg">{currentStage}</p>
                        </div>
                    </div>

                    {/* Refund Calculation */}
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Total Amount Paid</span>
                            <span className="font-mono text-white">₹{paidAmount.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-white/60">Refund Eligibility ({rule.refundPercentage}%)</span>
                            <span className="font-mono text-white">₹{(paidAmount * rule.refundPercentage / 100).toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-sm text-red-400">
                            <span>Cancellation Fee</span>
                            <span className="font-mono">- ₹{rule.fee.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <span className="font-bold text-emerald-400 uppercase text-xs tracking-widest">Est. Refund Amount</span>
                            <span className="text-2xl font-black text-white">₹{refundAmount > 0 ? refundAmount.toLocaleString() : 0}</span>
                        </div>
                    </div>

                    {/* Reason Input */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-white/50 uppercase mb-2">Reason for Cancellation (Optional)</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-white/30 transition-colors"
                            rows="3"
                            placeholder="Changed plans, financial issues, etc."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <Button 
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-6 text-lg font-bold bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all"
                    >
                        Request Cancellation
                    </Button>
                </div>
            </div>

            {/* CONFIRM MODAL */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                         <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setShowConfirm(false)}
                        />
                         <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-deep-navy border border-red-500/30 rounded-3xl p-8 max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                            
                            <h2 className="text-xl font-bold text-white mb-2">Are you sure?</h2>
                            <p className="text-white/50 mb-6 text-sm">
                                This action cannot be undone. Your project will be halted immediately.
                            </p>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setShowConfirm(false)} className="flex-1 border border-white/10 text-white/60">Cancel</Button>
                                <Button onClick={handleSubmit} className="flex-1 bg-red-500 text-white font-bold hover:bg-red-600">
                                    Yes, Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Start of missing import workaround
import { Clock } from 'lucide-react'; 

export default CustomerCancellation;
