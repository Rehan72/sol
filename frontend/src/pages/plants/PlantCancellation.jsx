import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, AlertTriangle, CheckCircle2, XCircle, Sun, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/button';

const PlantCancellation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [request, setRequest] = useState({
        customer: "Rahul Kumar",
        stage: "Survey Completed",
        paidAmount: 50000,
        refundAmount: 15000,
        fee: 5000,
        reason: "Changed plans due to relocation.",
        status: "PENDING"
    });

    const handleAction = (status) => {
        // Simulate API call
        setRequest(prev => ({ ...prev, status }));
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

            <div className="relative z-10 p-6 md:p-12 max-w-3xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white">Cancellation Request</h1>
                        <p className="text-white/50">Review and process refund for Plant #{id || 'Generic'}</p>
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/5 bg-white/5">
                    {/* Customer Info */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                         <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/50">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{request.customer}</h2>
                            <p className="text-sm text-white/40">Status: <span className={`font-bold ${
                                request.status === 'PENDING' ? 'text-solar-yellow' : 
                                request.status === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'
                            }`}>{request.status}</span></p>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 bg-black/20 rounded-2xl border border-white/5">
                             <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-4">Project Financials</p>
                             <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Stage</span>
                                    <span className="font-bold text-white">{request.stage}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Paid Amount</span>
                                    <span className="font-mono text-white">₹{request.paidAmount.toLocaleString()}</span>
                                </div>
                             </div>
                        </div>

                        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                             <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest mb-4">Refund Calculation</p>
                             <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Eligible Refund</span>
                                    <span className="font-mono text-white">₹{(request.paidAmount - request.fee).toLocaleString()}</span>
                                </div>
                                 <div className="flex justify-between text-sm text-red-300">
                                    <span>Cancellation Fee</span>
                                    <span className="font-mono">- ₹{request.fee.toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-white font-bold">Net Refund</span>
                                    <span className="text-xl font-black text-white">₹{request.refundAmount.toLocaleString()}</span>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-2">Customer Reason</p>
                        <p className="text-white/80 italic">"{request.reason}"</p>
                    </div>

                    {/* Actions */}
                    {request.status === 'PENDING' ? (
                        <div className="flex gap-4">
                            <Button 
                                onClick={() => handleAction('REJECTED')}
                                className="flex-1 py-6 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-bold"
                            >
                                <XCircle className="w-5 h-5 mr-2" /> Reject
                            </Button>
                            <Button 
                                onClick={() => handleAction('APPROVED')}
                                className="flex-1 py-6 bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 font-bold"
                            >
                                <CheckCircle2 className="w-5 h-5 mr-2" /> Approve Refund
                            </Button>
                        </div>
                    ) : (
                        <div className={`p-4 rounded-xl text-center border ${
                            request.status === 'APPROVED' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            <p className="font-bold mb-1">Request {request.status === 'APPROVED' ? 'Approved' : 'Rejected'}</p>
                            <p className="text-xs opacity-70">
                                {request.status === 'APPROVED' ? 'Refund process initiated.' : 'Customer notified of rejection.'}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PlantCancellation;
