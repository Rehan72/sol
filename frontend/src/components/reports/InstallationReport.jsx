import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Users,
    CheckCircle2,
    AlertTriangle,
    Sun,
    Zap,
    Maximize,
    ArrowRight,
    Wind,
    Layers,
    FileImage,
    ClipboardCheck,
    ChevronDown,
    ChevronUp,
    Download,
    Home,
    Ruler,
    Battery,
    Hammer,
    ShieldCheck,
    Smartphone,
    Info
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const SectionHeader = ({ title, icon: Icon, expanded, onToggle }) => (
    <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
    >
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-solar-yellow" />}
            {title}
        </h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
    </div>
);

const ReportSection = ({ title, icon: Icon, children, className = "", defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className={`glass rounded-2xl border border-white/5 overflow-hidden mb-6 ${className}`}>
            <SectionHeader title={title} icon={Icon} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DetailRow = ({ label, value, highlight = false, subValue, statusColor }) => (
    <div className="flex justify-between items-start py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
        <span className="text-sm text-white/60 font-medium">{label}</span>
        <div className="text-right">
            <span className={`text-sm font-bold block ${highlight ? 'text-solar-yellow' : (statusColor || 'text-white')}`}>{value}</span>
            {subValue && <span className="text-xs text-white/40">{subValue}</span>}
        </div>
    </div>
);

const ChecklistItem = ({ task, status, date, person }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <span className="text-sm font-medium text-white/80">{task}</span>
        <div className="flex items-center gap-4 text-right">
            <div className="text-xs text-white/40">
                <p>{date}</p>
                <p>{person}</p>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'
                }`}>
                {status}
            </div>
        </div>
    </div>
)

const InstallationReport = ({ data }) => {
    // Default mock data aligned with defined requirements
    const report = data || {
        customerDetails: {
            name: 'Amit Sharma',
            plantName: 'Sector 45 Residence',
            approvedCapacity: '10 kW',
            address: 'Plot 45, Sector 45, Gurugram, Haryana'
        },
        meta: {
            reportId: 'INST-2024-001',
            startDate: '15 Feb 2026',
            completionDate: '20 Feb 2026',
            status: 'Completed'
        },
        team: {
            epcName: 'SolarTech Solutions',
            supervisor: 'Vikram Singh',
            teamSize: '4 Members',
            contact: '+91 98765 43210'
        },
        system: {
            modules: {
                brand: 'Longi Solar',
                capacity: '550 Wp',
                count: 18,
                structure: 'High-Rise Ballasted',
                status: 'Installed'
            },
            inverters: {
                brand: 'Growatt',
                model: 'MID 10KTL3-X',
                type: 'String',
                count: 1,
                status: 'Installed'
            }
        },
        electrical: {
            dcCabling: 'Yes',
            acCabling: 'Yes',
            earthing: 'Yes',
            lightningArrestor: 'Yes'
        },
        checklist: [
            { task: 'Structure Installation', status: 'Done', date: '16 Feb', person: 'Team A' },
            { task: 'Module Mounting', status: 'Done', date: '17 Feb', person: 'Team A' },
            { task: 'DC Connections', status: 'Done', date: '18 Feb', person: 'Electrician' },
            { task: 'Inverter Installation', status: 'Done', date: '19 Feb', person: 'Electrician' },
            { task: 'Safety & Housekeeping', status: 'Done', date: '20 Feb', person: 'Supervisor' },
        ],
        quality: {
            mechanical: 'Yes',
            electrical: 'Yes',
            fireSafety: 'Yes',
            snagList: 'No'
        },
        attachments: {
            structurePhotos: 5,
            modulePhotos: 4,
            inverterPhotos: 2,
            earthingPhotos: 3
        },
        remarks: {
            issues: 'None',
            deviations: 'None',
            recommendations: 'Proceed to commissioning tests.'
        },
        handoff: {
            ready: 'Yes',
            pendingItems: 'None',
            date: '20 Feb 2026'
        }
    };

    return (
        <div className="space-y-6 text-left">

            {/* 1. Header Card (Auto-Linked) */}
            <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-black uppercase text-white tracking-tight">{report.customerDetails.plantName}</h1>
                        <span className={`px-3 py-1 border text-xs font-bold uppercase rounded-full flex items-center gap-1 ${report.meta.status === 'Completed'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-solar-yellow/10 border-solar-yellow/20 text-solar-yellow'
                            }`}>
                            <Hammer className="w-3 h-3" /> {report.meta.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {report.customerDetails.name}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.customerDetails.address}</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {report.customerDetails.approvedCapacity}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" /> Handoff Doc
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* A. Installation Meta Information */}
                <ReportSection title="A. Meta Information" icon={Info}>
                    <DetailRow label="Report ID" value={report.meta.reportId} />
                    <DetailRow label="Start Date" value={report.meta.startDate} />
                    <DetailRow label="Completion Date" value={report.meta.completionDate} />
                    <DetailRow label="Status" value={report.meta.status} highlight />
                </ReportSection>

                {/* B. Installation Team Details */}
                <ReportSection title="B. Installation Team" icon={Users}>
                    <DetailRow label="EPC / Vendor" value={report.team.epcName} />
                    <DetailRow label="Supervisor" value={report.team.supervisor} />
                    <DetailRow label="Team Size" value={report.team.teamSize} />
                    <DetailRow label="Contact" value={report.team.contact} />
                </ReportSection>

                {/* C. Installed System Details */}
                <ReportSection title="C. Installed System Details" icon={Layers}>
                    <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase text-white/40 mb-2">Solar Modules</h4>
                        <DetailRow label="Brand" value={report.system.modules.brand} />
                        <DetailRow label="Capacity" value={report.system.modules.capacity} />
                        <DetailRow label="Quantity" value={report.system.modules.count} />
                        <DetailRow label="Mounting" value={report.system.modules.structure} />
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <h4 className="text-xs font-bold uppercase text-white/40 mb-2">Inverters</h4>
                        <DetailRow label="Brand & Model" value={`${report.system.inverters.brand} ${report.system.inverters.model}`} />
                        <DetailRow label="Type" value={report.system.inverters.type} />
                        <DetailRow label="Quantity" value={report.system.inverters.count} />
                    </div>
                </ReportSection>

                {/* D. Electrical Installation Status */}
                <ReportSection title="D. Electrical Status" icon={Zap}>
                    <DetailRow label="DC Cabling" value={report.electrical.dcCabling} />
                    <DetailRow label="AC Cabling" value={report.electrical.acCabling} />
                    <DetailRow label="Earthing" value={report.electrical.earthing} />
                    <DetailRow label="Lightning Arrestor" value={report.electrical.lightningArrestor} />
                </ReportSection>
            </div>

            {/* E. Installation Checklist */}
            <ReportSection title="E. Installation Checklist" icon={ClipboardCheck}>
                <div className="space-y-1">
                    {report.checklist.map((item, i) => (
                        <ChecklistItem key={i} {...item} />
                    ))}
                </div>
            </ReportSection>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* F. Quality & Safety */}
                <ReportSection title="F. Quality & Safety" icon={ShieldCheck}>
                    <DetailRow label="Mechanical Fixing Verified" value={report.quality.mechanical} />
                    <DetailRow label="Electrical Safety Verified" value={report.quality.electrical} />
                    <DetailRow label="Fire Safety Compliance" value={report.quality.fireSafety} />
                    <DetailRow label="Snag List Created" value={report.quality.snagList} />
                </ReportSection>

                {/* G. Attachments */}
                <ReportSection title="G. Site Photos" icon={FileImage}>
                    <div className="grid grid-cols-4 gap-2">
                        {['Structure', 'Module', 'Inverter', 'Earthing'].map((item, i) => (
                            <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                <FileImage className="w-5 h-5 text-white/30 mb-1" />
                                <span className="text-[10px] text-white/50 uppercase font-bold">{item}</span>
                            </div>
                        ))}
                    </div>
                </ReportSection>
            </div>

            {/* H & I Conclusion */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <ReportSection title="H. Remarks" icon={AlertTriangle} className="border-orange-500/20 bg-orange-500/5">
                    <DetailRow label="Issues Faced" value={report.remarks.issues} />
                    <DetailRow label="Deviations" value={report.remarks.deviations} />
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Recommendations</p>
                        <p className="text-sm text-white/80 italic">"{report.remarks.recommendations}"</p>
                    </div>
                </ReportSection>

                <ReportSection title="I. Handoff Readiness" icon={CheckCircle2} className="border-emerald-500/30 bg-emerald-500/5">
                    <DetailRow label="Ready for Commissioning" value={report.handoff.ready} highlight />
                    <DetailRow label="Handoff Date" value={report.handoff.date} />
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Pending Items</p>
                        <p className="text-sm text-white/80 italic">"{report.handoff.pendingItems}"</p>
                    </div>
                </ReportSection>
            </div>

        </div>
    );
};

export default InstallationReport;
