import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Wallet, 
    CheckCircle2, 
    Lock, 
    ChevronRight, 
    CreditCard, 
    Smartphone, 
    Globe, 
    ShieldCheck, 
    AlertTriangle,
    Sun,
    Banknote,
    Calculator
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_PAYMENT_MILESTONES, MOCK_EMI_PLANS } from '../../data/mockData';

const CustomerPayments = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState(MOCK_PAYMENT_MILESTONES);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [emiPlan, setEmiPlan] = useState(null);

    // Calculate Totals
    const totalCost = milestones.reduce((sum, m) => sum + m.amount, 0);
    const totalPaid = milestones.filter(m => m.status === 'PAID').reduce((sum, m) => sum + m.amount, 0);
    const totalRemaining = totalCost - totalPaid;
    const progress = (totalPaid / totalCost) * 100;

    const handlePayClick = (milestone) => {
        setSelectedMilestone(milestone);
        setIsPaymentModalOpen(true);
    };

    const confirmPayment = () => {
        // Simulate API Call
        setTimeout(() => {
            setIsPaymentModalOpen(false);
            setIsSuccessOpen(true);
            
            // Update local state to reflect payment
            setMilestones(prev => prev.map(m => 
                m.id === selectedMilestone.id ? { ...m, status: 'PAID', date: new Date().toISOString().split('T')[0] } : m
            ));
        }, 1500);
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
                    <span className="font-black tracking-tighter uppercase text-lg">Solar<span className="text-solar-yellow">Connect</span></span>
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white">Payments & Milestones</h1>
                        <p className="text-white/50">Track your project payments and upcoming dues</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: OVERVIEW */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Summary Card */}
                        <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-solar-yellow/5 rounded-full blur-[80px]" />
                            
                            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Payment Overview</h2>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Total Project Cost</p>
                                    <p className="text-3xl font-black text-white">₹{totalCost.toLocaleString()}</p>
                                </div>
                                
                                <div className="h-px bg-white/10" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-white/60 text-xs mb-1">Paid Amount</p>
                                        <p className="text-xl font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs mb-1">Remaining</p>
                                        <p className="text-xl font-bold text-solar-yellow">₹{totalRemaining.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-white/40">Payment Progress</span>
                                        <span className="text-solar-yellow">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-solar-yellow"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            <div>
                                <p className="font-bold text-white text-sm">Secure Payments</p>
                                <p className="text-xs text-white/40">All transactions are encrypted and secured.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: MILESTONES */}
                    <div className="lg:col-span-2 space-y-4">
                        {milestones.map((milestone, idx) => (
                            <motion.div 
                                key={milestone.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`glass rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group ${
                                    milestone.status === 'DUE' 
                                        ? 'border-solar-yellow/30 bg-solar-yellow/5 hover:border-solar-yellow/50' 
                                        : milestone.status === 'PAID'
                                        ? 'border-emerald-500/20 bg-emerald-500/5'
                                        : 'border-white/5 bg-white/5 opacity-70'
                                }`}
                            >
                                {/* Active Indicator Stripe */}
                                {milestone.status === 'DUE' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar-yellow" />
                                )}

                                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative z-10">
                                    
                                    {/* Icon & Details */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                                            milestone.status === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' :
                                            milestone.status === 'DUE' ? 'bg-solar-yellow text-deep-navy border-solar-yellow animate-pulse' :
                                            'bg-white/5 text-white/30 border-white/10'
                                        }`}>
                                            {milestone.status === 'PAID' ? <CheckCircle2 className="w-6 h-6" /> :
                                             milestone.status === 'LOCKED' ? <Lock className="w-5 h-5" /> :
                                             <Wallet className="w-6 h-6" />}
                                        </div>
                                        
                                        <div>
                                            <h3 className={`font-bold text-lg ${milestone.status === 'LOCKED' ? 'text-white/50' : 'text-white'}`}>
                                                {milestone.name}
                                            </h3>
                                            <p className="text-xs text-white/40">{milestone.description}</p>
                                            {milestone.status === 'PAID' && (
                                                <p className="text-xs text-emerald-400 mt-1 font-medium">Paid on {milestone.date}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount & Action */}
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <p className="text-xl font-bold font-mono text-white">₹{milestone.amount.toLocaleString()}</p>
                                            <p className={`text-[10px] uppercase font-bold tracking-wider ${
                                                milestone.status === 'PAID' ? 'text-emerald-400' :
                                                milestone.status === 'DUE' ? 'text-solar-yellow' :
                                                'text-white/30'
                                            }`}>
                                                {milestone.status}
                                            </p>
                                        </div>

                                        {milestone.status === 'DUE' && (
                                            <Button 
                                                onClick={() => handlePayClick(milestone)}
                                                className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-yellow/90 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                            >
                                                Pay Now
                                            </Button>
                                        )}
                                        
                                        {milestone.status === 'LOCKED' && <Lock className="w-5 h-5 text-white/10" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            <AnimatePresence>
                {isPaymentModalOpen && selectedMilestone && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                            onClick={() => setIsPaymentModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-deep-navy border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
                        >
                            {/* Modal Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2">Make Payment</h2>
                                <p className="text-white/50 text-sm mb-6">Secure payment for {selectedMilestone.name}</p>

                                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 flex justify-between items-center">
                                    <span className="text-white/70">Amount Payable</span>
                                    <span className="text-2xl font-bold font-mono text-white">₹{selectedMilestone.amount.toLocaleString()}</span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <p className="text-xs font-bold text-white/30 uppercase">Select Payment Method</p>
                                    
                                    {['UPI', 'Credit/Debit Card', 'Net Banking', 'EMI / Financing'].map((method, i) => (
                                        <div key={i}>
                                            <label 
                                                onClick={() => {
                                                    setPaymentMethod(method);
                                                    if (method !== 'EMI / Financing') setEmiPlan(null);
                                                }}
                                                className={`flex items-center gap-4 p-4 rounded-xl border bg-black/20 cursor-pointer transition-all group ${
                                                    paymentMethod === method 
                                                    ? 'border-solar-yellow bg-solar-yellow/5' 
                                                    : 'border-white/5 hover:border-solar-yellow/50'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="payment" 
                                                    checked={paymentMethod === method}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 accent-solar-yellow" 
                                                />
                                                <div className="flex-1 flex items-center gap-3">
                                                    {i === 0 ? <Smartphone className="w-5 h-5 text-white/70" /> : 
                                                     i === 1 ? <CreditCard className="w-5 h-5 text-white/70" /> : 
                                                     i === 2 ? <Globe className="w-5 h-5 text-white/70" /> :
                                                     <Banknote className="w-5 h-5 text-white/70" />}
                                                    <span className={`transition-colors ${paymentMethod === method ? 'text-solar-yellow font-bold' : 'text-white'}`}>
                                                        {method}
                                                    </span>
                                                </div>
                                                {i === 3 && <span className="text-[10px] bg-solar-yellow/20 text-solar-yellow px-2 py-0.5 rounded font-bold">NEW</span>}
                                            </label>

                                            {/* EMI CALCULATOR */}
                                            {method === 'EMI / Financing' && paymentMethod === 'EMI / Financing' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-2 ml-4 p-4 bg-white/5 border-l-2 border-solar-yellow rounded-r-xl"
                                                >
                                                    <div className="flex items-center gap-2 mb-3 text-solar-yellow">
                                                        <Calculator className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Select EMI Plan</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {MOCK_EMI_PLANS.map((plan, idx) => {
                                                            const interestAmt = (selectedMilestone.amount * plan.interest * (plan.months/12)) / 100;
                                                            const totalAmt = selectedMilestone.amount + interestAmt;
                                                            const monthly = Math.round(totalAmt / plan.months);

                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    onClick={() => setEmiPlan(plan)}
                                                                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${
                                                                        emiPlan === plan 
                                                                        ? 'bg-solar-yellow/10 border-solar-yellow text-white' 
                                                                        : 'bg-black/20 border-white/10 hover:bg-white/5 text-white/60'
                                                                    }`}
                                                                >
                                                                    <div>
                                                                        <p className="font-bold text-sm">{plan.months} Months</p>
                                                                        <p className="text-[10px] opacity-70">@ {plan.interest}% p.a</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className={`font-bold font-mono ${emiPlan === plan ? 'text-solar-yellow' : ''}`}>
                                                                            ₹{monthly.toLocaleString()}/mo
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button onClick={confirmPayment} className="w-full py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                                    Pay Securely
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* SUCCESS MODAL */}
            <AnimatePresence>
                {isSuccessOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="relative bg-deep-navy border border-emerald-500/30 rounded-3xl p-10 max-w-sm w-full text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-white mb-2">Payment Successful!</h2>
                            <p className="text-white/60 mb-8">
                                Your payment of <span className="text-white font-bold">₹{selectedMilestone?.amount.toLocaleString()}</span> has been received.
                            </p>

                            <Button onClick={() => setIsSuccessOpen(false)} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                                Continue
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default CustomerPayments;
