import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';

// Mock Data
const PLANTS = [
  { value: 'grid-001', label: 'Sector 45 Residence' },
  { value: 'grid-002', label: 'Industrial Hub Alpha' }
];

const EXISTING_USERS = [
  { value: 'u1', label: 'Alice Springer', email: 'alice@example.com', phone: '1234567890' },
  { value: 'u2', label: 'Bob Martin', email: 'bob@example.com', phone: '0987654321' },
  { value: 'u3', label: 'Charlie Day', email: 'charlie@example.com', phone: '1122334455' },
];

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

function CreateSurveyTeam() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  
  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    teamCode: 'SURVEY-' + Math.floor(Math.random() * 10000), 
    assignedPlant: 'grid-001', 
    status: 'active',
    teamType: 'Survey', // Fixed
    
    // Team Lead
    teamLeadMode: 'existing', 
    teamLeadId: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    
    // Members
    members: [] 
  });

  // Member Selection State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedRole, setSelectedRole] = useState('surveyor');
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'teamName':
        if (!value.trim()) return 'Team Name is required';
        return '';
      case 'leadName':
      case 'leadEmail':
      case 'leadPhone':
        if (formData.teamLeadMode === 'new' && !value.trim()) return 'This field is required for new user';
        return '';
      case 'teamLeadId':
        if (formData.teamLeadMode === 'existing' && !value) return 'Please select a team lead';
        return '';
      default:
        return '';
    }
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
    
    const user = EXISTING_USERS.find(u => u.value === selectedMemberId);
    if (!user) return;
    
    if (formData.members.some(m => m.userId === selectedMemberId)) {
      alert('User already added to team');
      return;
    }

    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { userId: user.value, name: user.label, role: selectedRole }]
    }));
    setSelectedMemberId('');
    setSelectedRole('surveyor');
  };

  const handleRemoveMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.userId !== userId)
    }));
  };

  const handleNext = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    const fieldsToValidate = ['teamName'];
    if (formData.teamLeadMode === 'existing') fieldsToValidate.push('teamLeadId');
    if (formData.teamLeadMode === 'new') fieldsToValidate.push('leadName', 'leadEmail', 'leadPhone');
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.members.length === 0) {
      newErrors.members = 'At least one member is required';
    }

    setErrors(newErrors);
    setTouched(fieldsToValidate.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitting Survey Team:', formData);
      navigate('/survey-teams');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
           <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="teamName" label="Team Name" required touched={touched} errors={errors}>
                        <div className="relative">
                            <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder="e.g., Roof Scout Squad" className={getInputClassName('teamName', touched, errors)} />
                        </div>
                    </FormField>

                    <FormField name="teamCode" label="Team Code" touched={touched} errors={errors}>
                        <input type="text" value={formData.teamCode} disabled className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed" />
                    </FormField>

                    <div className="relative">
                       <Select
                         name="assignedPlant"
                         label="Assigned Grid Plant"
                         value={formData.assignedPlant}
                         options={PLANTS} 
                         onChange={handleChange} 
                         icon={Map}
                         disabled={true} 
                       />
                       <p className="text-xs text-white/30 mt-2 ml-1">* Fixed to current Grid Plant context</p>
                    </div>

                    <FormField name="teamType" label="Team Type" touched={touched} errors={errors}>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-solar-yellow" />
                            <input type="text" value="Survey" disabled className="w-full pl-12 pr-4 py-4 bg-white/5 border border-solar-yellow/30 rounded-xl text-solar-yellow font-bold uppercase tracking-wider cursor-not-allowed" />
                        </div>
                    </FormField>

                    <div className="relative">
                       <Select
                         name="status"
                         label="Status"
                         value={formData.status}
                         onChange={handleChange}
                         options={[{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}]}
                         icon={CheckCircle2}
                       />
                    </div>
                </div>
            </div>
        );
      case 'leadership':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex gap-4 mb-6">
                    <Button type="button" onClick={() => setFormData({...formData, teamLeadMode: 'existing'})} className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors border h-auto ${formData.teamLeadMode === 'existing' ? 'bg-white/10 border-solar-yellow text-solar-yellow' : 'bg-transparent border-white/10 text-white/40 hover:text-white'}`}>
                        Select Existing User
                    </Button>
                    <Button type="button" onClick={() => setFormData({...formData, teamLeadMode: 'new'})} className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors border h-auto ${formData.teamLeadMode === 'new' ? 'bg-white/10 border-solar-yellow text-solar-yellow' : 'bg-transparent border-white/10 text-white/40 hover:text-white'}`}>
                        Create New User
                    </Button>
                </div>

                {formData.teamLeadMode === 'existing' ? (
                     <div className="relative">
                       <Select
                         name="teamLeadId"
                         label="Select Team Lead"
                         value={formData.teamLeadId}
                         onChange={handleChange}
                         options={EXISTING_USERS}
                         icon={User}
                         placeholder="Choose a user..."
                         error={touched.teamLeadId && errors.teamLeadId}
                       />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField name="leadName" label="Full Name" required touched={touched} errors={errors}>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input type="text" name="leadName" value={formData.leadName} onChange={handleChange} className={getInputClassName('leadName', touched, errors)} />
                            </div>
                        </FormField>
                         <FormField name="leadEmail" label="Email Address" required touched={touched} errors={errors}>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} className={getInputClassName('leadEmail', touched, errors)} />
                            </div>
                        </FormField>
                         <FormField name="leadPhone" label="Mobile Number" required touched={touched} errors={errors}>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input type="tel" name="leadPhone" value={formData.leadPhone} onChange={handleChange} className={getInputClassName('leadPhone', touched, errors)} />
                            </div>
                        </FormField>
                    </div>
                )}
            </div>
        );
      case 'members':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row gap-4 items-end mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                     <div className="flex-1 w-full relative">
                       <Select
                         name="memberSelect"
                         label="Select User"
                         value={selectedMemberId}
                         onChange={(e) => setSelectedMemberId(e.target.value)}
                         options={EXISTING_USERS.filter(u => u.value !== formData.teamLeadId && !formData.members.some(m => m.userId === u.value))}
                         icon={User}
                         placeholder="Choose member..."
                       />
                    </div>
                    <div className="w-full md:w-1/3 relative">
                       <Select
                         name="roleSelect"
                         label="Role Tag"
                         value={selectedRole}
                         onChange={(e) => setSelectedRole(e.target.value)}
                         options={SURVEY_ROLES}
                         icon={Tag}
                       />
                    </div>
                    <Button 
                        type="button" 
                        onClick={handleAddMember}
                        disabled={!selectedMemberId}
                        className="w-full md:w-auto h-[52px] bg-solar-yellow text-deep-navy font-bold hover:bg-solar-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">Add Member</span>
                    </Button>
                </div>

                {errors.members && <p className="text-red-400 text-sm font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {errors.members}</p>}

                {/* Members List */}
                <div className="space-y-3">
                    {formData.members.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">No members added yet.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {formData.members.map((member) => (
                                <motion.div 
                                    key={member.userId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-solar-yellow to-orange-500 flex items-center justify-center font-bold text-deep-navy">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{member.name}</p>
                                            <span className="text-xs font-medium uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                <Tag className="w-3 h-3" /> { SURVEY_ROLES.find(r => r.value === member.role)?.label }
                                            </span>
                                        </div>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveMember(member.userId)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        );
      default: return null;
    }
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
        <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate('/survey-teams')} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                </div>
                <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to Teams</span>
            </Button>
            <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                Create <span className="text-solar-yellow">Survey Team</span>
            </h1>
        </div>

        <div className="mx-auto">
             {/* Horizontal Tabs */}
             <div className="mb-8 overflow-x-auto pb-2">
                <nav className="flex items-center gap-2 min-w-max border-b border-white/10">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-4 flex items-center gap-3 transition-colors group ${
                                activeTab === tab.id 
                                ? 'text-solar-yellow' 
                                : 'text-white/40 hover:text-white'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-solar-yellow' : 'text-current'}`} />
                            <span className="font-bold uppercase tracking-wider text-sm whitespace-nowrap">{tab.label}</span>
                            
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-solar-yellow shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    initial={false}
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Form Area */}
            <div>
                 <div className="mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-wider">
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-white/40">
                         {TABS.find(t => t.id === activeTab)?.description}
                    </p>
                </div>
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="glass rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between"
                >
                    <div className="flex-1">
                         {renderContent()}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                        <p className="text-xs text-white/30 hidden sm:block">
                            Step {TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length}
                        </p>
                        <div className="flex gap-4 ml-auto">
                            {activeTab !== 'details' && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                         const currentIndex = TABS.findIndex(t => t.id === activeTab);
                                         if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
                                    }}
                                    className="px-8 text-white/60 hover:text-white"
                                >
                                    Back
                                </Button>
                            )}
                            {activeTab !== 'members' ? (
                                <Button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold px-8"
                                >
                                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                >
                                    Create Team <CheckCircle2 className="w-4 h-4 ml-2" />
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

// Helpers
const getInputClassName = (fieldName, touched, errors) => {
  const hasError = touched[fieldName] && errors[fieldName];
  return `w-full pl-12 pr-4 py-3.5 bg-white/5 border ${
    hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-solar-yellow/50'
  } rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors`;
};

const FormField = ({ name, label, required, children, className = '', touched = {}, errors = {} }) => (
  <div className={className}>
    <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${
      touched[name] && errors[name] ? 'text-red-400' : 'text-white/60'
    }`}>
      {label} {required && '*'}
    </label>
    {children}
    {touched[name] && errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-xs mt-2 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" /> {errors[name]}
      </motion.p>
    )}
  </div>
);

export default CreateSurveyTeam;
