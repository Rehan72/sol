import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    MapPin,
    Home,
    User,
    ArrowRight,
    Search,
    Filter,
    CheckCircle2,
    Calendar,
    X,
    Clipboard,
    Wallet,
    Plus,
    Loader2,
    Users
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import DateTimePicker from '../../components/ui/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { getSolarRequests, assignSurvey } from '../../api/customer';
import { getTeams } from '../../api/teams';
import { approveQuotation, finalApproveQuotation } from '../../api/quotations';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';

const SolarRequests = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [modalType, setModalType] = useState(null); // 'assign_survey' | 'create_quote' | 'create_lead'

    console.log(leads, "leads");
    console.log(useAuthStore.getState().role, "selectedLead");
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const { addToast } = useToast();

    const [newLead, setNewLead] = useState({ name: '', location: '', type: 'Residential', bill: '' });
    const [surveyDate, setSurveyDate] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getSolarRequests();
                // Map backend data to frontend structure
                const mappedLeads = data.map(customer => ({
                    id: customer.id,
                    name: customer.name || 'Unknown',
                    location: customer.city ? `${customer.city}, ${customer.state || ''}` : 'Location Pending',
                    type: customer.propertyType || 'Residential',
                    bill: customer.billRange ? `~${customer.billRange}` : 'Not provided',
                    status: mapStatus(customer),
                    latestQuotationStatus: customer.latestQuotationStatus,
                    latestQuotationId: customer.latestQuotationId,
                    date: new Date(customer.createdAt).toLocaleDateString(),
                    // Mocking some fields for now as they might not exist in backend yet or need complex logic
                    feasibility: 'Pending'
                }));
                setLeads(mappedLeads);
            } catch (error) {
                console.error("Failed to fetch solar requests:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTeams = async () => {
            try {
                const data = await getTeams({ type: 'SURVEY' });
                const teamOptions = data.map(team => ({
                    value: team.id,
                    label: `${team.name} (${team.status})`
                }));
                setTeams(teamOptions);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        }

        fetchLeads();
        fetchTeams();
    }, []);

    const mapStatus = (customer) => {
        // Higher Priority: Quotation Workflow
        if (customer.latestQuotationStatus === 'FINAL_APPROVED') return 'Final Approved';
        if (customer.latestQuotationStatus === 'REGION_APPROVED') return 'Approved (Region)';
        if (customer.latestQuotationStatus === 'PLANT_APPROVED') return 'Approved (Plant)';
        if (customer.latestQuotationStatus === 'SUBMITTED') return 'Quotation Submitted';
        if (customer.latestQuotationStatus === 'REJECTED') return 'Quotation Rejected';
        if (customer.latestQuotationStatus === 'DRAFT') return 'Survey Completed';

        // Lower Priority: Installation/Survey Workflow
        if (customer.installationStatus === 'QUOTATION_READY' || customer.installationStatus === 'SURVEY_COMPLETED') return 'Survey Completed';
        if (customer.surveyStatus === 'ASSIGNED') return 'Survey Assigned';
        if (customer.installationStatus === 'ONBOARDED') return 'New Request';

        return customer.installationStatus || 'Unknown';
    };

    const handleAction = (lead) => {
        setSelectedLead(lead);
        if (lead.status === 'New Request') {
            setModalType('assign_survey');
        } else if (lead.status === 'Survey Completed') {
            if (lead.latestQuotationId) {
                navigate(`/quotations/${lead.latestQuotationId}`);
            } else {
                setModalType('create_quote');
            }
        } else if (lead.status === 'Quotation Submitted' || lead.status === 'Approved (Plant)' || lead.status === 'Approved (Region)') {
            if (lead.latestQuotationId) {
                navigate(`/quotations/${lead.latestQuotationId}`);
            }
        }
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedLead(null);
        setSurveyDate(null);
        setSelectedTeamId('');
        setNewLead({ name: '', location: '', type: 'Residential', bill: '' });
    };

    const handleCreateLead = () => {
        // TODO: Implement backend creation if needed, for now just local update for UI demo if manual creation is allowed
        // Ideally this should call an API
        const createdLead = {
            id: leads.length + 1, // Temp ID
            name: newLead.name,
            location: newLead.location,
            type: newLead.type,
            bill: `₹${newLead.bill}`,
            status: 'New Request',
            date: 'Just now'
        };
        setLeads([createdLead, ...leads]);
        closeModal();
    };

    const handleAssignSurvey = async () => {
        if (!selectedTeamId || !selectedLead) return;
        try {
            await assignSurvey(selectedLead.id, selectedTeamId);
            addToast("Survey Team Assigned!", 'success');

            // Update local state
            setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: 'Survey Assigned' } : l));
            closeModal();
        } catch (error) {
            console.error(error);
            addToast("Failed to assign team", 'error');
        }
    };

    const handleQuickApprove = async (lead) => {
        console.log("Quick Approve Lead:", lead);
        try {
            setIsLoading(true);



            if (lead.latestQuotationStatus === 'REGION_APPROVED') {
                await finalApproveQuotation(lead.latestQuotationId);
            } else {
                await approveQuotation(lead.latestQuotationId, "Quick approved from Solar Requests page Plant Admin");
            }
            addToast("Quotation Approved successfully!", 'success');

            // Refresh leads
            const data = await getSolarRequests();
            const mappedLeads = data.map(customer => ({
                id: customer.id,
                name: customer.name || 'Unknown',
                location: customer.city ? `${customer.city}, ${customer.state || ''}` : 'Location Pending',
                type: customer.propertyType || 'Residential',
                bill: customer.billRange ? `~${customer.billRange}` : 'Not provided',
                status: mapStatus(customer),
                latestQuotationStatus: customer.latestQuotationStatus,
                latestQuotationId: customer.latestQuotationId,
                date: new Date(customer.createdAt).toLocaleDateString(),
                feasibility: 'Pending'
            }));
            setLeads(mappedLeads);
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || "Failed to approve quotation", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-solar-yellow animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            Solar <span className="text-solar-yellow">Requests</span>
                        </h1>
                        <p className="text-white/50">Manage incoming installation leads from customers.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-white/5 border border-white/10 rounded-xl p-3 items-center gap-2 w-64">
                            <Search className="w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-white/20"
                            />
                        </div>
                        <Button
                            onClick={() => setModalType('create_lead')}
                            className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold flex items-center gap-2 px-6"
                        >
                            <Plus className="w-5 h-5" /> New Request
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {leads.map((lead, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={lead.id}
                            className="glass p-6 rounded-2xl border border-white/5 hover:border-solar-yellow/30 transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/40">
                                    {lead.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{lead.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.location}</span>
                                        <span className="flex items-center gap-1"><Home className="w-3 h-3" /> {lead.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs uppercase font-bold text-white/30">Est. Bill</p>
                                    <p className="font-mono font-bold text-solar-yellow">{lead.bill}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase font-bold text-white/30">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${lead.status === 'New Request' ? 'bg-solar-yellow/10 text-solar-yellow border border-solar-yellow/20' :
                                        lead.status === 'Survey Assigned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            lead.status === 'Survey Completed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                lead.status === 'Quotation Submitted' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                    lead.status.includes('Approved') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        'bg-white/10 text-white/60'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </div>                                          
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => handleAction(lead)}
                                        className={`min-w-[140px] border border-white/10 text-white ${lead.status === 'New Request' ? 'bg-solar-yellow text-deep-navy hover:bg-gold font-bold border-none' :
                                            lead.status === 'Survey Completed' ? 'bg-indigo-600 hover:bg-indigo-700 font-bold border-none' :
                                                'bg-white/5 hover:bg-white/10'
                                            }`}
                                        disabled={false}
                                    >
                                        {lead.status === 'New Request' && <>Assign Survey <ArrowRight className="w-4 h-4 ml-2" /></>}
                                        {lead.status === 'Survey Assigned' && (
                                            <div onClick={(e) => { e.stopPropagation(); navigate('/installation-workflow'); }} className="flex items-center cursor-pointer">
                                                View Workflow <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        )}
                                        {lead.status === 'Survey Completed' && <><Wallet className="w-4 h-4 mr-2" /> {lead.latestQuotationId ? 'Review Quote' : 'Create Quote'}</>}
                                        {lead.status === 'Quotation Submitted' && <><FileText className="w-4 h-4 mr-2" /> View Quote</>}
                                        {lead.status.includes('Approved') && <><CheckCircle2 className="w-4 h-4 mr-2" /> Verified</>}
                                    </Button>

                                    {/* Quick Approve Buttons for different stages/roles */}
                                    {((lead.status === 'Survey Completed' && (useAuthStore.getState()?.role === 'PLANT_ADMIN' || useAuthStore.getState()?.role === 'SUPER_ADMIN')) ||
                                        (lead.status === 'Quotation Submitted' && (useAuthStore.getState()?.role === 'PLANT_ADMIN' || useAuthStore.getState()?.role === 'SUPER_ADMIN')) ||
                                        (lead.status === 'Approved (Plant)' && (useAuthStore.getState()?.role === 'REGION_ADMIN' || useAuthStore.getState()?.role === 'SUPER_ADMIN')) ||
                                        (lead.status === 'Approved (Region)' && useAuthStore.getState()?.role === 'SUPER_ADMIN')) && (
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); handleQuickApprove(lead); }}
                                                className="min-w-[140px] bg-emerald-500 text-deep-navy font-bold hover:bg-emerald-400 border-none"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {lead.latestQuotationStatus === "DRAFT" ? 'Approve (Plant)' :
                                                    lead.latestQuotationStatus === "PLANT_APPROVED" ? 'Approve (Region)' :
                                                        'Final Approve'}
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* MODALS */}
                <AnimatePresence>
                    {modalType === 'create_lead' && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl z-10">
                                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-solar-yellow" /> Create Solar Request
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Customer Name</label>
                                        <input
                                            type="text"
                                            value={newLead.name}
                                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                            placeholder="e.g. Anil Gupta"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Location</label>
                                            <input
                                                type="text"
                                                value={newLead.location}
                                                onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Est. Bill Amount</label>
                                            <input
                                                type="number"
                                                value={newLead.bill}
                                                onChange={(e) => setNewLead({ ...newLead, bill: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                                placeholder="e.g. 5000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Property Type</label>
                                        <select
                                            value={newLead.type}
                                            onChange={(e) => setNewLead({ ...newLead, type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                        >
                                            <option value="Residential">Residential</option>
                                            <option value="Office">Office / Commercial</option>
                                            <option value="Industrial">Industrial</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={closeModal} className="flex-1 text-white/50">Cancel</Button>
                                    <Button onClick={handleCreateLead} className="flex-1 bg-solar-yellow text-deep-navy font-bold hover:bg-gold">Create Request</Button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {modalType === 'assign_survey' && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl z-10">
                                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                    <Clipboard className="w-5 h-5 text-solar-yellow" /> Assign Survey Team
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Customer</label>
                                        <div className="p-3 bg-white/5 rounded-lg text-white font-bold">{selectedLead?.name}</div>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <Select
                                                name="teamSelect"
                                                label="Select Team"
                                                value={selectedTeamId}
                                                onChange={(e) => setSelectedTeamId(e.target.value)}
                                                options={teams}
                                                icon={Users}
                                                placeholder="Select a team..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Schedule Date</label>
                                        <DateTimePicker
                                            mode="single"
                                            placeholder="Select Date"
                                            value={surveyDate}
                                            onChange={setSurveyDate}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={closeModal} className="flex-1 text-white/50">Cancel</Button>
                                    <Button onClick={handleAssignSurvey} className="flex-1 bg-solar-yellow text-deep-navy font-bold hover:bg-gold">Assign & Notify</Button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {modalType === 'create_quote' && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-2xl shadow-2xl z-10">
                                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-emerald-400" /> Create Quotation
                                </h2>

                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-emerald-400 font-bold text-sm">Survey Outcome: Feasible</p>
                                        <p className="text-white/60 text-xs">Recommended Capacity: 5 kW</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>

                                <div className="space-y-4 mb-6 grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">System Capacity</label>
                                        <input type="text" defaultValue="5 kW" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Solar Panels Cost</label>
                                        <input type="number" defaultValue="180000" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Inverter Cost</label>
                                        <input type="number" defaultValue="60000" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Installation & Structure</label>
                                        <input type="number" defaultValue="60000" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Govt Submission (Est)</label>
                                        <input type="number" defaultValue="78000" className="w-full bg-white/5 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 font-bold" />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 uppercase font-bold">Total Customer Payable</p>
                                        <p className="text-2xl font-black text-white">₹2,22,000</p>
                                    </div>
                                    <Button className="bg-emerald-500 text-white font-bold hover:bg-emerald-600 px-8">
                                        Send to Customer
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SolarRequests;
