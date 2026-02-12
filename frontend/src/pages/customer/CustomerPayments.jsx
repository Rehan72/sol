import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Wallet,
    CheckCircle2,
    Lock,
    ShieldCheck,
    Banknote,
    Calculator,
    Loader2,
    Smartphone,
    CreditCard,
    Globe,
    BanknoteIcon,
    AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_EMI_PLANS } from '../../data/mockData';
import { getCustomerProfile } from '../../api/customer';
import { createRazorpayOrder, makeRazorpayPayment, getCustomerPayments } from '../../api/payments';
import { useToast } from '../../hooks/useToast';

const CustomerPayments = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [quotation, setQuotation] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [emiPlan, setEmiPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await getCustomerProfile();

            // Fetch actual payments from database
            let payments = [];
            try {
                const paymentData = await getCustomerPayments(profile.id);
                payments = paymentData.data || [];
            } catch (err) {
                console.warn('Could not fetch payments:', err);
            }

            if (profile.quotation && profile.quotation.total > 0) {
                setQuotation(profile.quotation);
                generateMilestones(profile.quotation, profile.surveyStatus, profile.installationStatus, payments);
            } else {
                setQuotation(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            addToast("Failed to load payment details.", "error");
        } finally {
            setLoading(false);
        }
    };

    const generateMilestones = (q, surveyStatus, installationStatus, payments = []) => {
        const total = q.total || q.totalProjectCost;
        if (!total) return []; // Safety check

        const baseDate = q.createdAt ? new Date(q.createdAt) : new Date();
        const formatDate = (date) => {
            if (!date) return new Date().toISOString().split('T')[0];
            if (typeof date === 'string') return date.split('T')[0];
            try {
                return new Date(date).toISOString().split('T')[0];
            } catch {
                return new Date().toISOString().split('T')[0];
            }
        };

        // Helper to add days
        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        // Check which milestones are already paid in database
        const paidMilestones = payments
            .filter(p => p.status === 'COMPLETED')
            .map(p => p.milestoneId);

        // Determine which milestones should be unlocked
        // M1 is DUE if survey is completed and not paid
        // M2 is DUE if M1 is paid AND installation has started
        // M3 is DUE if M2 is paid
        // M4 is DUE if M3 is paid

        const isM1Paid = paidMilestones.includes('M1');
        const isM2Paid = paidMilestones.includes('M2');
        const isM3Paid = paidMilestones.includes('M3');

        const isM2Unlocked = isM1Paid && [
            'INSTALLATION_READY',
            'INSTALLATION_SCHEDULED',
            'INSTALLATION_STARTED',
            'INSTALLATION_COMPLETED',
            'QC_PENDING',
            'QC_APPROVED',
            'QC_REJECTED',
            'COMMISSIONING',
            'COMPLETED'
        ].includes(installationStatus);

        const isM3Unlocked = isM2Paid && [
            'INSTALLATION_COMPLETED',
            'QC_PENDING',
            'QC_APPROVED',
            'QC_REJECTED',
            'COMMISSIONING',
            'COMPLETED'
        ].includes(installationStatus);

        const isM4Unlocked = isM3Paid && [
            'QC_APPROVED',
            'COMMISSIONING',
            'COMPLETED'
        ].includes(installationStatus);

        const dynamicMilestones = [
            {
                id: "M1",
                name: "Survey Completion",
                amount: Math.round(total * 0.25),
                status: paidMilestones.includes('M1') ? "PAID" :
                    (['COMPLETED', 'APPROVED'].includes(surveyStatus) || installationStatus === 'QUOTATION_READY' ? "DUE" : "LOCKED"),
                description: "Payment after successful site survey and quotation approval",
                date: paidMilestones.includes('M1') ? formatDate(payments.find(p => p.milestoneId === 'M1')?.createdAt) : formatDate(baseDate)
            },
            {
                id: "M2",
                name: "Installation Start",
                amount: Math.round(total * 0.4),
                status: paidMilestones.includes('M2') ? "PAID" :
                    (isM2Unlocked ? "DUE" : "LOCKED"),
                description: "Required before mobilization of material",
                date: paidMilestones.includes('M2') ? formatDate(payments.find(p => p.milestoneId === 'M2')?.createdAt) : formatDate(addDays(baseDate, 15))
            },
            {
                id: "M3",
                name: "Installation Complete",
                amount: Math.round(total * 0.25),
                status: paidMilestones.includes('M3') ? "PAID" :
                    (isM3Unlocked ? "DUE" : "LOCKED"),
                description: "Payable after physical installation is done",
                date: paidMilestones.includes('M3') ? formatDate(payments.find(p => p.milestoneId === 'M3')?.createdAt) : formatDate(addDays(baseDate, 45))
            },
            {
                id: "M4",
                name: "Commissioning",
                amount: Math.round(total * 0.1),
                status: paidMilestones.includes('M4') ? "PAID" :
                    (isM4Unlocked ? "DUE" : "LOCKED"),
                description: "Final payment after net metering & go-live",
                date: paidMilestones.includes('M4') ? formatDate(payments.find(p => p.milestoneId === 'M4')?.createdAt) : formatDate(addDays(baseDate, 60))
            },
        ];
        setMilestones(dynamicMilestones);
    };

    // Calculate Totals
    const totalCost = milestones.reduce((sum, m) => sum + m.amount, 0);
    const totalPaid = milestones.filter(m => m.status === 'PAID').reduce((sum, m) => sum + m.amount, 0);
    const totalRemaining = totalCost - totalPaid;
    const progress = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

    const handlePayClick = (milestone) => {
        setSelectedMilestone(milestone);
        setIsPaymentModalOpen(true);
    };

    const confirmPayment = async () => {
        // Prevent duplicate payments for the same milestone
        if (selectedMilestone?.status === 'PAID' || isProcessing) {
            addToast("This milestone has already been paid.", "info");
            setIsPaymentModalOpen(false);
            return;
        }

        try {
            setIsProcessing(true);

            // Get customer profile data for payment tracking
            const profile = await getCustomerProfile();

            // Check if already paid for this milestone
            const existingPayment = milestones.find(m => m.id === selectedMilestone.id && m.status === 'PAID');
            if (existingPayment) {
                addToast("This milestone has already been paid.", "info");
                setIsPaymentModalOpen(false);
                setIsProcessing(false);
                return;
            }

            // Create order first
            const order = await createRazorpayOrder(selectedMilestone.amount, `receipt_${selectedMilestone.id}`);

            // Call make-payment API - now includes customerId and plantAdminId
            const paymentResult = await makeRazorpayPayment(
                order.id,
                selectedMilestone.id,
                profile.id,  // customerId
                profile.plantDetails?.plantAdminId || profile.plantAdminId,  // plantAdminId
                profile.plantDetails?.id || profile.plant?.id,  // plantId
                profile.quotation?.id,  // quotationId
                selectedMilestone.amount  // amount
            );

            setIsPaymentModalOpen(false);
            setIsSuccessOpen(true);

            // Refresh profile to get updated payment status
            await fetchProfile();

            addToast(paymentResult.message || "Your payment has been processed.", "success");
        } catch (error) {
            console.error('Payment Error:', error);
            addToast(error.response?.data?.message || "Failed to process payment.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-solar-yellow animate-spin" />
            </div>
        );
    }

    if (!quotation) {
        return (
            <div className="min-h-screen bg-deep-navy text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                    <AlertTriangle className="w-12 h-12 text-solar-yellow/50" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-4">No Payment Data Found</h2>
                <p className="text-white/50 max-w-md">Payments will be enabled once your site survey is completed and a quotation is approved.</p>
                <Button onClick={() => navigate(-1)} className="mt-8 bg-white/10 hover:bg-white/20 border border-white/5">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Cinematic Background */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            <div className="relative z-10 p-6 md:p-12  mx-auto w-full flex-1">
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
                        <div className="glass rounded-3xl p-6 border border-white/5 bg-linear-to-br from-white/5 to-transparent relative overflow-hidden">
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
                                            className="h-full bg-linear-to-r from-emerald-500 to-solar-yellow"
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
                                className={`glass rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group ${milestone.status === 'DUE'
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
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${milestone.status === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' :
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
                                            <p className={`text-[10px] uppercase font-bold tracking-wider ${milestone.status === 'PAID' ? 'text-emerald-400' :
                                                milestone.status === 'DUE' ? 'text-solar-yellow' :
                                                    'text-white/30'
                                                }`}>
                                                {milestone.status}
                                            </p>
                                        </div>

                                        {milestone.status === 'DUE' && (
                                            <Button
                                                onClick={() => handlePayClick(milestone)}
                                                disabled={isProcessing}
                                                className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-yellow/90 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                            >
                                                {isProcessing ? 'Processing...' : 'Pay Now'}
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
                            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

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
                                                className={`flex items-center gap-4 p-4 rounded-xl border bg-black/20 cursor-pointer transition-all group ${paymentMethod === method
                                                    ? 'border-solar-yellow bg-solar-yellow/5'
                                                    : 'border-white/5 hover:border-solar-yellow/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === method}
                                                    onChange={() => { }}
                                                    className="w-4 h-4 accent-solar-yellow"
                                                />
                                                <div className="flex-1 flex items-center gap-3">
                                                    {i === 0 ? <Smartphone className="w-5 h-5 text-white/70" /> :
                                                        i === 1 ? <CreditCard className="w-5 h-5 text-white/70" /> :
                                                            i === 2 ? <Globe className="w-5 h-5 text-white/70" /> :
                                                                <BanknoteIcon className="w-5 h-5 text-white/70" />}
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
                                                            const interestAmt = (selectedMilestone.amount * plan.interest * (plan.months / 12)) / 100;
                                                            const totalAmt = selectedMilestone.amount + interestAmt;
                                                            const monthly = Math.round(totalAmt / plan.months);

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    onClick={() => setEmiPlan(plan)}
                                                                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${emiPlan === plan
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

                                <Button
                                    onClick={confirmPayment}
                                    disabled={isProcessing}
                                    className="w-full py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Pay Securely'}
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
