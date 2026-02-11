import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, MessageSquare, Clock, CheckCircle2, AlertCircle, FileText, Wrench } from 'lucide-react';
import { Button } from '../../components/ui/button';
import client from '../../api/client';

const CustomerTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await client.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await client.post('/tickets', { description });
      setDescription('');
      setShowCreateModal(false);
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      ASSIGNED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      REPORTED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      QUOTED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      PAID: 'bg-green-500/10 text-green-400 border-green-500/20',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col selection:bg-solar-yellow/30">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service & Support</h1>
          <p className="text-gray-400">Manage your installation maintenance and support tickets</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-yellow/80 flex items-center gap-2 px-6 py-6 rounded-xl transition-all shadow-lg shadow-solar-yellow/10"
        >
          <Plus size={20} />
          Raise New Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/10" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 glass border-dashed border-white/10 rounded-3xl">
            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No active tickets</h3>
            <p className="text-gray-400">If you're experiencing issues, raise a ticket for support.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="group glass p-6 rounded-[1rem] hover:border-solar-yellow/20 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Left Hover Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`p-3 rounded-xl border ${getStatusStyle(ticket.status)}`}>
                    <Wrench size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-mono text-blue-400 font-bold">{ticket.ticketNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h3 className="text-white font-medium text-lg leading-tight line-clamp-1">{ticket.description}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      {ticket.maintenanceTeam && (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-blue-500" />
                          Team Assigned: {ticket.maintenanceTeam.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-deep-navy border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Raise Service <span className="text-solar-yellow italic">Ticket</span></h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white transition-colors p-2">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Issue Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px] transition-all"
                    placeholder="Tell us what's wrong with your solar system..."
                  />
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                  <AlertCircle className="text-blue-400 shrink-0" size={20} />
                  <p className="text-sm text-blue-400/80">
                    A maintenance team from your local plant will be assigned to visit your site and investigate the issue.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 py-6 rounded-xl font-bold border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-6 rounded-xl font-bold bg-solar-yellow text-deep-navy hover:bg-solar-yellow/90 shadow-lg shadow-solar-yellow/10"
                  >
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CustomerTickets;
