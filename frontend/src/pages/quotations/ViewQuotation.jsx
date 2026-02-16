import React, { Activity, useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotationById, generateQuotationPdf, submitQuotation, approveQuotation, rejectQuotation } from '../../api/quotations';
import { analyzeFinancials, getEnvironmentalImpact } from '../../api/financials';
import { 
  Download, CheckCircle, ArrowLeft, Printer, Loader2, Send, XCircle, FileText,
  TrendingUp, Leaf, BarChart3, CloudRain, TreePine, Droplets, ArrowUpRight
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';

const ViewQuotation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [remarks, setRemarks] = useState('');
    const { addToast } = useToast();

    const [financials, setFinancials] = useState(null);
    const [envImpact, setEnvImpact] = useState(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const data = await getQuotationById(id);
                setQuotation(data);
                
                // Fetch Financial Intelligence
                if (data.proposedSystemCapacity && data.netProjectCost) {
                    const finData = await analyzeFinancials(data.proposedSystemCapacity, data.netProjectCost, data.electricityTariff || 8);
                    setFinancials(finData);
                    
                    const envData = await getEnvironmentalImpact(data.proposedSystemCapacity);
                    setEnvImpact(envData);
                }
            } catch (error) {
                console.error(error);
                addToast('Failed to load quotation or analytics', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchQuotation();
    }, [id]);

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            addToast('Generating PDF...', 'info');
            const response = await generateQuotationPdf(id);
            if (response.base64) {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${response.base64}`;
                link.download = response.filename || `Quotation_${id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                addToast('PDF Downloaded!', 'success');
            } else {
                addToast('Failed to generate PDF', 'error');
            }
        } catch (error) {
            console.error(error);
            addToast('Error downloading PDF', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const handleAction = async (actionFn, ...args) => {
        try {
            setActionLoading(true);
            const updated = await actionFn(id, ...args);
            setQuotation(updated);
            addToast('Action successful!', 'success');
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Action failed', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 text-white min-h-[50vh]">
            <Loader2 className="mb-4 animate-spin" />
            Loading Quotation...
        </div>
    );
    if (!quotation) return <div className="p-10 text-white">Quotation not found</div>;

    return (
        <div className="relative p-6 text-white overflow-hidden">

            <div className="relative z-10 mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-(--color-solar-light-gray) hover:text-white transition-colors">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-2 font-bold transition-all rounded-lg bg-(--color-solar-yellow) text-(--color-deep-navy) hover:bg-(--color-solar-gold) disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                {/* Quotation Preview Card */}
                <div className="p-8 border glass rounded-xl border-white/10 animate-fadeUp">
                    {/* Quotation Header */}
                    <div className="flex items-start justify-between pb-6 mb-6 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-(--color-solar-yellow)">Solar Power Proposal</h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${quotation.status === 'DRAFT' ? 'bg-white/5 text-white/40 border-white/10' :
                                    quotation.status === 'SUBMITTED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        quotation.status.includes('APPROVED') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {quotation.status}
                                </span>
                            </div>
                            {quotation.costEstimationId && (
                                <div 
                                    className="flex items-center gap-2 mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit cursor-pointer hover:bg-blue-500/20 transition-all text-blue-400 group"
                                    onClick={() => navigate(`/cost-estimation/${quotation.costEstimationId}`)}
                                >
                                    <FileText size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Source Estimation</span>
                                    <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                            <p className="text-(--color-solar-light-gray) mt-2">Quotation #: <span className="text-white">{quotation.quotationNumber}</span></p>
                            <p className="text-(--color-solar-light-gray)">Date: {new Date(quotation.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-(--color-solar-yellow) to-(--color-solar-gold)">
                                ₹ {quotation.totalProjectCost?.toLocaleString()}
                            </div>
                            <p className="mt-1 text-sm text-green-400">Total Project Cost</p>
                        </div>
                    </div>

                    {/* Workflow Actions */}
                    <div className="p-6 mb-8 border rounded-2xl bg-white/5 border-white/10">
                        <h3 className="mb-4 text-sm font-bold tracking-widest uppercase text-white/40">Workflow Actions</h3>

                        {quotation.status === 'DRAFT' && (user?.role === 'EMPLOYEE' || user?.role === 'PLANT_ADMIN') && (
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-white/60">This quotation is currently a draft and has not been submitted for approval.</p>
                                <button
                                    onClick={() => handleAction(submitQuotation)}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 px-6 py-2 ml-auto font-bold transition-all rounded-lg bg-(--color-solar-yellow) text-(--color-deep-navy) hover:bg-(--color-solar-gold) disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    Submit for Approval
                                </button>
                            </div>
                        )}

                        {quotation.status === 'SUBMITTED' && user?.role === 'PLANT_ADMIN' && (
                            <div className="space-y-4">
                                <p className="text-sm text-white/60">Review this quotation and provide your approval or rejection.</p>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add remarks (optional)..."
                                    className="w-full p-3 text-sm transition-all outline-none bg-black/20 border border-white/10 rounded-lg focus:border-(--color-solar-yellow)"
                                    rows="2"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => handleAction(rejectQuotation, remarks)}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 px-6 py-2 font-bold transition-all border rounded-lg bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(approveQuotation, remarks)}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 px-6 py-2 font-bold transition-all rounded-lg bg-emerald-500 text-deep-navy hover:bg-emerald-400 disabled:opacity-50"
                                    >
                                        {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                        Approve Quotation
                                    </button>
                                </div>
                            </div>
                        )}

                        {quotation.status === 'SUBMITTED' && user?.role !== 'PLANT_ADMIN' && (
                            <div className="flex items-center gap-3 p-4 border border-blue-500/10 text-blue-400 bg-blue-500/5 rounded-xl">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm font-bold tracking-widest uppercase">Pending Plant Admin Approval</span>
                            </div>
                        )}

                        {quotation.status === 'PLANT_APPROVED' && (
                            <div className="flex items-center gap-3 p-4 border border-emerald-500/10 text-emerald-400 bg-emerald-500/5 rounded-xl">
                                <CheckCircle size={18} />
                                <div>
                                    <span className="block text-sm font-bold tracking-widest uppercase">Approved by Plant Admin</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Awaiting further processing or customer review</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* System Summary */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                        <div className="p-4 border border-white/5 bg-black/20 rounded-lg text-center">
                            <p className="mb-1 text-sm text-(--color-solar-light-gray)">System Capacity</p>
                            <p className="text-2xl font-bold text-white">{quotation.proposedSystemCapacity} kW</p>
                        </div>
                        <div className="p-4 border border-white/5 bg-black/20 rounded-lg text-center">
                            <p className="mb-1 text-sm text-(--color-solar-light-gray)">Annual Generation</p>
                            <p className="text-2xl font-bold text-green-400">{quotation.annualEnergyGeneration?.toLocaleString()} kWh</p>
                        </div>
                        <div className="p-4 border border-white/5 bg-black/20 rounded-lg text-center">
                            <p className="mb-1 text-sm text-(--color-solar-light-gray)">ROI (Payback)</p>
                            <p className="text-2xl font-bold text-(--color-solar-yellow)">{quotation.paybackPeriod} Years</p>
                        </div>
                    </div>

                    {/* Financial Breakdown Table */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-semibold text-white">Financial Breakdown</h3>
                        <div className="overflow-hidden border border-white/10 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 text-[--color-solar-light-gray]">
                                    <tr>
                                        <th className="p-3">Item</th>
                                        <th className="p-3 text-right">Cost (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="p-3">Solar Modules</td><td className="p-3 text-right">{quotation.costSolarModules?.toLocaleString()}</td></tr>
                                    <tr><td className="p-3">Inverters</td><td className="p-3 text-right">{quotation.costInverters?.toLocaleString()}</td></tr>
                                    <tr><td className="p-3">Structure & Hardware</td><td className="p-3 text-right">{quotation.costStructure?.toLocaleString()}</td></tr>
                                    <tr><td className="p-3">Balance of System</td><td className="p-3 text-right">{quotation.costBOS?.toLocaleString()}</td></tr>
                                    <tr><td className="p-3">Installation</td><td className="p-3 text-right">{quotation.costInstallation?.toLocaleString()}</td></tr>
                                    <tr className="bg-solar-yellow/10">
                                        <td className="p-3 font-bold text-white">Total Cost</td>
                                        <td className="p-3 text-right font-bold text-[--color-solar-yellow]">{quotation.totalProjectCost?.toLocaleString()}</td>
                                    </tr>
                                    <tr><td className="p-3 text-green-400">Est. Subsidy</td><td className="p-3 text-right text-green-400">-{quotation.governmentSubsidy?.toLocaleString()}</td></tr>
                                    <tr className="bg-green-500/10 border-t border-green-500/20">
                                        <td className="p-3 font-bold">Net Cost to Customer</td>
                                        <td className="p-3 text-right font-bold text-white">{quotation.netProjectCost?.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* NEW: Financial Intelligence Section */}
                    {financials && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="text-solar-yellow w-6 h-6" />
                            <h3 className="text-xl font-bold tracking-tighter uppercase italic">Financial Intelligence</h3>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                              <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Expected IRR</p>
                                <p className="text-3xl font-black text-solar-yellow tracking-tighter">{financials.irr}%</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Total 25Y Savings</p>
                                <p className="text-3xl font-black text-white tracking-tighter">₹{financials.savings25Years?.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase text-white/20 mb-1">Payback Period</p>
                                <p className="text-xl font-bold">{financials.paybackPeriodYears} Years</p>
                              </div>
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase text-white/20 mb-1">Annual ROI</p>
                                <p className="text-xl font-bold">{financials.roi}%</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-white/20 italic tracking-wider">
                              * Calculations based on 5% annual tariff hike escalation index.
                            </p>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
                          <div className="flex items-center gap-3 mb-6">
                            <Leaf className="text-emerald-400 w-6 h-6" />
                            <h3 className="text-xl font-bold tracking-tighter uppercase italic">Environmental Impact</h3>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-emerald-400/60 mb-1">CO₂ Reduction</p>
                                <p className="text-4xl font-black text-white tracking-tighter">{envImpact?.annualCo2SavedKg?.toLocaleString()} <span className="text-lg">kg/year</span></p>
                              </div>
                              <CloudRain className="w-12 h-12 text-emerald-400/20" />
                            </div>
                            
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                <TreePine className="text-emerald-400 w-8 h-8 mb-4 opacity-40" />
                                <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">Equivalent Trees</p>
                                <p className="text-2xl font-black text-white">{envImpact?.treesEquivalent} Trees</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                <Activity className="text-solar-yellow w-8 h-8 mb-4 opacity-40" />
                                <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">Coal Saved</p>
                                <p className="text-2xl font-black text-white">{envImpact?.coalSavedKg?.toLocaleString()} kg</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewQuotation;
