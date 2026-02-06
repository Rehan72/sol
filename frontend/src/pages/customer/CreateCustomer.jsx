import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import LocationPicker from '../../components/ui/LocationPicker';

const TABS = [
  { id: 'identity', label: 'Identity', icon: User, description: 'Personal information' },
  { id: 'security', label: 'Security', icon: ShieldCheck, description: 'Account protection' },
  { id: 'location', label: 'Location', icon: MapPin, description: 'Address details' },
];

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    latitude: '',
    longitude: '',
    country: '',
    state: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Invalid phone number (10 digits)';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'location':
        if (!value) return 'Location is required';
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleLocationChange = (data) => {
    setFormData(prev => ({
      ...prev,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      country: data.addressDetails?.country || '',
      state: data.addressDetails?.state || '',
      city: data.addressDetails?.city || data.addressDetails?.town || ''
    }));
    if (touched.location) setErrors(prev => ({ ...prev, location: '' }));
  };

  const validateTab = (tabId) => {
    const newErrors = {};
    let fields = [];
    
    if (tabId === 'identity') fields = ['fullName', 'email', 'phone'];
    if (tabId === 'security') fields = ['password', 'confirmPassword'];
    if (tabId === 'location') fields = ['location'];

    fields.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched(prev => {
        const newTouched = { ...prev };
        fields.forEach(f => newTouched[f] = true);
        return newTouched;
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateTab(activeTab)) {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex < TABS.length - 1) {
            setActiveTab(TABS[currentIndex + 1].id);
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateTab('location')) {
        // Final global validation check just in case
        const allValid = ['identity', 'security', 'location'].every(tab => validateTab(tab)); 
        // Note: calling validateTab multiple times like this in sync might overwrite state, 
        // but since we checked progressively, usually purely checking last tab is enough if we enforce flow.
        // For robustness, we can just check if we are on last tab and it's valid.

        if (validateTab(activeTab)) {
            console.log('Customer Created:', formData);
            navigate('/customer');
        }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="fullName" label="Full Name" required error={touched.fullName && errors.fullName}>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                                type="text" 
                                name="fullName" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                placeholder="e.g. John Doe"
                                className={getInputClassName(touched.fullName && errors.fullName)}
                            />
                        </div>
                    </FormField>

                    <FormField name="phone" label="Phone Number" required error={touched.phone && errors.phone}>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                placeholder="e.g. 9876543210"
                                className={getInputClassName(touched.phone && errors.phone)}
                            />
                        </div>
                    </FormField>

                    <FormField name="email" label="Email Address" required error={touched.email && errors.email} className="md:col-span-2">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                placeholder="e.g. john@example.com"
                                className={getInputClassName(touched.email && errors.email)}
                            />
                        </div>
                    </FormField>
                </div>
            </div>
        );
      case 'security':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="password" label="Password" required error={touched.password && errors.password}>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                className={getInputClassName(touched.password && errors.password)}
                            />
                        </div>
                    </FormField>

                    <FormField name="confirmPassword" label="Confirm Password" required error={touched.confirmPassword && errors.confirmPassword}>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                className={getInputClassName(touched.confirmPassword && errors.confirmPassword)}
                            />
                        </div>
                    </FormField>
                </div>
            </div>
        );
      case 'location':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <LocationPicker
                    value={{
                        location: formData.location,
                        latitude: formData.latitude,
                        longitude: formData.longitude
                    }}
                    onChange={handleLocationChange}
                    errors={errors}
                    touched={touched}
                    onBlur={(field) => handleBlur({ target: { name: field } })}
                />
                
                {formData.location && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs">
                            <span className="text-white/40 block mb-1">State</span>
                            <span className="text-white font-medium">{formData.state || '-'}</span>
                        </div>
                        <div className="text-xs">
                            <span className="text-white/40 block mb-1">Country</span>
                            <span className="text-white font-medium">{formData.country || '-'}</span>
                        </div>
                        <div className="text-xs">
                            <span className="text-white/40 block mb-1">Coordinates</span>
                            <span className="text-white font-medium">{formData.latitude ? `${formData.latitude}, ${formData.longitude}` : '-'}</span>
                        </div>
                    </div>
                )}
            </div>
        );
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
      {/* Background Effects */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate('/customer')} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                </div>
                <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to Customers</span>
            </Button>
            <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                Register <span className="text-solar-yellow">New Customer</span>
            </h1>
        </div>

        <div className="mx-auto">
             {/* Horizontal Tabs */}
             <div className="mb-8 overflow-x-auto pb-2">
                <nav className="flex items-center gap-2 min-w-max border-b border-white/10">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                // Optional: Allow clicking back, or strict linear flow? 
                                // Let's allow clicking any previous tab or current, but check validation for future
                                const currentIdx = TABS.findIndex(t => t.id === activeTab);
                                const targetIdx = TABS.findIndex(t => t.id === tab.id);
                                if (targetIdx <= currentIdx || validateTab(activeTab)) {
                                    setActiveTab(tab.id);
                                }
                            }}
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
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between"
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2 mb-2 text-white">
                           {TABS.find(t => t.id === activeTab).label}
                        </h2>
                        <p className="text-white/40 text-sm">
                            {TABS.find(t => t.id === activeTab).description}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
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
                                {activeTab !== 'location' ? (
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
                                        className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold px-8 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                    >
                                        Create Customer <CheckCircle2 className="w-5 h-5 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>
             </div>
        </div>
      </div>
    </div>
  );
};

// --- Helpers ---
const getInputClassName = (hasError) => `
  w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 
  focus:outline-none transition-colors
  ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-solar-yellow/50'}
`;

const FormField = ({ label, required, error, children, className = '' }) => (
  <div className={className}>
    <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${error ? 'text-red-400' : 'text-white/60'}`}>
      {label} {required && '*'}
    </label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-xs mt-2 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" /> {error}
      </motion.p>
    )}
  </div>
);

export default CreateCustomer;