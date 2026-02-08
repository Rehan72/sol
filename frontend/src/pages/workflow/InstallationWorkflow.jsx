import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Clock,
    Map,
    Users,
    AlertCircle,
    Calendar,
    ChevronRight,
    FileText,
    Camera,
    Upload,
    Zap,
    Hammer,
    Lock,
    PlayCircle,
    MoreHorizontal,
    X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import SurveyReport from '../../components/reports/SurveyReport'; // Importing SurveyReport
import { useParams } from 'react-router-dom';
import { getWorkflow, initWorkflow, updateWorkflowStep } from '../../api/workflow';
import { getCustomerProfile } from '../../api/customer';

// --- Constants & Mock Data ---

const PHASES = [
    { id: 'survey', label: 'Survey', description: 'Feasibility & Planning' },
    { id: 'installation', label: 'Installation', description: 'Execution Phase' },
    { id: 'commissioning', label: 'Commissioning', description: 'Testing & Handoff' },
    { id: 'live', label: 'Live', description: 'Monitoring' }
];

const INSTALLATION_STEPS = [
    { id: 'mounting', label: 'Mounting', status: 'completed', date: '2023-10-18', completedBy: 'Installation Team Alpha' },
    { id: 'inverter', label: 'Inverter', status: 'in_progress', date: null, completedBy: null },
    { id: 'wiring', label: 'Wiring', status: 'pending', date: null, completedBy: null },
    { id: 'inspection', label: 'QC Inspection', status: 'pending', date: null, completedBy: null },
];

const INSTALLATION_DATA = {
    plantName: 'Sector 45 Residence',
    capacity: '5 MW',
    status: 'ACTIVE',
    startDate: '2023-10-15',
    assignedTeam: {
        name: 'Installation Team Alpha',
        lead: 'John Doe',
        contact: '+91 98765 43210'
    }
};

// --- Components ---

const TimelineNode = ({ phase, isLast }) => {
    const isActive = phase.status === 'in_progress';
    const isCompleted = phase.status === 'completed';
    const isLocked = phase.status === 'locked' || phase.status === 'pending';

    return (
        <div className="flex items-start flex-1 last:flex-none">
            <div className="relative flex flex-col items-center group cursor-default">
                <div className={`
                    w-4 h-4 rounded-full border-2 z-10 transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                        isActive ? 'bg-solar-yellow border-solar-yellow shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-125' :
                            'bg-deep-navy border-white/20'}
                `}>
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-deep-navy absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <div className="mt-2 w-max text-center">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-solar-yellow' : isCompleted ? 'text-emerald-400' : 'text-white/30'}`}>
                        {phase.label}
                    </p>
                    <p className="text-[9px] text-white/40">{phase.date}</p>
                </div>
            </div>
            {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mt-[7px] relative">
                    <div className="absolute inset-0 bg-white/10" />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        className="absolute inset-0 bg-emerald-500/50"
                    />
                </div>
            )}
        </div>
    );
};

function InstallationWorkflow() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [activePhase, setActivePhase] = useState('installation');
    const [activeStepId, setActiveStepId] = useState('inverter');
    const [showTechnicalForm, setShowTechnicalForm] = useState(false);
    const [steps, setSteps] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let profile;

                // If customerId is provided (Admin view), fetch that profile
                // Otherwise, we might default to current user profile or handle differently.
                // For now, let's assume if no ID, we fetch current user profile (if customer).
                // But getting current user ID might require auth context.
                // I'll assume getCustomerProfile handles "me" if no ID passed, or I'll pass ID if I have it.
                // Actually, existing getCustomerProfile takes userId.

                if (customerId) {
                    profile = await getCustomerProfile(customerId);
                } else {
                    // Fallback or use a "me" endpoint if available, but for now let's rely on passed ID or mock if missing for demo
                    // If I am a customer, I should get my own.
                    // Let's try fetching with empty and see if backend handles "me".
                    // The backend getProfile expects userId.
                    // I will assume for now we always pass ID or we get it from local storage/auth.
                    // To correspond with "View Workflow" button, we will always have ID.
                    // If just visiting the page, maybe we can't show anything without context.
                    profile = await getCustomerProfile('me'); // Hypothetical 'me' or from AuthContext
                }

                if (profile) {
                    console.log("profile", profile);

                    // Set active phase based on status
                    // 'PENDING' is the default, so we check if it is NOT pending to activate installation
                    if (profile.installationStatus && profile.installationStatus !== 'PENDING') {
                        setActivePhase('installation');
                    } else {
                        // Default to survey for PENDING, ASSIGNED, IN_PROGRESS, or COMPLETED (if next not started)
                        setActivePhase('survey');
                    }

                    setCustomerData({
                        plantName: profile.plantDetails?.name || 'Solar Plant',
                        capacity: profile.plantDetails?.kw_capacity ? `${profile.plantDetails.kw_capacity} kW` : 'N/A',
                        status: profile.installationStatus || 'ACTIVE',
                        surveyStatus: profile.surveyStatus,
                        installationStatus: profile.installationStatus,
                        startDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A',
                        assignedTeam: profile.surveyTeam ? {
                            name: profile.surveyTeam.name,
                            lead: profile.surveyTeam.teamLead?.name || 'N/A',
                            contact: profile.surveyTeam.teamLead?.phone || 'N/A'
                        } : { name: 'Unassigned', lead: '-', contact: '-' }
                    });

                    // Fetch Workflow Steps
                    // We might need to init workflow if empty
                    let workflowSteps = await getWorkflow(profile.id);

                    if (!workflowSteps || workflowSteps.length === 0) {
                        // Auto-init for now if empty
                        await initWorkflow(profile.id);
                        workflowSteps = await getWorkflow(profile.id);
                    }

                    if (workflowSteps && workflowSteps.length > 0) {
                        // Transform to match UI expectation if needed
                        // Backend: { id, stepId, label, status, ... }
                        // Frontend expects: { id, label, status, date, completedBy }
                        // Note: Backend 'stepId' is what UI uses as 'id' for mapping.
                        // But UI also uses 'id' for state.
                        // Let's use backend stepId as the key identifier for UI logic.
                        const mappedSteps = workflowSteps.filter(s => s.phase === 'INSTALLATION').map(s => ({
                            id: s.stepId, // critical mapping
                            dbId: s.id,   // actual DB ID for updates
                            label: s.label,
                            status: s.status,
                            date: s.updatedAt,
                            completedBy: s.assignedToId // we only have ID, ideally populate name
                        }));
                        setSteps(mappedSteps);

                        // Set active step to first in-progress or pending
                        const invalidStep = mappedSteps.find(s => s.status === 'in_progress' || s.status === 'pending');
                        if (invalidStep) setActiveStepId(invalidStep.id);
                    } else {
                        setSteps(INSTALLATION_STEPS); // Fallback to mock if init fails
                    }
                }
            } catch (error) {
                console.error("Failed to fetch workflow data", error);
                // toast.error("Could not load workflow data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [customerId]);

    const handleCompleteStep = async () => {
        const current = steps.find(s => s.id === activeStepId);
        if (!current || !current.dbId) return;

        try {
            await updateWorkflowStep(current.dbId, { status: 'completed' });
            // Optimistic update
            setSteps(prev => prev.map(s => s.id === activeStepId ? { ...s, status: 'completed' } : s));

            // Move to next step logic
            const currentIndex = steps.findIndex(s => s.id === activeStepId);
            if (currentIndex < steps.length - 1) {
                const nextStep = steps[currentIndex + 1];
                await updateWorkflowStep(nextStep.dbId, { status: 'in_progress' });
                setSteps(prev => prev.map(s => s.id === nextStep.id ? { ...s, status: 'in_progress' } : s));
                setActiveStepId(nextStep.id);
            }

        } catch (err) {
            console.error("Update failed", err);
        }
    }

    const currentStep = steps.find(s => s.id === activeStepId);

    if (loading) return <div className="min-h-screen bg-deep-navy flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

            {/* --- Static Header --- */}
            <div className="relative z-10 max-w-7xl ">
                <div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                        <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                        </div>
                        <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back</span>
                    </Button>
                </div>
                <div className="text-right">
                    <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                        {customerData?.plantName || 'Plant'}
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                        Execution <span className="text-solar-yellow">&</span> Progress
                    </h1>
                </div>
            </div>

            {/* --- Sticky Header / Timeline --- */}
            <div className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl bg-deep-navy/80">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


                        {/* Timeline */}
                        <div className="flex-1 max-w-2xl px-4 md:px-12 flex items-start justify-between">
                            {PHASES.map((phase, index) => {
                                let status = 'pending';
                                let date = '-';

                                // Status Logic
                                if (activePhase === 'survey') {
                                    if (phase.id === 'survey') {
                                        status = customerData?.surveyStatus === 'COMPLETED' ? 'completed' : 'in_progress';
                                        date = customerData?.startDate || 'Started';
                                    } else {
                                        status = 'locked';
                                        date = 'Pending';
                                    }
                                } else if (activePhase === 'installation') {
                                    if (phase.id === 'survey') {
                                        status = 'completed';
                                        date = customerData?.startDate || 'Completed';
                                    } else if (phase.id === 'installation') {
                                        status = customerData?.installationStatus === 'COMPLETED' ? 'completed' : 'in_progress';
                                        date = 'In Progress';
                                    } else {
                                        status = 'locked';
                                        date = 'Pending';
                                    }
                                } else if (activePhase === 'commissioning' || activePhase === 'live') {
                                    if (['survey', 'installation'].includes(phase.id)) {
                                        status = 'completed';
                                        date = 'Completed';
                                    } else if (phase.id === 'commissioning') {
                                        status = 'in_progress';
                                        date = 'In Progress';
                                    } else {
                                        status = 'locked';
                                        date = 'Pending';
                                    }
                                }

                                return <TimelineNode key={phase.id} phase={{ ...phase, status, date }} isLast={index === PHASES.length - 1} />;
                            })}
                        </div>

                        {/* Audit Link */}
                        <Button
                            variant="ghost"
                            className="text-white/40 hover:text-white text-xs uppercase tracking-wider hidden lg:flex items-center gap-2"
                            onClick={() => navigate('/audit-trail')}
                        >
                            <Clock className="w-4 h-4" /> View History
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

                    {/* --- LEFT: Phase Navigation --- */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 px-2">Phases</h3>

                        {/* Survey Phase Card */}
                        <div
                            onClick={() => setActivePhase('survey')}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${activePhase === 'survey'
                                ? 'bg-white/10 border-solar-yellow/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${activePhase === 'survey' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-emerald-400'}`}>
                                    <Map className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${activePhase === 'survey'
                                    ? 'bg-solar-yellow/20 text-solar-yellow border-solar-yellow/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                                    {customerData?.surveyStatus === 'COMPLETED' ? 'Completed' : 'In Progress'}
                                </span>
                            </div>
                            <h4 className="font-bold text-lg">Survey</h4>
                            <p className="text-xs text-white/50 mt-1">Feasibility & Planning</p>
                            {activePhase === 'survey' && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <Button variant="ghost" size="sm" className="w-full justify-between text-white/60 hover:text-white p-0">
                                        View Report <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Installation Phase Card */}
                        <div
                            onClick={() => activePhase !== 'survey' && setActivePhase('installation')}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${activePhase === 'installation'
                                ? 'bg-white/10 border-solar-yellow/50 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                } ${activePhase === 'survey' ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${activePhase === 'installation' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-solar-yellow'}`}>
                                    <Hammer className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${activePhase === 'installation'
                                    ? 'bg-solar-yellow/20 text-solar-yellow border-solar-yellow/30 animate-pulse'
                                    : activePhase === 'commissioning' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/40 border-white/10'}`}>
                                    {customerData?.installationStatus === 'COMPLETED' ? 'Completed' : (activePhase === 'installation' ? 'In Progress' : (activePhase === 'commissioning' ? 'Completed' : 'Pending'))}
                                </span>
                            </div>
                            <h4 className="font-bold text-lg">Installation</h4>
                            <p className="text-xs text-white/50 mt-1">Execution Phase</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                                <Users className="w-3 h-3" /> {customerData?.assignedTeam?.name || 'Unassigned'}
                            </div>
                        </div>

                        {/* Commissioning Phase Card */}
                        <div
                            onClick={() => (activePhase === 'commissioning' || activePhase === 'live') ? setActivePhase('commissioning') : null}
                            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${activePhase === 'commissioning'
                                ? 'bg-white/10 border-solar-yellow'
                                : 'bg-white/5 border-white/5 opacity-80'
                                }`}
                        >
                            {/* Lock Overlay if Installation not done (mocked as always locked for now unless clicked) */}
                            {/* For demo, we allow clicking, but visually it looks lockedish */}
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${activePhase === 'commissioning' ? 'bg-solar-yellow text-deep-navy' : 'bg-white/10 text-white/40'}`}>
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/40 px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Locked
                                </span>
                            </div>
                            <h4 className="font-bold text-lg text-white/60">Commissioning</h4>
                            <p className="text-xs text-white/40 mt-1">Awaiting Installation</p>
                        </div>

                    </div>

                    {/* --- RIGHT: Active Phase Detail --- */}
                    <div className="lg:col-span-2 flex flex-col h-full">

                        {/* --- SURVEY VIEW --- */}
                        {activePhase === 'survey' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <div className="glass rounded-3xl p-8 border-t-4 border-t-emerald-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Survey Phase</h2>
                                            <p className={`${customerData?.surveyStatus === 'COMPLETED' ? 'text-emerald-400' : 'text-solar-yellow'} font-bold uppercase text-xs tracking-widest`}>
                                                {customerData?.surveyStatus === 'COMPLETED' ? 'Completed' : 'In Progress'}
                                            </p>
                                        </div>
                                        {customerData?.surveyStatus === 'COMPLETED' && (
                                            <Button onClick={() => navigate('/handoff/review')} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                                <FileText className="w-4 h-4 mr-2" /> Full Report
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-white/60 mb-6">
                                        {customerData?.surveyStatus === 'COMPLETED'
                                            ? 'Site feasibility confirmed. Shadow analysis passed. Roof structure validated for 5MW capacity.'
                                            : 'Survey team is currently assessing the site feasibility and planning the installation.'}
                                    </p>
                                    {/* Summary Grid */}
                                    {customerData?.surveyStatus === 'COMPLETED' && (
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Suitability: High', 'Shading: <5%', 'Structure: Concrete'].map((item, i) => (
                                                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                                                    <span className="text-xs font-bold uppercase text-white/80">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Embedded Report Preview (Mock) - Only show if completed */}
                                {customerData?.surveyStatus === 'COMPLETED' && (
                                    <div className="opacity-50 hover:opacity-100 transition-opacity">
                                        <SurveyReport data={{
                                            customerDetails: {
                                                name: 'Customer Name', // Placeholder or fetch if available
                                                id: customerId || 'CUST-001',
                                                plantName: customerData.plantName,
                                                address: 'Site Address' // Placeholder
                                            },
                                            meta: {
                                                surveyId: 'SRV-001',
                                                date: customerData.startDate,
                                                surveyor: customerData.assignedTeam.name,
                                                type: 'Physical',
                                                status: 'Completed'
                                            },
                                            siteDetails: {
                                                siteType: 'Rooftop',
                                                roofType: 'RCC Flat',
                                                orientation: 'South',
                                                tilt: '20°',
                                                shadowFreeArea: '500 sq.m',
                                                condition: 'Good'
                                            },
                                            shading: {
                                                presence: 'None',
                                                source: 'N/A',
                                                time: 'N/A',
                                                seasonalImpact: 'No'
                                            },
                                            electrical: {
                                                connectionType: 'LT',
                                                sanctionedLoad: '10 kW',
                                                dbLocation: 'Ground',
                                                earthing: 'Yes',
                                                netMetering: 'Feasible'
                                            },
                                            consumption: {
                                                avgMonthly: '1000 kWh',
                                                daytimeLoad: '30%',
                                                billUploaded: 'Yes'
                                            },
                                            recommendations: {
                                                systemSize: customerData.capacity,
                                                plantType: 'On-Grid',
                                                generation: '12000 kWh/yr',
                                                notes: 'Standard installation.'
                                            },
                                            attachments: {
                                                sitePhotos: 2,
                                                roofPhotos: 2,
                                                shadowAnalysis: 1,
                                                bills: 1
                                            },
                                            conclusion: {
                                                feasible: 'Yes',
                                                remarks: 'Proceed for installation.',
                                                readyForQuotation: 'Yes'
                                            }
                                        }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- INSTALLATION VIEW --- */}
                        {activePhase === 'installation' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 relative">
                                {/* Technical Data Form Overlay */}
                                {showTechnicalForm && (
                                    <div className="absolute inset-0 z-20 bg-deep-navy/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold uppercase flex items-center gap-2">
                                                <Hammer className="text-solar-yellow" /> Technical Installation Data
                                            </h3>
                                            <Button variant="ghost" size="icon" onClick={() => setShowTechnicalForm(false)}>
                                                <X className="w-5 h-5 text-white/40 hover:text-white" />
                                            </Button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                            {/* System Details */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">System Specifications</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs text-white/40 block mb-1">PV Module Make</label>
                                                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="e.g. Trina Solar" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-white/40 block mb-1">Total Modules</label>
                                                        <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="18" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-white/40 block mb-1">Inverter Serial No.</label>
                                                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="SN-XXXX-YYYY" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-white/40 block mb-1">Inverter Capacity</label>
                                                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="5 kW" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Electrical Status Checklist */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Electrical Checklist</h4>
                                                <div className="space-y-2">
                                                    {['ACDB Installed & Wired', 'DCDB Installed & Wired', 'Earthing Pits Ready', 'Cable Dressing Complete', 'Safety Signs Displayed'].map((item, i) => (
                                                        <label key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10">
                                                            <input type="checkbox" className="w-4 h-4 rounded bg-deep-navy border-white/20 accent-solar-yellow" />
                                                            <span className="text-sm text-white/80">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Handoff Readiness */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Handoff Readiness</h4>
                                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" className="w-5 h-5 rounded bg-deep-navy border-white/20 accent-emerald-500" />
                                                        <div>
                                                            <p className="font-bold text-emerald-400">Ready for Commissioning</p>
                                                            <p className="text-xs text-white/40">Confirm that all physical installation work is complete and safe.</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-4 border-t border-white/10 flex justify-end gap-3">
                                            <Button variant="ghost" onClick={() => setShowTechnicalForm(false)}>Cancel</Button>
                                            <Button className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold" onClick={() => {
                                                // Save logic mock
                                                setShowTechnicalForm(false);
                                            }}>
                                                Save Details
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Header Card */}
                                <div className="glass rounded-2xl p-6 border-l-4 border-l-solar-yellow flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-wide">Installation Phase</h2>
                                        <p className="text-solar-yellow font-bold uppercase text-xs tracking-widest mt-1">Status: In Progress</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-solar-yellow/30 text-solar-yellow hover:bg-solar-yellow/10 uppercase tracking-wider text-xs font-bold"
                                            onClick={() => setShowTechnicalForm(true)}
                                        >
                                            <FileText className="w-4 h-4 mr-2" /> Update Technical Data
                                        </Button>
                                    </div>
                                </div>

                                {/* Horizontal Stepper */}
                                <div className="glass rounded-2xl p-6 overflow-x-auto">
                                    <div className="flex items-center justify-between min-w-[600px]">
                                        {steps.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className="flex-1 flex flex-col items-center relative group cursor-pointer"
                                                onClick={() => setActiveStepId(step.id)}
                                            >
                                                {/* Line */}
                                                {index !== 0 && (
                                                    <div className={`absolute top-5 right-[50%] w-full h-[2px] -translate-y-1/2 -z-10 ${step.status === 'completed' || step.status === 'in_progress' ? 'bg-solar-yellow' : 'bg-white/10'
                                                        }`} />
                                                )}

                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all mb-3 ${activeStepId === step.id ? 'scale-110 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : ''
                                                    } ${step.status === 'completed' ? 'bg-solar-yellow border-solar-yellow text-deep-navy' :
                                                        step.status === 'in_progress' ? 'bg-deep-navy border-solar-yellow text-solar-yellow' :
                                                            'bg-deep-navy border-white/20 text-white/20'
                                                    }`}>
                                                    {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                        step.status === 'in_progress' ? <Zap className="w-5 h-5" /> :
                                                            <Circle className="w-5 h-5" />}
                                                </div>

                                                {/* Label */}
                                                <span className={`text-xs font-bold uppercase tracking-wider text-center ${activeStepId === step.id ? 'text-white' : 'text-white/40'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Step Detail */}
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={activeStepId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="glass rounded-3xl p-8 flex-1"
                                    >
                                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase">{currentStep?.label}</h3>
                                                <p className="text-white/40 text-sm">Step 0{steps.findIndex(s => s.id === activeStepId) + 1} of {steps.length}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs border ${currentStep?.status === 'in_progress' ? 'border-solar-yellow text-solar-yellow bg-solar-yellow/5' :
                                                currentStep?.status === 'completed' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' :
                                                    'border-white/10 text-white/30'
                                                }`}>
                                                {currentStep?.status ? currentStep.status.replace('_', ' ') : 'Pending'}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Assigned Tasks / Info */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Assigned To</h4>
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold">R</div>
                                                        <div>
                                                            <p className="text-sm font-bold">{customerData?.assignedTeam?.lead || 'Team Lead'}</p>
                                                            <p className="text-xs text-white/40">Installation Team</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Tasks</h4>
                                                    <ul className="space-y-2">
                                                        {['Verify layout', 'Secure mounting rails', 'Torque check'].map((task, i) => (
                                                            <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                                                <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center">
                                                                    {currentStep?.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-solar-yellow" />}
                                                                </div>
                                                                {task}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* inputs / photos */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Photos</h4>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/10 cursor-pointer">
                                                            <PlusIcon />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Notes</h4>
                                                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm min-h-[80px]" placeholder="Add remarks..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                            {currentStep?.status !== 'completed' && (
                                                <Button className="bg-solar-yellow text-deep-navy hover:bg-gold font-bold" onClick={handleCompleteStep}>
                                                    Mark as Completed
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}

                        {/* --- COMMISSIONING VIEW --- */}
                        {activePhase === 'commissioning' && (
                            <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center h-[500px] border-2 border-dashed border-white/10 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <Lock className="w-8 h-8 text-white/20" />
                                </div>
                                <h2 className="text-2xl font-black uppercase text-white/40 mb-2">Phase Locked</h2>
                                <p className="text-white/30 max-w-sm mx-auto mb-8">
                                    Complete the installation phase and submit the handoff report to unlock Commissioning.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-white/10 text-white/40 hover:text-white"
                                    onClick={() => {
                                        // Demo override
                                        navigate('/commissioning/handoff');
                                    }}
                                >
                                    Go to Handoff (Demo Override)
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

export default InstallationWorkflow;
