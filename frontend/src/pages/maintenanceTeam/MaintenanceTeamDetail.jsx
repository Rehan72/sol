import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Briefcase,
    ShieldCheck,
    Mail,
    Phone,
    User,
    Clock,
    Calendar,
    MapPin,
    Tag,
    Pen,
    CheckCircle2,
    Wrench,
    Plus,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import TeamService from '../../services/TeamService';
import { useToast } from '../../hooks/useToast';

function MaintenanceTeamDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setLoading(true);
                const data = await TeamService.getTeamById(id);
                setTeam(data);
                setError(null);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch team details", err);
                setError("Failed to load team details");
                addToast("Could not load team information", 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTeam();
        }
    }, [id, addToast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-navy flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-solar-yellow animate-spin mb-4" />
                <p className="text-white/60 font-medium uppercase tracking-widest animate-pulse">Scanning Bio-Metrics...</p>
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className="min-h-screen bg-deep-navy flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-black uppercase mb-2">Access Denied</h1>
                <p className="text-white/40 mb-8 max-w-md">{error || "The requested team data could not be retrieved from the central database."}</p>
                <Button onClick={() => navigate('/maintenance-teams')} className="bg-solar-yellow text-deep-navy font-bold hover:bg-white transition-colors">
                    Return to Grid
                </Button>
            </div>
        );
    }

    // Default stats if not available from API
    const stats = {
        completedJobs: 0,
        avgCompletionTime: 'N/A',
        teamSize: (team.members?.length || 0) + (team.teamLead ? 1 : 0)
    };

    return (
        <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
            {/* Cinematic Overlays */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/maintenance-teams')} className="w-12 h-12 rounded-full glass flex items-center justify-center p-0 hover:bg-white/10 group">
                            <ArrowLeft className="w-6 h-6 text-solar-yellow group-hover:-translate-x-1 transition-transform" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black uppercase rim-light tracking-tighter">
                                {team.name.split(' ').length > 1 ? (
                                    <>
                                        {team.name.split(' ').slice(0, -1).join(' ')}{' '}
                                        <span className="text-solar-yellow">{team.name.split(' ').slice(-1)}</span>
                                    </>
                                ) : team.name.includes('-') ? (
                                    <>
                                        {team.name.split('-').slice(0, -1).join('-')}-
                                        <span className="text-solar-yellow">{team.name.split('-').slice(-1)}</span>
                                    </>
                                ) : (
                                    team.name
                                )}
                            </h1>
                            <div className="flex items-center gap-3 text-white/50 text-sm mt-1">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Team ID: {team.code}</span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="flex items-center gap-1 text-emerald-400 capitalize"><ShieldCheck className="w-3 h-3" /> {team.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            onClick={() => navigate(`/maintenance-teams/edit/${team.id}`)}
                            className="glass hover:bg-white/10 text-white border border-white/10"
                        >
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
                                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
                                    {team.teamLead?.avatar ? (
                                        <img src={team.teamLead.avatar} alt={team.teamLead.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-linear-to-br from-solar-yellow/20 to-orange-500/20 text-solar-yellow border border-solar-yellow/30">
                                            {team.teamLead?.name?.charAt(0) || <User className="w-8 h-8 opacity-40" />}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{team.teamLead?.name || 'N/A'}</p>
                                    <p className="text-solar-yellow text-sm font-medium">Lead Engineer</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-white/60" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-white/40 uppercase font-bold">Email</p>
                                        <p className="text-sm font-medium truncate">{team.teamLead?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-white/60" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase font-bold">Mobile</p>
                                        <p className="text-sm font-medium">{team.teamLead?.phone || 'N/A'}</p>
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
                                <Briefcase className="w-4 h-4 text-solar-yellow" /> Assignment
                            </h3>
                            <div className="p-4 rounded-xl bg-linear-to-br from-white/5 to-white/0 border border-white/10">
                                <p className="text-xs text-white/40 uppercase font-bold mb-1">Assigned Customer</p>
                                <p className="text-lg font-bold text-white mb-2">{team.customer?.name || team.customer?.email || 'Unassigned'}</p>
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <MapPin className="w-3 h-3 text-solar-yellow" /> {team.customer?.location || 'Location Not Specified'}
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
                                { label: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle2, color: 'text-emerald-400' },
                                { label: 'Avg Completion', value: stats.avgCompletionTime, icon: Clock, color: 'text-white' },
                                { label: 'Team Size', value: stats.teamSize, icon: Users, color: 'text-solar-yellow' },
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
                                    <p className="text-white/40 text-sm">Active crew members</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => navigate(`/maintenance-teams/edit/${team.id}`)}
                                    className="text-solar-yellow hover:text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Member
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {team.members && team.members.length > 0 ? (
                                    team.members.map((member) => (
                                        <div key={member.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-solar-yellow/30 hover:bg-white/10 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white/80 border border-white/10">
                                                    {member.user?.name?.charAt(0) || 'M'}
                                                </div>
                                                <div>
                                                    <p className="font-bold group-hover:text-solar-yellow transition-colors">{member.user?.name || 'Unknown User'}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Tag className="w-3 h-3 text-white/30" />
                                                        <span className="text-xs font-medium text-white/60 uppercase tracking-wide">{member.role}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => navigate(`/maintenance-teams/edit/${team.id}`)}
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                                                >
                                                    <Pen className="w-3 h-3 text-solar-yellow" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                        <Users className="w-12 h-12 text-white/10 mx-auto mb-3" />
                                        <p className="text-white/30 text-sm italic">No security personnel assigned to this squad.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default MaintenanceTeamDetail;
