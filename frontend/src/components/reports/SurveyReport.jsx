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
  Download
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const SectionHeader = ({ title, icon: Icon, expanded, onToggle }) => (
    <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
    >
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
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

const DetailRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
    <span className="text-sm text-white/60 font-medium">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-solar-yellow' : 'text-white'}`}>{value}</span>
  </div>
);

const SurveyReport = ({ data }) => {
  // Default mock data aligned with wireframe
  const report = data || {
    basicInfo: {
      siteName: 'Sector 45 Residence',
      plantName: 'Residential Solar 10kW',
      address: 'Plot 45, Sector 45, Gurugram, Haryana',
      gps: '28.4595° N, 77.0266° E',
      surveyDate: '12 Feb 2026',
      surveyTeam: 'Survey Team A',
      status: 'Completed'
    },
    feasibility: {
      suitable: true,
      capacity: '50 kW',
      shadingLoss: '8%',
    },
    siteDetails: {
      roofType: 'RCC Flat',
      area: '420 sq. m',
      orientation: 'South',
      tilt: '22°'
    },
    shading: {
      obstructions: 'Water tank on NE corner',
      notes: 'Panel placement optimized for SW area.'
    },
    electrical: {
      gridPoint: 'Nearest Grid Point: Pole 432 (10m)',
      voltage: '415V (3-Phase)',
      transformer: 'Available',
      distance: '15 Meters'
    },
    design: {
      panelCount: '92',
      inverter: 'String Inverter (50kW)',
      mounting: 'Ballasted Structure',
      routing: 'Cable tray via east wall shaft'
    },
    risks: {
        structural: 'Stable',
        electrical: 'Standard earthing needed',
        weather: 'High wind zone (Class 3)'
    },
    remarks: 'Site is clear for installation. Customer requested black-frame panels.'
  };

  return (
    <div className="space-y-6">
        
      {/* 1. Header Card */}
      <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-black uppercase text-white tracking-tight">{report.basicInfo.siteName}</h1>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {report.basicInfo.status}
                  </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.basicInfo.address}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.basicInfo.surveyDate}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {report.basicInfo.surveyTeam}</span>
              </div>
          </div>
          <div className="flex gap-3">
               <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">
                   <Download className="w-4 h-4 mr-2" /> Report
               </Button>
               <Button variant="ghost" size="sm" className="text-solar-yellow hover:text-white">
                   View Timeline
               </Button>
          </div>
      </div>

      {/* 2. Feasibility Summary (Top Priority) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className={`p-6 rounded-2xl border ${report.feasibility.suitable ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
               <p className={`text-xs uppercase font-bold mb-1 ${report.feasibility.suitable ? 'text-emerald-400' : 'text-red-400'}`}>Feasibility</p>
               <p className="text-2xl font-black text-white">{report.feasibility.suitable ? 'SUITABLE' : 'NOT SUITABLE'}</p>
           </div>
           
           <div className="glass p-6 rounded-2xl border-l-4 border-l-solar-yellow">
               <p className="text-xs text-white/40 uppercase font-bold mb-1">Recommended Capacity</p>
               <p className="text-2xl font-black text-white">{report.feasibility.capacity}</p>
           </div>

           <div className="glass p-6 rounded-2xl border-l-4 border-l-orange-500">
               <p className="text-xs text-white/40 uppercase font-bold mb-1">Est. Shading Loss</p>
               <p className="text-2xl font-black text-white">{report.feasibility.shadingLoss}</p>
           </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 3. Site Details (Expandable) */}
          <ReportSection title="Site Details" icon={Layers}>
                <DetailRow label="Roof Type" value={report.siteDetails.roofType} />
                <DetailRow label="Usable Area" value={report.siteDetails.area} highlight />
                <DetailRow label="Orientation" value={report.siteDetails.orientation} />
                <DetailRow label="Tilt Angle" value={report.siteDetails.tilt} />
          </ReportSection>

          {/* 4. Electrical & Grid */}
          <ReportSection title="Electrical & Grid" icon={Zap}>
                <DetailRow label="Grid Point" value={report.electrical.gridPoint} />
                <DetailRow label="Voltage" value={report.electrical.voltage} />
                <DetailRow label="Transformer" value={report.electrical.transformer} />
                <DetailRow label="Grid Distance" value={report.electrical.distance} />
          </ReportSection>
      </div>

      {/* 5. Recommended Design (Read-only / Locked) */}
      <ReportSection title="System Design (Locked)" icon={Maximize} className="bg-solar-yellow/5 border-solar-yellow/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
             <DetailRow label="Panel Count" value={report.design.panelCount} highlight />
             <DetailRow label="Inverter Type" value={report.design.inverter} />
             <DetailRow label="Mounting Struct." value={report.design.mounting} />
             <DetailRow label="Cable Routing" value={report.design.routing} />
          </div>
      </ReportSection>

      {/* 6. Risks & Attachments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Risks */}
           <ReportSection title="Risk & Safety" icon={AlertTriangle}>
                <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <span className="text-xs text-white/60 font-bold uppercase">Structural</span>
                        <span className="text-sm font-bold flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> {report.risks.structural}</span>
                    </div>
                     <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <span className="text-xs text-white/60 font-bold uppercase">Electrical</span>
                        <span className="text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-solar-yellow" /> {report.risks.electrical}</span>
                    </div>
                     <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <span className="text-xs text-white/60 font-bold uppercase">Weather</span>
                        <span className="text-sm font-bold flex items-center gap-2"><Wind className="w-3 h-3 text-orange-400" /> {report.risks.weather}</span>
                    </div>
                </div>
           </ReportSection>

           {/* 7. Attachments */}
           <ReportSection title="Site Photos & Media" icon={FileImage}>
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden">
                            <FileImage className="w-6 h-6 text-white/20 group-hover:text-solar-yellow transition-colors" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] uppercase font-bold tracking-widest">View</span>
                            </div>
                        </div>
                    ))}
                    <div className="aspect-square bg-white/5 rounded-lg border border-white/10 border-dashed flex flex-col items-center justify-center text-white/30 text-[10px] font-bold uppercase">
                        +4 More
                    </div>
                </div>
           </ReportSection>
      </div>

      {/* 8. Final Remarks */}
      <ReportSection title="Surveyor Remarks" icon={ClipboardCheck} defaultExpanded={false}>
          <div className="bg-white/10 p-4 rounded-xl border-l-4 border-white/20">
              <p className="text-sm italic text-white/80">"{report.remarks}"</p>
          </div>
      </ReportSection>

    </div>
  );
};

export default SurveyReport;
