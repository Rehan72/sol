import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Sun, Landmark, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_SUBSIDY_DETAILS } from '../../data/mockData';

const CustomerBenefits = () => {
    const navigate = useNavigate();
    const [subsidy] = useState(MOCK_SUBSIDY_DETAILS);

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
                <div className="mb-12 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white">Benefits & Subsidy</h1>
                        <p className="text-white/50">Track government incentives and tax details</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* GST Breakdown Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-[80px]" />
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                <Coins className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">GST Breakdown</h2>
                                <p className="text-sm text-white/40">Tax paid on your system</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-white/60">System Cost</span>
                                <span className="font-bold text-white">₹3,00,000</span>
                            </div>
                            <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-white/60">GST Rate (Renewable)</span>
                                <span className="font-bold text-purple-400">5%</span>
                            </div>
                             <div className="flex justify-between p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <span className="text-purple-300 font-bold">GST Amount</span>
                                <span className="font-black text-white text-lg">₹15,000</span>
                            </div>
                             <div className="flex justify-between px-4 pt-2">
                                <span className="text-xs text-white/40">Total Paid (Inclusive)</span>
                                <span className="font-mono text-white/80">₹3,15,000</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Subsidy Tracking Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.2 }}
                        className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-solar-yellow/5 to-transparent relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-32 bg-solar-yellow/5 rounded-full blur-[80px]" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-solar-yellow/20 text-solar-yellow flex items-center justify-center">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Government Subsidy</h2>
                                <p className="text-sm text-white/40">PM Surya Ghar Muft Bijli Yojana</p>
                            </div>
                        </div>

                        <div className="mb-8 text-center p-6 bg-solar-yellow/10 rounded-2xl border border-solar-yellow/20">
                            <p className="text-xs text-solar-yellow uppercase font-bold tracking-widest mb-1">Eligible Amount</p>
                            <p className="text-4xl font-black text-white">₹{subsidy.eligibleAmount.toLocaleString()}</p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-6 relative ml-2">
                             <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                            
                            {subsidy.timeline.map((item, idx) => (
                                <div key={idx} className="relative flex items-center gap-4">
                                    <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                        item.completed ? 'bg-emerald-500 border-emerald-500 text-deep-navy' : 'bg-deep-navy border-white/20 text-transparent'
                                    }`}>
                                        {item.completed && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                    <div className={item.completed ? 'opacity-100' : 'opacity-40'}>
                                        <p className="font-bold text-white text-sm">{item.status}</p>
                                        {item.date ? (
                                             <p className="text-xs text-white/50">{item.date}</p>
                                        ) : (
                                            <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" /> Pending
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CustomerBenefits;
