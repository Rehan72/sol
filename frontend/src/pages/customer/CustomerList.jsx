import React from 'react';
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

import { MOCK_CUSTOMERS } from '../../data/mockData';

const CustomerList = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden p-6 md:p-12">
       {/* Background Effects */}
       <div className="film-grain" />
       <div className="cinematic-vignette" />
       <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
       <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

       <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                  <span className="text-solar-yellow font-black tracking-widest uppercase text-xs block mb-1">
                      User Management
                  </span>
                  <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                      Customer <span className="text-white/40">Directory</span>
                  </h1>
              </div>

              <div className="flex items-center gap-4">
                  <div className="relative hidden md:block group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-solar-yellow transition-colors" />
                      <input 
                          type="text" 
                          placeholder="Search customers..." 
                          className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm w-64 focus:w-80 transition-all focus:outline-none focus:border-solar-yellow/50" 
                      />
                  </div>
                  <Button variant="ghost" className="w-12 h-12 rounded-full glass p-0 border border-white/10 text-white/60 hover:text-white hover:border-white/30 hidden md:flex items-center justify-center">
                      <Filter className="w-5 h-5" />
                  </Button>
                  <Button 
                      onClick={() => navigate('/customer/create')}
                      className="bg-solar-yellow text-deep-navy font-bold uppercase tracking-wider py-6 px-6 hover:bg-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  >
                      <Plus className="w-5 h-5 mr-2" /> Add Customer
                  </Button>
              </div>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 gap-4">
              {MOCK_CUSTOMERS.length === 0 ? (
                  <div className="text-center py-20 text-white/40 bg-white/5 rounded-2xl border border-white/5 dashed">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No customers found.</p>
                  </div>
              ) : (
                  MOCK_CUSTOMERS.map((customer, index) => (
                      <motion.div
                          key={customer.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass p-6 rounded-2xl border border-white/5 hover:border-solar-yellow/30 transition-all group relative overflow-hidden"
                      >
                           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-solar-yellow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           
                           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Avatar / Icon */}
                               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-solar-yellow font-bold text-lg shrink-0">
                                   {customer.fullName.charAt(0)}
                               </div>

                               {/* Info */}
                               <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-white">{customer.fullName}</h3>
                                        {customer.status === 'active' && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wide">
                                                Active
                                            </span>
                                        )}
                                        {customer.status === 'inactive' && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/40 text-[10px] uppercase font-bold tracking-wide">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3 h-3" /> {customer.email}
                                        </div>
                                         <div className="flex items-center gap-1.5">
                                            <Phone className="w-3 h-3" /> {customer.phone}
                                        </div>
                                         <div className="flex items-center gap-1.5">
                                            <ShieldCheck className="w-3 h-3" /> Joined {new Date(customer.joinDate).toLocaleDateString()}
                                        </div>
                                   </div>
                               </div>

                               {/* Location */}
                               <div className="hidden md:block flex-1 border-l border-white/10 pl-6">
                                     <div className="flex items-start gap-2 text-sm text-white/70">
                                         <MapPin className="w-4 h-4 text-solar-yellow shrink-0 mt-0.5" />
                                         <span className="line-clamp-2">{customer.location}</span>
                                     </div>
                               </div>

                                {/* Stats/Actions */}
                               <div className="flex items-center gap-6 md:pl-6 md:border-l border-white/10 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                   <div className="text-center">
                                       <span className="block text-xl font-black text-white">{customer.plants}</span>
                                       <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Plants</span>
                                   </div>
                                   
                                   <Button variant="ghost" className="w-8 h-8 rounded-full hover:bg-white/10 p-0 flex items-center justify-center text-white/40">
                                       <MoreVertical className="w-4 h-4" />
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