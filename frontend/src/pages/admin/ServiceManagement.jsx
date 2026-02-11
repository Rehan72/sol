import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  FileText, 
  ArrowRight,
  Clock,
  MapPin,
  AlertTriangle,
  ClipboardCheck,
  MoreVertical,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import client from '../../api/client';

const ServiceManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Assignment State
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Report State
  const [reportData, setReportData] = useState({
    summary: '',
    defectFound: false,
    findings: ''
  });

  const fetchData = async () => {
    try {
      const [ticketsRes, teamsRes] = await Promise.all([
        client.get('/tickets'),
        client.get('/teams?type=MAINTENANCE')
      ]);
      setTickets(ticketsRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTeam = async () => {
    try {
      await client.patch(`/tickets/${selectedTicket.id}/assign`, { teamId: selectedTeamId });
      setShowAssignModal(false);
      fetchData();
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error assigning team:', error);
    }
  };

  const handleUploadReport = async () => {
    try {
      await client.post(`/tickets/${selectedTicket.id}/report`, reportData);
      setShowReportModal(false);
      fetchData();
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error uploading report:', error);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
            Service <span className="text-solar-yellow italic">Management</span>
          </h1>
          <p className="text-gray-400">Oversee maintenance operations and customer support tickets</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search tickets, customers, plants..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Open Tickets', value: tickets.filter(t => t.status === 'OPEN').length, icon: AlertTriangle, color: 'text-blue-400' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'ASSIGNED').length, icon: Clock, color: 'text-purple-400' },
          { label: 'Reported Defects', value: tickets.filter(t => t.status === 'REPORTED' || t.status === 'QUOTED').length, icon: ClipboardCheck, color: 'text-orange-400' },
          { label: 'Resolved', value: tickets.filter(t => t.status === 'COMPLETED').length, icon: CheckCircle, color: 'text-emerald-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl border border-white/5 hover:border-solar-yellow/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[1rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Plant / Region</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Maintenance Team</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-10 bg-white/5 rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">No tickets found</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-6 py-4 whitespace-nowrap relative overflow-hidden">
                      {/* Left Hover Indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                      <div>
                        <div className="text-blue-400 font-mono font-bold text-sm mb-0.5">{ticket.ticketNumber}</div>
                        <div className="text-white text-sm font-medium truncate max-w-[200px]">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white text-sm">{ticket.customer?.name}</div>
                      <div className="text-gray-500 text-xs">{ticket.customer?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin size={14} className="text-blue-500/60" />
                        {ticket.customer?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.maintenanceTeam ? (
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Users size={14} className="text-blue-400" />
                          {ticket.maintenanceTeam.name}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        {ticket.status === 'OPEN' && (
                          <Button 
                            onClick={() => { setSelectedTicket(ticket); setShowAssignModal(true); }}
                            variant="glassPrimary"
                            size="sm"
                            className="font-bold rounded-xl shadow-[0_0_15px_rgba(255,191,0,0.2)] hover:shadow-[0_0_20px_rgba(255,191,0,0.3)] transition-all duration-300"
                          >
                            Assign Team
                          </Button>
                        )}
                        {ticket.status === 'ASSIGNED' && (
                          <Button 
                            onClick={() => { setSelectedTicket(ticket); setShowReportModal(true); }}
                            variant="glass"
                            size="sm"
                            className="text-purple-400 border-purple-500/20 font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                          >
                            Upload Report
                          </Button>
                        )}
                        {['REPORTED', 'QUOTED', 'PAID'].includes(ticket.status) && (
                          <Button 
                            variant="ghost"
                            size="icon-sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <FileText size={18} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Team Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-deep-navy border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Assign Maintenance <span className="text-solar-yellow italic">Team</span></h2>
                <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2 font-medium">FOR TICKET</div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-blue-400 font-mono font-bold text-xs">{selectedTicket?.ticketNumber}</div>
                  <div className="text-white text-sm">{selectedTicket?.description}</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <label className="block text-sm font-medium text-gray-400">Available Teams</label>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {teams.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10 text-sm">
                      No maintenance teams available. Create one first.
                    </div>
                  ) : (
                    teams.map(team => (
                      <div 
                        key={team.id}
                        onClick={() => setSelectedTeamId(team.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedTeamId === team.id 
                            ? 'bg-blue-600 border-blue-500 ring-4 ring-blue-500/20' 
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white/10 ${selectedTeamId === team.id ? 'text-white' : 'text-blue-400'}`}>
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="text-white text-sm font-semibold">{team.name}</div>
                            <div className={`text-xs ${selectedTeamId === team.id ? 'text-blue-100' : 'text-gray-500'}`}>
                              {team.membersCount} Members • Lead: {team.teamLead?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                        {selectedTeamId === team.id && <CheckCircle size={18} className="text-white" />}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Button
                disabled={!selectedTeamId}
                onClick={handleAssignTeam}
                className="w-full bg-solar-yellow text-deep-navy font-bold py-6 rounded-xl hover:bg-solar-yellow/90 shadow-[0_0_30px_rgba(255,191,0,0.3)] flex items-center justify-center gap-2"
              >
                Confirm Assignment
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-deep-navy border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Service Visit <span className="text-solar-yellow italic">Report</span></h2>
                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-gray-400 mb-1">TICKET</div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm font-mono">
                    {selectedTicket?.ticketNumber}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">ASSIGNED TEAM</div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm">
                    {selectedTicket?.maintenanceTeam?.name}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Visit Summary</label>
                  <input
                    type="text"
                    value={reportData.summary}
                    onChange={(e) => setReportData({...reportData, summary: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Brief objective of the visit..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Findings</label>
                  <textarea
                    value={reportData.findings}
                    onChange={(e) => setReportData({...reportData, findings: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                    placeholder="Describe what was observed during the site visit..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <input
                    type="checkbox"
                    id="defectFound"
                    checked={reportData.defectFound}
                    onChange={(e) => setReportData({...reportData, defectFound: e.target.checked})}
                    className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-blue-600 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="defectFound" className="text-white font-medium cursor-pointer flex-1">
                    Major defect found (Requires component replacement/repair)
                  </label>
                  <div className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-bold">
                    Triggers Quotation
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowReportModal(false)}
                    variant="outline"
                    className="flex-1 py-6 rounded-xl font-bold border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadReport}
                    className="flex-1 py-6 rounded-xl font-bold bg-solar-yellow text-deep-navy hover:bg-solar-yellow/90 shadow-[0_0_30px_rgba(255,191,0,0.3)]"
                  >
                    Complete Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ServiceManagement;
