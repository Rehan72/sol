import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    FileText, 
    Download, 
    Sun,
    Printer,
    Share2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_INVOICES } from '../../data/mockData';

const CustomerInvoices = () => {
    const navigate = useNavigate();
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    return (
        <div className="min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Cinematic Background */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />

            {/* Navbar */}
             <div className="relative z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-solar-yellow/20 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-solar-yellow" />
                    </div>
                    <span className="font-black tracking-tighter uppercase text-lg">Solar<span className="text-solar-yellow">Connect</span></span>
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase text-white">Invoices</h1>
                        <p className="text-white/50">View and download your payment receipts</p>
                    </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden border border-white/5">
                    {MOCK_INVOICES.map((invoice, idx) => (
                        <motion.div 
                            key={invoice.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-solar-yellow transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-white">{invoice.item}</h3>
                                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40 font-mono">{invoice.id} • {invoice.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="font-bold text-white">₹{invoice.total.toLocaleString()}</p>
                                    <p className="text-xs text-white/40">Includes GST</p>
                                </div>
                                <Button 
                                    onClick={() => setSelectedInvoice(invoice)}
                                    size="sm" 
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/5"
                                >
                                    <Download className="w-4 h-4 mr-2" /> View
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    {MOCK_INVOICES.length === 0 && (
                        <div className="p-12 text-center text-white/30">
                            No invoices generated yet.
                        </div>
                    )}
                </div>
            </div>

            {/* INVOICE PREVIEW MODAL */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedInvoice(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white text-black rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Invoice Paper Style */}
                            <div className="p-8 md:p-12 bg-white relative">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">INVOICE</h2>
                                        <p className="text-gray-500 text-sm font-mono">#{selectedInvoice.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">SolarConnect Pvt Ltd</h3>
                                        <p className="text-gray-500 text-xs">GSTIN: 10ABCDE1234F1Z9</p>
                                        <p className="text-gray-500 text-xs">Patna, Bihar, India</p>
                                    </div>
                                </div>

                                {/* Bill To */}
                                <div className="mb-12 flex justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</p>
                                        <p className="font-bold text-gray-900">Rahul Kumar</p>
                                        <p className="text-gray-600 text-sm">Patna, Bihar</p>
                                    </div>
                                    <div className="text-right">
                                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</p>
                                         <p className="font-bold text-gray-900">{selectedInvoice.date}</p>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="mb-8">
                                    <div className="border-b-2 border-gray-100 pb-4 mb-4 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <span>Description</span>
                                        <span>Amount</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-medium text-gray-900">{selectedInvoice.item}</span>
                                        <span className="font-mono text-gray-900">₹{selectedInvoice.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-8 text-gray-500 text-sm">
                                        <span>GST (5%)</span>
                                        <span className="font-mono">₹{selectedInvoice.gst.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-100 pt-4 flex justify-between items-center">
                                        <span className="font-bold text-xl text-gray-900">Total</span>
                                        <span className="font-bold text-2xl text-gray-900 font-mono">₹{selectedInvoice.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 pt-8 mt-12 text-center text-xs text-gray-400">
                                    <p>This is a computer generated invoice and does not require a signature.</p>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-100">
                                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
                                <Button className="bg-gray-900 text-white hover:bg-black">
                                    <Printer className="w-4 h-4 mr-2" /> Print
                                </Button>
                                <Button className="bg-gray-900 text-white hover:bg-black">
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerInvoices;
