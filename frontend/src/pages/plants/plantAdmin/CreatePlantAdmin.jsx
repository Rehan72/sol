import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  FileBadge,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import Select from '../../../components/ui/Select';

// Mock Data for Plants
const MOCK_PLANTS = [
  { id: 'plant-1', name: 'Sector 45 Solar Grid', code: 'SOL-2024-001', region: 'North Region', assignedAdminId: null },
  { id: 'plant-2', name: 'Industrial Hub Alpha', code: 'SOL-2024-002', region: 'West Region', assignedAdminId: 'existing-admin-1' }, // Already assigned
  { id: 'plant-3', name: 'Green Valley Farm', code: 'SOL-2024-003', region: 'South Region', assignedAdminId: null },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const TABS = [
  { id: 'identity', label: 'Identity & Status', icon: User, description: 'Personal details & role' },
  { id: 'assignment', label: 'Plant Assignment', icon: Building2, description: 'Assign grid plant' },
];

function CreatePlantAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: 'PLANT_ADMIN',
    status: 'active',
    assignedPlantId: '',
    region: '',
    plantCode: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [plants] = useState(MOCK_PLANTS);

  // Helper to get available plants options
  const plantOptions = plants.map(p => ({
    value: p.id,
    label: p.name,
    disabled: !!p.assignedAdminId // Disable if already assigned
  }));

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        return '';
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Invalid mobile number (10 digits)';
        return '';
      case 'assignedPlantId':
        if (!value) return 'Plant assignment is critical';
        // Check availability
        const selectedPlant = plants.find(p => p.id === value);
        if (selectedPlant && selectedPlant.assignedAdminId) {
             return 'This plant is already assigned to another admin';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill logic for Plant Selection
    if (name === 'assignedPlantId') {
      const selectedPlant = plants.find(p => p.id === value);
      if (selectedPlant) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          region: selectedPlant.region,
          plantCode: selectedPlant.code
        }));
      } else {
         setFormData(prev => ({
          ...prev,
          [name]: value,
          region: '',
          plantCode: ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleNext = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    // Validate current tab fields before proceeding
    const currentTabFields = currentIndex === 0 
        ? ['fullName', 'email', 'mobile'] 
        : ['assignedPlantId'];
    
    const newErrors = {};
    let hasError = false;
    
    currentTabFields.forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
            hasError = true;
        }
    });

    if (hasError) {
        setErrors(prev => ({ ...prev, ...newErrors }));
        setTouched(prev => ({ ...prev, ...currentTabFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}) }));
        return;
    }

    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      console.log('Valid Form Data:', formData);
      navigate('/plant-admin');
    }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'identity':
              return (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="fullName" label="Full Name" required touched={touched} errors={errors}>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input 
                                    type="text" 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="e.g. John Doe" 
                                    className={getInputClassName('fullName', touched, errors)} 
                                />
                            </div>
                        </FormField>

                        <div className="relative">
                            <Select
                                name="status"
                                label="Account Status"
                                value={formData.status}
                                onChange={handleChange}
                                options={STATUS_OPTIONS}
                                icon={CheckCircle2}
                            />
                        </div>

                        <FormField name="email" label="Email Address" required touched={touched} errors={errors}>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="john@example.com" 
                                    className={getInputClassName('email', touched, errors)} 
                                />
                            </div>
                        </FormField>

                        <FormField name="mobile" label="Mobile Number" required touched={touched} errors={errors}>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input 
                                    type="tel" 
                                    name="mobile" 
                                    value={formData.mobile} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    placeholder="+91 98765 43210" 
                                    className={getInputClassName('mobile', touched, errors)} 
                                />
                            </div>
                        </FormField>

                        <FormField name="role" label="Assigned Role" touched={touched} errors={errors}>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-solar-yellow" />
                                <input 
                                    type="text" 
                                    value="PLANT_ADMIN" 
                                    disabled 
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-solar-yellow font-bold uppercase tracking-wider cursor-not-allowed opacity-80" 
                                />
                            </div>
                        </FormField>
                    </div>
                </div>
              );
          case 'assignment':
              return (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative md:col-span-2">
                            <Select
                                name="assignedPlantId"
                                label="Assign Grid Plant"
                                value={formData.assignedPlantId}
                                onChange={handleChange}
                                options={plantOptions}
                                icon={Building2}
                                placeholder="Select a Plant from List"
                                error={touched.assignedPlantId && errors.assignedPlantId}
                                required
                            />
                            {formData.assignedPlantId && (
                                <div className="absolute top-0 right-0 mt-1 mr-1">
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                                        <CheckCircle2 className="w-3 h-3" /> Available & Selected
                                    </span>
                                </div>
                            )}
                        </div>

                        <FormField name="plantCode" label="Plant Code" touched={touched} errors={errors}>
                            <div className="relative">
                                <FileBadge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input 
                                    type="text" 
                                    value={formData.plantCode} 
                                    readOnly
                                    placeholder="Auto-filled"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white/60 cursor-not-allowed" 
                                />
                            </div>
                        </FormField>

                        <FormField name="region" label="Plant Region" touched={touched} errors={errors}>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input 
                                    type="text" 
                                    value={formData.region} 
                                    readOnly
                                    placeholder="Auto-filled"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white/60 cursor-not-allowed" 
                                />
                            </div>
                        </FormField>
                    </div>
                </div>
              );
          default: return null;
      }
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden text-left">
       {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

       {/* Content */}
       <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate('/plant-admin')} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                </div>
                <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to List</span>
            </Button>
            <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                New <span className="text-solar-yellow">Plant Admin</span>
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
                    className="glass rounded-3xl p-8 md:p-12"
                >
                    <div className="flex-1">
                        {renderContent()}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                        <p className="text-xs text-white/30 hidden sm:block">
                            Step {TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length}
                        </p>
                        <div className="flex gap-4 ml-auto">
                            {activeTab !== 'identity' && (
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
                            
                            {activeTab !== 'assignment' ? (
                                <Button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-gold px-8"
                                >
                                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-gold px-8 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    Create Admin Member
                                </Button>
                            )}
                            
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
       </div>
    </div>
  )
}

// Helpers
const getInputClassName = (fieldName, touched, errors) => {
  const hasError = touched[fieldName] && errors[fieldName];
  return `w-full pl-12 pr-4 py-4 bg-white/5 border ${
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

export default CreatePlantAdmin