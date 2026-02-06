import React, { useState } from 'react';
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
    Plus
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import DateTimePicker from '../../components/ui/DateTimePicker';
import { useNavigate } from 'react-router-dom';

// Enhanced Mock Data
const INITIAL_LEADS = [
    { id: 1, name: 'Rahul Kumar', location: 'Patna, Bihar', type: 'Residential', bill: '₹4,000', status: 'New Request', date: 'Just now' },
    { id: 2, name: 'Priya Singh', location: 'Noida, UP', type: 'Office', bill: '₹12,000', status: 'Survey Assigned', date: '2 hours ago', surveyor: 'Survey Team A' },
    { id: 3, name: 'Amit Verma', location: 'Dwarka, Delhi', type: 'Residential', bill: '₹2,500', status: 'Survey Completed', date: '1 day ago', feasibility: 'Suitable' },
];

const SolarRequests = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalType, setModalType] = useState(null); // 'assign_survey' | 'create_quote' | 'create_lead'

  const [newLead, setNewLead] = useState({ name: '', location: '', type: 'Residential', bill: '' });
  const [surveyDate, setSurveyDate] = useState(null);

  const handleAction = (lead) => {
      setSelectedLead(lead);
      if (lead.status === 'New Request') {
          setModalType('assign_survey');
      } else if (lead.status === 'Survey Completed') {
          setModalType('create_quote');
      }
  };

  const closeModal = () => {
      setModalType(null);
      setSelectedLead(null);
      setSurveyDate(null);
      setNewLead({ name: '', location: '', type: 'Residential', bill: '' });
  };

  const handleCreateLead = () => {
      const createdLead = {
          id: leads.length + 1,
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
                                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${
                                     lead.status === 'New Request' ? 'bg-solar-yellow/10 text-solar-yellow border border-solar-yellow/20' : 
                                     lead.status === 'Survey Assigned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                     lead.status === 'Survey Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                     'bg-white/10 text-white/60'
                                 }`}>
                                     {lead.status}
                                 </span>
                             </div>
                             
                             <Button 
                                onClick={() => handleAction(lead)}
                                className={`min-w-[140px] border border-white/10 text-white ${
                                    lead.status === 'New Request' ? 'bg-solar-yellow text-deep-navy hover:bg-gold font-bold border-none' :
                                    lead.status === 'Survey Completed' ? 'bg-emerald-600 hover:bg-emerald-700 font-bold border-none' :
                                    'bg-white/5 hover:bg-white/10'
                                }`}
                                disabled={lead.status === 'Survey Assigned'}
                             >
                                 {lead.status === 'New Request' && <>Assign Survey <ArrowRight className="w-4 h-4 ml-2" /></>}
                                 {lead.status === 'Survey Assigned' && <>Awaiting Survey</>}
                                 {lead.status === 'Survey Completed' && <><Wallet className="w-4 h-4 mr-2" /> Create Quote</>}
                             </Button>
                         </div>
                     </motion.div>
                 ))}
             </div>

             {/* MODALS */}
             <AnimatePresence>
                 {modalType === 'create_lead' && (
                     <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>
                         <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl z-10">
                             <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                 <Plus className="w-6 h-6 text-solar-yellow" /> Create Solar Request
                             </h2>
                             
                             <div className="space-y-4 mb-6">
                                 <div>
                                     <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Customer Name</label>
                                     <input 
                                        type="text" 
                                        value={newLead.name}
                                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
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
                                            onChange={(e) => setNewLead({...newLead, location: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" 
                                            placeholder="City, State"
                                         />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Est. Bill Amount</label>
                                         <input 
                                            type="number" 
                                            value={newLead.bill}
                                            onChange={(e) => setNewLead({...newLead, bill: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" 
                                            placeholder="e.g. 5000"
                                         />
                                     </div>
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Property Type</label>
                                     <select 
                                        value={newLead.type}
                                        onChange={(e) => setNewLead({...newLead, type: e.target.value})}
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
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>
                         <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl z-10">
                             <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                 <Clipboard className="w-5 h-5 text-solar-yellow" /> Assign Survey Team
                             </h2>
                             
                             <div className="space-y-4 mb-6">
                                 <div>
                                     <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Customer</label>
                                     <div className="p-3 bg-white/5 rounded-lg text-white font-bold">{selectedLead?.name}</div>
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold uppercase text-white/40 mb-2 block">Select Team</label>
                                     <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white">
                                         <option>Survey Team Alpha (Available)</option>
                                         <option>Survey Team Beta</option>
                                     </select>
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
                                 <Button className="flex-1 bg-solar-yellow text-deep-navy font-bold hover:bg-gold">Assign & Notify</Button>
                             </div>
                         </motion.div>
                     </div>
                 )}

                 {modalType === 'create_quote' && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>
                         <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative bg-deep-navy border border-white/10 p-8 rounded-2xl w-full max-w-2xl shadow-2xl z-10">
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
