import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Map,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import TeamService from '../../services/TeamService';
import EmployeeService from '../../services/EmployeeService';
import CustomerService from '../../services/CustomerService';
import { useToast } from '../../hooks/useToast';

const SURVEY_ROLES = [
  { value: 'surveyor', label: 'Surveyor' },
  { value: 'engineer', label: 'Site Engineer' },
  { value: 'inspector', label: 'Site Inspector' },
  { value: 'supervisor', label: 'Supervisor' },
];

const TABS = [
  { id: 'details', label: 'Team Details', icon: Map, description: 'Basic survey information' },
  { id: 'leadership', label: 'Team Lead', icon: ShieldCheck, description: 'Responsible surveyor' },
  { id: 'members', label: 'Members', icon: Users, description: 'Add surveyors and engineers' },
];

function EditSurveyTeam() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingUsers, setExistingUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    teamName: '',
    teamCode: '',
    assignedCustomer: '',
    status: 'active',
    teamType: 'SURVEY',
    teamLeadMode: 'existing',
    teamLeadId: '',
    members: []
  });

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedRole, setSelectedRole] = useState('surveyor');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchCustomers()]);
        if (id) {
          await fetchTeamDetails();
        }
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const team = await TeamService.getTeamById(id);
      setFormData({
        teamName: team.name,
        teamCode: team.code,
        assignedCustomer: team.customer?.id || '',
        status: team.status,
        teamType: team.type,
        teamLeadMode: 'existing',
        teamLeadId: team.teamLead?.id || '',
        members: team.members?.map(m => ({
          userId: m.user?.id,
          name: m.user?.name || m.user?.email,
          role: m.role
        })) || []
      });
    } catch (error) {
      console.error("Failed to fetch team details", error);
      addToast("Failed to load team details", 'error');
      navigate('/survey-teams');
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data.map(c => ({ value: c.id, label: c.name || c.email })));
    } catch (error) {
       console.error("Failed to fetch customers", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await EmployeeService.getAllEmployees();
      setExistingUsers(users.map(u => ({ value: u.id, label: u.name || u.email })));
    } catch (error) {
       console.error("Failed to fetch users", error);
    }
  };

  const validateField = (name, value) => {
    if (name === 'teamName' && !value.trim()) return 'Team Name is required';
    if (name === 'teamLeadId' && !value) return 'Team Lead is required';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleAddMember = () => {
    if (!selectedMemberId) return;
    const user = existingUsers.find(u => u.value === selectedMemberId);
    if (!user) return;
    if (formData.members.some(m => m.userId === selectedMemberId)) {
      addToast('Member already added', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { userId: user.value, name: user.label, role: selectedRole }]
    }));
    setSelectedMemberId('');
  };

  const handleRemoveMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.userId !== userId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      teamName: validateField('teamName', formData.teamName),
      teamLeadId: validateField('teamLeadId', formData.teamLeadId)
    };
    if (formData.members.length === 0) newErrors.members = 'At least one member is required';

    setErrors(newErrors);
    if (!Object.values(newErrors).some(err => err)) {
      setLoading(true);
      try {
        const payload = {
          name: formData.teamName,
          code: formData.teamCode,
          status: formData.status,
          customerId: formData.assignedCustomer,
          teamLeadId: formData.teamLeadId,
          members: formData.members.map(m => ({ userId: m.userId, role: m.role }))
        };
        await TeamService.updateTeam(id, payload);
        addToast('Survey Team Updated!', 'success');
        navigate(`/survey-teams/${id}`);
      } catch (error) {
        addToast(error.response?.data?.message || 'Update failed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetching) {
     return (
       <div className="min-h-screen bg-deep-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-solar-yellow animate-spin" />
       </div>
     );
  }

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden font-inter">
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(`/survey-teams/${id}`)} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-solar-yellow" />
            </div>
            <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to Details</span>
          </Button>
          <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
            Edit <span className="text-solar-yellow">Survey Team</span>
          </h1>
        </div>

        <div className="mx-auto">
          <div className="mb-8 overflow-x-auto pb-2">
            <nav className="flex items-center gap-2 min-w-max border-b border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 flex items-center gap-3 transition-colors group ${activeTab === tab.id ? 'text-solar-yellow' : 'text-white/40 hover:text-white'}`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-solar-yellow' : 'text-current'}`} />
                  <span className="font-bold uppercase tracking-wider text-sm whitespace-nowrap">{tab.label}</span>
                  {activeTab === tab.id && <motion.div layoutId="activeTabEditSurvey" className="absolute bottom-0 left-0 right-0 h-0.5 bg-solar-yellow shadow-[0_0_10px_rgba(255,215,0,0.5)]" />}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-black uppercase tracking-wider">{TABS.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-white/40 italic">{TABS.find(t => t.id === activeTab)?.description}</p>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 md:p-12 min-h-[450px] flex flex-col justify-between border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <Map className="w-64 h-64 -rotate-12" />
              </div>

              <div className="flex-1">
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-white/40">Team Name</label>
                       <div className="relative">
                          <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-solar-yellow transition-all outline-none" />
                       </div>
                       {errors.teamName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.teamName}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-white/40">Team Code</label>
                       <input type="text" value={formData.teamCode} disabled className="w-full px-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white/30 cursor-not-allowed uppercase font-mono tracking-widest" />
                    </div>
                     <Select
                      name="assignedCustomer"
                      label="Assigned Customer"
                      value={formData.assignedCustomer}
                      options={customers}
                      onChange={handleChange}
                      icon={Users}
                    />
                    <Select
                      name="status"
                      label="Operational Status"
                      value={formData.status}
                      options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
                      onChange={handleChange}
                      icon={CheckCircle2}
                    />
                  </div>
                )}

                {activeTab === 'leadership' && (
                   <div className="max-w-xl mx-auto py-12">
                      <Select
                         name="teamLeadId"
                         label="Deploy Team Lead"
                         value={formData.teamLeadId}
                         options={existingUsers}
                         onChange={handleChange}
                         icon={ShieldCheck}
                         placeholder="Select lead surveyor..."
                         error={errors.teamLeadId}
                      />
                   </div>
                )}

                {activeTab === 'members' && (
                   <div className="space-y-8">
                     <div className="flex flex-col md:flex-row gap-4 items-end p-6 glass rounded-2xl border-white/5 bg-white/5">
                        <div className="flex-1 w-full">
                           <Select
                             name="memberSelect"
                             label="Select Field Staff"
                             value={selectedMemberId}
                             onChange={(e) => setSelectedMemberId(e.target.value)}
                             options={existingUsers.filter(u => u.value !== formData.teamLeadId && !formData.members.some(m => m.userId === u.value))}
                             icon={User}
                             placeholder="Select resource..."
                           />
                        </div>
                        <div className="w-full md:w-1/3">
                            <Select
                              name="roleSelect"
                              label="Role Designation"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              options={SURVEY_ROLES}
                              icon={Tag}
                            />
                        </div>
                        <Button type="button" onClick={handleAddMember} disabled={!selectedMemberId} className="h-[52px] px-8 bg-solar-yellow text-deep-navy font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                            <Plus className="w-5 h-5" /> ADD
                        </Button>
                    </div>

                    {errors.members && <p className="text-red-400 text-sm font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {errors.members}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                          {formData.members.map((member) => (
                            <motion.div
                              key={member.userId}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group flex items-center justify-between p-4 glass rounded-xl border-white/5 hover:border-solar-yellow/30 bg-white/5 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-solar-yellow/10 flex items-center justify-center font-black text-solar-yellow border border-solar-yellow/20 uppercase">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-sm tracking-tight">{member.name}</p>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{member.role}</span>
                                </div>
                              </div>
                              <Button type="button" variant="ghost" onClick={() => handleRemoveMember(member.userId)} className="h-8 w-8 rounded-full hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-colors">
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Survey Phase {TABS.findIndex(t => t.id === activeTab) + 1}</p>
                 <div className="flex gap-4">
                   {activeTab !== 'details' && (
                     <Button type="button" variant="ghost" onClick={() => {
                         const idx = TABS.findIndex(t => t.id === activeTab);
                         if (idx > 0) setActiveTab(TABS[idx - 1].id);
                     }} className="px-8 text-white/40 hover:text-white uppercase font-black text-xs tracking-widest">Back</Button>
                   )}
                   {activeTab !== 'members' ? (
                     <Button type="button" onClick={() => {
                         const idx = TABS.findIndex(t => t.id === activeTab);
                         if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
                     }} className="bg-solar-yellow text-deep-navy font-black px-10 rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg flex items-center gap-2">CONTINUE <ChevronRight className="w-4 h-4" /></Button>
                   ) : (
                     <Button type="submit" disabled={loading} className="bg-white text-deep-navy font-black px-12 rounded-full hover:bg-solar-yellow hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                       {loading ? 'SYNCING...' : 'UPDATE TEAM'}
                     </Button>
                   )}
                 </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSurveyTeam;
