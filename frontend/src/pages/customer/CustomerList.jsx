import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Plus,
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getAllCustomers } from '../../api/customer';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status, type) => {
        if (!status) return 'border-white/10 text-white/40 bg-white/5';
        
        const s = status.toUpperCase();
        
        switch(type) {
            case 'survey':
                if (s === 'COMPLETED') return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
                if (s === 'ASSIGNED' || s === 'IN_PROGRESS') return 'border-solar-yellow/50 text-solar-yellow bg-solar-yellow/10';
                return 'border-white/10 text-white/40 bg-white/5';
            
            case 'quotation':
                if (['PLANT_APPROVED', 'REGION_APPROVED', 'FINAL_APPROVED'].includes(s)) return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
                if (['SUBMITTED', 'PENDING'].includes(s)) return 'border-solar-yellow/50 text-solar-yellow bg-solar-yellow/10';
                if (s === 'REJECTED') return 'border-red-500/50 text-red-400 bg-red-500/10';
                return 'border-white/10 text-white/40 bg-white/5';
            
            case 'installation':
                if (s === 'COMPLETED' || s === 'LIVE') return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
                if (['INSTALLATION_STARTED', 'INSTALLATION_SCHEDULED', 'INSTALLATION_READY', 'COMMISSIONING'].includes(s)) return 'border-solar-yellow/50 text-solar-yellow bg-solar-yellow/10';
                return 'border-white/10 text-white/40 bg-white/5';
                
            default:
                return 'border-white/10 text-white/40 bg-white/5';
        }
    };

    return (
        <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

            {/* --- Premium Header Area --- */}
            <div className="relative z-10 px-6 md:px-12 py-8 mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-solar-yellow rounded-full" />
                            <span className="text-solar-yellow text-[10px] font-black uppercase tracking-[0.4em]">
                                Administration Control
                            </span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
                            Customer <span className="text-solar-yellow italic">Directory</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-solar-yellow transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-14 pr-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm w-full md:w-80 focus:w-full md:focus:w-96 transition-all focus:outline-none focus:border-solar-yellow/40 glass backdrop-blur-xl"
                            />
                        </div>
                        {/* <Button
                            onClick={() => navigate('/customer/create')}
                            className="bg-linear-to-r from-solar-yellow to-gold text-deep-navy font-black uppercase tracking-[0.15em] px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all flex items-center gap-3 h-auto group"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-[10px]">Add New Customer</span>
                        </Button> */}
                         <Button
                                                    onClick={() => navigate('/customer/create')}
                                                    className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold flex items-center gap-2 px-6"
                                                >
                                                    <Plus className="w-5 h-5" /> New Customer
                                                </Button>
                    </div>
                </div>

                {/* List Content */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-40 glass rounded-[2.5rem] border border-white/5 bg-white/5">
                            <div className="relative inline-block">
                                <Users className="w-20 h-20 mx-auto mb-8 text-solar-yellow/10" />
                                <div className="absolute inset-0 bg-solar-yellow/20 blur-3xl animate-pulse rounded-full" />
                            </div>
                            <h3 className="text-2xl font-black text-white/30 uppercase tracking-[0.2em] animate-pulse">Syncing Repository</h3>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-40 glass rounded-[2.5rem] border border-white/5 border-dashed bg-white/5">
                            <Users className="w-20 h-20 mx-auto mb-8 text-white/5" />
                            <h3 className="text-2xl font-black text-white/20 uppercase tracking-[0.2em]">Repository Empty</h3>
                            <p className="text-white/10 text-xs mt-4 font-bold tracking-widest">NO CUSTOMER RECORDS MATCHING CURRENT CRITERIA</p>
                        </div>
                    ) : (
                        filteredCustomers.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04, duration: 0.5 }}
                                className="group relative"
                            >
                                <div className="glass p-8 rounded-[1rem] border border-white/5 hover:border-solar-yellow/20 hover:bg-white/10 transition-all duration-500 cursor-default flex flex-col xl:flex-row items-center justify-between gap-10 overflow-hidden">
                                    {/* Left Hover Indicator */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                                    
                                    {/* Brand/Avatar Block */}
                                    <div className="flex items-center gap-8 flex-1 min-w-0 w-full">
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-linear-to-br from-solar-yellow/20 to-transparent flex items-center justify-center border-2 border-solar-yellow shadow-[0_0_20px_rgba(255,215,0,0.05)] shrink-0 group-hover:rotate-3 transition-transform">
                                            <span className="font-black text-2xl text-solar-yellow italic">
                                                {(customer.name || 'U').charAt(0)}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                                <h3 className="font-black text-3xl text-white tracking-tighter uppercase truncate leading-none">
                                                    {customer.name || 'Anonymous User'}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-[0.15em] border ${getStatusColor(customer.surveyStatus, 'survey')}`}>
                                                        Survey: {customer.surveyStatus || 'PENDING'}
                                                    </span>
                                                    <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-[0.15em] border ${getStatusColor(customer.latestQuotationStatus, 'quotation')}`}>
                                                        Quote: {customer.latestQuotationStatus || 'PENDING'}
                                                    </span>
                                                    <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-[0.15em] border ${getStatusColor(customer.installationStatus, 'installation')}`}>
                                                        Status: {customer.installationStatus || 'PENDING'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] text-white/30 font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2.5 group/item">
                                                    <Mail className="w-4 h-4 text-solar-yellow/40 group-hover/item:text-solar-yellow transition-colors" /> 
                                                    <span className="group-hover/item:text-white/60 transition-colors">{customer.email || 'NOT REGISTERED'}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 group/item">
                                                    <Phone className="w-4 h-4 text-solar-yellow/40 group-hover/item:text-solar-yellow transition-colors" /> 
                                                    <span className="group-hover/item:text-white/60 transition-colors">{customer.phone || 'NOT REGISTERED'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Details Block */}
                                    <div className="flex xl:flex-col items-center xl:items-end gap-8 xl:gap-4 py-6 xl:py-2 px-10 xl:px-14 border-y xl:border-y-0 xl:border-l border-white/5 w-full xl:w-auto bg-white/5 xl:bg-transparent rounded-2xl">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                <MapPin className="w-5 h-5 text-solar-yellow opacity-60" />
                                            </div>
                                            <div className="text-right xl:text-left flex-1 min-w-[120px]">
                                                <p className="text-white font-black text-lg uppercase tracking-tight leading-none mb-1">
                                                    {customer.city || 'Global'}
                                                </p>
                                                <p className="text-white/30 text-[9px] uppercase font-black tracking-[0.2em]">
                                                    {customer.state || 'Region'} • {customer.country || 'International'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Engagement/Actions Block */}
                                    <div className="flex items-center gap-10 pl-0 xl:pl-14 xl:border-l border-white/5 shrink-0 w-full xl:w-auto justify-between xl:justify-end">
                                        <div className="flex flex-col items-center group/stat">
                                            <div className="text-3xl font-black text-white group-hover:text-solar-yellow transition-colors leading-none mb-2">
                                                {customer.plant?.id ? 1 : 0}
                                            </div>
                                            <div className="text-[8px] text-white/20 uppercase font-black tracking-[0.25em] whitespace-nowrap">Asset Count</div>
                                        </div>

                                        <Button 
                                            variant="outline" 
                                            className="bg-white/5 border-white/10 hover:border-solar-yellow text-white/40 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl transition-all flex items-center gap-2 h-auto group/btn shadow-inner hover:bg-solar-yellow/5"
                                        >
                                            View Profile <MoreVertical className="w-3.5 h-3.5 opacity-30 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerList;