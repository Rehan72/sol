import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, Shield, Crown, 
  ArrowRight, Activity, Box 
} from 'lucide-react';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';

const SubscriptionPlans = () => {
    const [currentTier, setCurrentTier] = useState('BASIC');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const plans = [
        {
            id: 'BASIC',
            name: 'Basic',
            price: 'Free',
            icon: Shield,
            color: 'white/40',
            features: [
                'Basic Plant Management',
                'Survey & Installation Tracking',
                'Standard Reports'
            ]
        },
        {
            id: 'PRO',
            name: 'Professional',
            price: '$49/mo',
            icon: Zap,
            color: 'solar-yellow',
            featured: true,
            features: [
                'Everything in Basic',
                'Live Telemetry & Monitoring',
                'Efficiency Anomaly Alerts',
                'ROI Intelligence'
            ]
        },
        {
            id: 'ELITE',
            name: 'Elite',
            price: '$129/mo',
            icon: Crown,
            color: 'solar-yellow',
            features: [
                'Everything in Pro',
                '3D Digital Twin Interface',
                'Predictive Maintenance AI',
                'Inventory Smart Alerts'
            ]
        }
    ];

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await client.get('/subscription/status');
                setCurrentTier(res.data.subscriptionTier);
            } catch (error) {
                console.error('Failed to fetch subscription status');
            }
        };
        fetchStatus();
    }, []);

    const handleUpgrade = async (tier) => {
        setLoading(true);
        try {
            await client.post('/subscription/upgrade', { tier });
            setCurrentTier(tier);
            showToast(`Standardized to ${tier} plan!`, 'success');
        } catch (error) {
            showToast('Upgrade failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-6 relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10 text-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
                        CHOOSE YOUR <span className="text-solar-yellow">POWER</span>
                    </h1>
                    <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
                        Scale your solar operations with intelligent infrastructure
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass p-8 rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col ${plan.featured ? 'ring-2 ring-solar-yellow shadow-[0_0_50px_rgba(255,215,0,0.1)]' : ''}`}
                        >
                            {plan.featured && (
                                <div className="absolute top-6 right-8 bg-solar-yellow text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl bg-${plan.color}/10 flex items-center justify-center mb-8 border border-${plan.color}/20 text-${plan.color}`}>
                                <plan.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black uppercase mb-1">{plan.name}</h3>
                            <div className="mb-8">
                                <span className="text-4xl font-black">{plan.price}</span>
                                {plan.price !== 'Free' && <span className="text-white/40 text-sm">/month</span>}
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3 text-sm text-white/70">
                                        <div className="bg-emerald-500/20 p-1 rounded-full">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={currentTier === plan.id || loading}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                                    currentTier === plan.id 
                                    ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                    : 'bg-solar-yellow text-black hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,215,0,0.2)]'
                                }`}
                            >
                                {currentTier === plan.id ? 'Current Plan' : 'Select Plan'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
