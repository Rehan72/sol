import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  AlertTriangle, 
  Download, 
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  getDiscomReport, 
  getSubsidyReport, 
  getExpiringDocuments,
  getESGReport 
} from '../../api/audit';

const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState('discom');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [esgAggregate, setEsgAggregate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [complianceRes, esgRes] = await Promise.all([
                activeTab === 'discom' ? getDiscomReport() : 
                activeTab === 'subsidy' ? getSubsidyReport() : 
                getExpiringDocuments(),
                getESGReport()
            ]);
            setData(complianceRes || []);
            setEsgAggregate(esgRes);
        } catch (error) {
            console.error("Failed to fetch compliance data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col p-8">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tighter uppercase mb-2"
          >
            COMPLIANCE <span className="text-solar-yellow italic">& AUDIT</span>
          </motion.h1>
          <p className="text-white/50 text-sm font-medium">Enterprise oversight for DISCOM, subsidies, and regulatory health.</p>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group">
            <Download className="w-4 h-4 text-solar-yellow group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black tracking-widest uppercase">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] w-fit mb-8">
        {[
          { id: 'discom', label: 'DISCOM Status', icon: ShieldCheck },
          { id: 'subsidy', label: 'Subsidy Tracker', icon: CheckCircle2 },
          { id: 'expiries', label: 'Document Expiries', icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${
              activeTab === tab.id 
                ? 'bg-solar-yellow text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative z-10 glass border border-white/10 rounded-3xl overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-solar-yellow/20 border-t-solar-yellow rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Entity / User</th>
                  {activeTab === 'discom' && (
                    <>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">App Number</th>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Progress</th>
                    </>
                  )}
                  {activeTab === 'subsidy' && (
                    <>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Amount</th>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Status</th>
                    </>
                  )}
                  {activeTab === 'expiries' && (
                    <>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Document</th>
                      <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/40 uppercase">Expiry</th>
                    </>
                  )}
                  <th className="px-8 py-6 text-right text-[10px] font-black tracking-widest text-white/40 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item, idx) => (
                  <motion.tr 
                    key={item?.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-solar-yellow/20 to-transparent flex items-center justify-center border border-white/10 group-hover:border-solar-yellow/40 transition-colors">
                          <span className="text-solar-yellow font-black text-xs">{item?.name?.[0] || 'U'}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item?.name || 'Unknown'}</p>
                          <p className="text-xs text-white/40">{item?.email || item?.city || 'No Data'}</p>
                        </div>
                      </div>
                    </td>
                    
                    {activeTab === 'discom' && (
                      <>
                        <td className="px-8 py-6 font-mono text-xs text-white/80">{item?.discomNumber || 'N/A'}</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                            item?.discomApplicationStatus === 'APPROVED' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                            item?.discomApplicationStatus === 'PENDING' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-500'
                          }`}>
                            {item?.discomApplicationStatus || 'NOT_STARTED'}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'subsidy' && (
                      <>
                        <td className="px-8 py-6 font-black text-solar-yellow">₹{item?.subsidyAmount?.toLocaleString() || '0'}</td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                            item?.subsidyStatus === 'CREDITED' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-500'
                          }`}>
                            {item?.subsidyStatus || 'PENDING'}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'expiries' && (
                      <>
                        <td className="px-8 py-6 text-sm italic">{item?.document || 'General Document'}</td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                            <span className="text-xs font-bold text-red-400">{item?.expiry || 'N/A'}</span>
                            <span className="text-[10px] text-white/30 uppercase tracking-tighter">{item?.daysLeft || '?'} days remaining</span>
                           </div>
                        </td>
                      </>
                    )}

                    <td className="px-8 py-6 text-right">
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-solar-yellow">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Bottom Insights */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
         {[
           { label: 'DISCOM Pass Rate', value: esgAggregate?.complianceStatus || '94.2%', color: 'text-green-500' },
           { label: 'Active Integrations', value: esgAggregate?.activeDiscomIntegrations || '24', color: 'text-solar-yellow' },
           { label: 'Carbon Credits', value: esgAggregate?.carbonCreditsEarned?.toLocaleString() || '450', color: 'text-emerald-400' },
           { label: 'Water Offset', value: `${esgAggregate?.waterSavedLiters?.toLocaleString() || '120k'} L`, color: 'text-blue-500' },
         ].map((stat, i) => (
           <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">{stat?.label}</span>
              <span className={`text-2xl font-black ${stat?.color}`}>{stat?.value}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ComplianceDashboard;
