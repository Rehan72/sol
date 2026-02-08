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
    Battery
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

const DetailRow = ({ label, value, highlight = false, subValue }) => (
    <div className="flex justify-between items-start py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
        <span className="text-sm text-white/60 font-medium">{label}</span>
        <div className="text-right">
            <span className={`text-sm font-bold block ${highlight ? 'text-solar-yellow' : 'text-white'}`}>{value}</span>
            {subValue && <span className="text-xs text-white/40">{subValue}</span>}
        </div>
    </div>
);

const SurveyReport = ({ data }) => {
    // Default mock data aligned with defined requirements
    const report = data || {
        customerDetails: {
            name: 'Amit Sharma',
            id: 'CUST-2024-001',
            plantName: 'Sector 45 Residence',
            address: 'Plot 45, Sector 45, Gurugram, Haryana'
        },
        meta: {
            surveyId: 'SRV-8821',
            date: '12 Feb 2026',
            surveyor: 'Rajesh Kumar',
            type: 'Physical',
            status: 'Completed'
        },
        siteDetails: {
            siteType: 'Rooftop',
            roofType: 'RCC Flat',
            orientation: 'South (180°)',
            tilt: '22°',
            shadowFreeArea: '420 sq.m',
            condition: 'Good'
        },
        shading: {
            presence: 'Partial',
            source: 'Water tank on NE corner',
            time: 'Morning (8-9 AM)',
            seasonalImpact: 'No'
        },
        electrical: {
            connectionType: 'LT (Low Tension)',
            sanctionedLoad: '15 kW',
            dbLocation: 'Ground Floor, Near Staircase',
            earthing: 'Yes',
            netMetering: 'Feasible'
        },
        consumption: {
            avgMonthly: '1200 kWh',
            daytimeLoad: '40%',
            billUploaded: 'Yes'
        },
        recommendations: {
            systemSize: '10 kW',
            plantType: 'On-Grid',
            generation: '14,500 kWh/year',
            notes: 'Structure needs 300mm elevation for water flow.'
        },
        attachments: {
            sitePhotos: 4,
            roofPhotos: 3,
            shadowAnalysis: 1,
            bills: 1
        },
        conclusion: {
            feasible: 'Yes',
            remarks: 'Site is ideal for 10kW system. Shadow issues are minimal.',
            readyForQuotation: 'Yes'
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
                            <CheckCircle2 className="w-3 h-3" /> {report.meta.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {report.customerDetails.name}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.customerDetails.address}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* A. Survey Meta Information */}
                <ReportSection title="A. Survey Meta Information" icon={ClipboardCheck}>
                    <DetailRow label="Survey ID" value={report.meta.surveyId} />
                    <DetailRow label="Survey Date" value={report.meta.date} />
                    <DetailRow label="Surveyor Name" value={report.meta.surveyor} />
                    <DetailRow label="Survey Type" value={report.meta.type} />
                    <DetailRow label="Status" value={report.meta.status} highlight />
                </ReportSection>

                {/* B. Site & Roof Details */}
                <ReportSection title="B. Site & Roof Details" icon={Home}>
                    <DetailRow label="Site Type" value={report.siteDetails.siteType} />
                    <DetailRow label="Roof Type" value={report.siteDetails.roofType} />
                    <DetailRow label="Orientation (Azimuth)" value={report.siteDetails.orientation} />
                    <DetailRow label="Tilt Angle" value={report.siteDetails.tilt} />
                    <DetailRow label="Shadow-Free Area" value={report.siteDetails.shadowFreeArea} highlight />
                    <DetailRow label="Roof Condition" value={report.siteDetails.condition} />
                </ReportSection>

                {/* C. Shading Analysis */}
                <ReportSection title="C. Shading Analysis" icon={Sun}>
                    <DetailRow label="Shading Presence" value={report.shading.presence} />
                    <DetailRow label="Shading Source" value={report.shading.source} />
                    <DetailRow label="Shading Time" value={report.shading.time} />
                    <DetailRow label="Seasonal Impact" value={report.shading.seasonalImpact} />
                </ReportSection>

                {/* D. Electrical & Grid */}
                <ReportSection title="D. Electrical & Grid" icon={Zap}>
                    <DetailRow label="Connection Type" value={report.electrical.connectionType} />
                    <DetailRow label="Sanctioned Load" value={report.electrical.sanctionedLoad} />
                    <DetailRow label="Main DB Location" value={report.electrical.dbLocation} />
                    <DetailRow label="Earthing Available" value={report.electrical.earthing} />
                    <DetailRow label="Net Metering Feasible" value={report.electrical.netMetering} highlight />
                </ReportSection>

                {/* E. Energy Consumption */}
                <ReportSection title="E. Energy Consumption" icon={Battery}>
                    <DetailRow label="Avg Monthly Consumption" value={report.consumption.avgMonthly} />
                    <DetailRow label="Daytime Load %" value={report.consumption.daytimeLoad} />
                    <DetailRow label="Last 12 Month Bill" value={report.consumption.billUploaded} />
                </ReportSection>

                {/* G. Attachments */}
                <ReportSection title="G. Attachments" icon={FileImage}>
                    <div className="grid grid-cols-4 gap-2">
                        {['Site', 'Roof', 'Shadow', 'Bill'].map((item, i) => (
                            <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                <FileImage className="w-5 h-5 text-white/30 mb-1" />
                                <span className="text-[10px] text-white/50 uppercase font-bold">{item}</span>
                            </div>
                        ))}
                    </div>
                </ReportSection>
            </div>

            {/* F. Recommendations & Conclusion */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <ReportSection title="F. Recommendations" icon={Maximize} className="border-solar-yellow/30 bg-solar-yellow/5">
                    <DetailRow label="Recommended System Size" value={report.recommendations.systemSize} highlight />
                    <DetailRow label="Propsoed Plant Type" value={report.recommendations.plantType} />
                    <DetailRow label="Expected Generation" value={report.recommendations.generation} />
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Special Notes</p>
                        <p className="text-sm text-white/80 italic">"{report.recommendations.notes}"</p>
                    </div>
                </ReportSection>

                <ReportSection title="H. Survey Conclusion" icon={CheckCircle2} className="border-emerald-500/30 bg-emerald-500/5">
                    <DetailRow label="Feasible" value={report.conclusion.feasible} highlight />
                    <DetailRow label="Ready for Quotation" value={report.conclusion.readyForQuotation} />
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Final Remarks</p>
                        <p className="text-sm text-white/80 italic">"{report.conclusion.remarks}"</p>
                    </div>
                </ReportSection>
            </div>

        </div>
    );
};

export default SurveyReport;
