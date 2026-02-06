import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Map, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Clock,
  Calendar,
  MapPin,
  Tag,
  Pen,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/button';

// Mock Data
const TEAM_DATA = {
    id: 1,
    teamName: 'Survey Squad A',
    teamCode: 'SURVEY-8832',
    status: 'active',
    assignedPlant: 'Sector 45 Residence',
    teamLead: {
        name: 'Alice Springer',
        email: 'alice@example.com',
        phone: '+1 (555) 999-8888',
        avatar: null
    },
    members: [
        { id: 'm1', name: 'James Cook', role: 'Surveyor', avatar: null },
        { id: 'm2', name: 'Sarah Lee', role: 'Engineer', avatar: null },
        { id: 'm3', name: 'Mike Ross', role: 'Helper', avatar: null },
    ],
    stats: {
        sitesSurveyed: 45,
        avgCompletionTime: '5 Hours',
        pendingSurveys: 3
    }
};

function SurveyTeamDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // In real app, fetch team by ID
  const team = TEAM_DATA;

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
      {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/survey-teams')} className="w-12 h-12 rounded-full glass flex items-center justify-center p-0 hover:bg-white/10 group">
                    <ArrowLeft className="w-6 h-6 text-solar-yellow group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                        {team.teamName}
                    </h1>
                    <div className="flex items-center gap-3 text-white/50 text-sm mt-1">
                        <span className="flex items-center gap-1"><Map className="w-3 h-3" /> Team ID: {team.teamCode}</span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wide">Installation Pending</span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3 h-3" /> {team.status}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                 <Button className="glass hover:bg-white/10 text-white border border-white/10">
                     <Pen className="w-4 h-4 mr-2" /> Edit Team
                 </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Team Lead & Contact */}
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-solar-yellow to-orange-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-solar-yellow" /> Team Lead
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                             {team.teamLead.avatar ? (
                                <img src={team.teamLead.avatar} alt={team.teamLead.name} className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-2xl font-bold">{team.teamLead.name.charAt(0)}</span>
                             )}
                        </div>
                        <div>
                            <p className="text-xl font-bold">{team.teamLead.name}</p>
                            <p className="text-solar-yellow text-sm font-medium">Lead Surveyor</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-white/60" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase font-bold">Email</p>
                                <p className="text-sm font-medium">{team.teamLead.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <Phone className="w-4 h-4 text-white/60" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase font-bold">Mobile</p>
                                <p className="text-sm font-medium">{team.teamLead.phone}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-6"
                >
                     <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                        <Map className="w-4 h-4 text-solar-yellow" /> Assignment
                    </h3>
                    <div className="p-4 rounded-xl bg-linear-to-br from-white/5 to-white/0 border border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Assigned Grid Plant</p>
                        <p className="text-lg font-bold text-white mb-2">{team.assignedPlant}</p>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <MapPin className="w-3 h-3" /> Gurugram, Haryana
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-6"
                >
                     <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" /> Next Phase
                    </h3>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Assigned Installation Team</p>
                        <p className="text-lg font-bold text-white mb-2">Alpha Installers</p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                            <Clock className="w-3 h-3" /> Waiting for Handoff
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Members & Stats */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Stats Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {[
                        { label: 'Sites Surveyed', value: team.stats.sitesSurveyed, icon: CheckCircle2, color: 'text-emerald-400' },
                        { label: 'Avg Time', value: team.stats.avgCompletionTime, icon: Clock, color: 'text-solar-yellow' },
                        { label: 'Pending', value: team.stats.pendingSurveys, icon: Calendar, color: 'text-orange-400' },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                             </div>
                             <div>
                                 <p className="text-xs text-white/40 uppercase font-bold">{stat.label}</p>
                                 <p className="text-xl font-black">{stat.value}</p>
                             </div>
                        </div>
                    ))}
                </motion.div>

                {/* Team Members List */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wide">Team Members</h2>
                            <p className="text-white/40 text-sm">Active surveyors and engineers</p>
                        </div>
                        <Button variant="ghost" className="text-solar-yellow hover:text-white">
                            <Plus className="w-4 h-4 mr-2" /> Add Member
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.members.map((member) => (
                            <div key={member.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-solar-yellow/30 hover:bg-white/10 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white/80 border border-white/10">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold group-hover:text-solar-yellow transition-colors">{member.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Tag className="w-3 h-3 text-white/30" />
                                            <span className="text-xs font-medium text-white/60 uppercase tracking-wide">{member.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>

      </div>
    </div>
  );
}

export default SurveyTeamDetail;
