import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Globe,
  Map,
  ShieldCheck,
  ChevronRight,
  FileBadge,
  Activity
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import LocationPicker from '../../components/ui/LocationPicker';
import Select from '../../components/ui/Select';
import { INDIAN_STATES_AND_CITIES } from '../../data/mockData';

// Option Constants
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const TABS = [
  { id: 'profile', label: 'Profile Details', icon: User, description: 'Basic identity & access' },
  { id: 'region', label: 'Region Info', icon: MapPin, description: 'Geographical jurisdiction' },
];

function CreateRegionAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('profile');
  
  const [formData, setFormData] = React.useState({
    // 1. Profile
    adminName: '',
    email: '',
    mobile: '',
    role: 'REGION_ADMIN',
    status: 'active',
    
    // 2. Region Info
    regionName: '',
    regionCode: '',
    location: '',
    latitude: '',
    longitude: '',
    country: '',
    state: '',
    city: '',
    utility: '',
  });

  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      // Profile
      case 'adminName':
        if (!value.trim()) return 'Admin Name is required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        return '';
      case 'mobile':
        if (!value.trim()) return 'Mobile is required';
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Invalid mobile (10 digits)';
        return '';
      
      // Region
      case 'regionName':
        if (!value.trim()) return 'Region Name is required';
        return '';
      case 'regionCode':
        if (!value.trim()) return 'Region Code is required';
        return '';
      case 'location':
        if (!value.trim()) return 'Location is required';
        return '';
      case 'utility':
         if (!value.trim()) return 'Utility provider is required';
         return '';
        
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If state changes, reset city
    if (name === 'state') {
        setFormData(prev => ({ ...prev, state: value, city: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleLocationChange = (locationData) => {
    const { addressDetails } = locationData;
    setFormData(prev => ({
      ...prev,
      location: locationData.location,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      country: addressDetails?.country || prev.country,
      state: addressDetails?.state || prev.state,
      city: addressDetails?.city || addressDetails?.town || addressDetails?.village || prev.city,
    }));
    if (touched.location) setErrors(prev => ({ ...prev, location: '' }));
  };

  const handleNext = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      navigate('/region-admin');
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="adminName" label="Admin Name" required touched={touched} errors={errors}>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                  <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} placeholder="e.g., John Doe" className={getInputClassName('adminName', touched, errors)} />
                </div>
              </FormField>

              <FormField name="email" label="Email Address" required touched={touched} errors={errors}>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., john@example.com" className={getInputClassName('email', touched, errors)} />
                </div>
              </FormField>

              <FormField name="mobile" label="Phone Number" required touched={touched} errors={errors}>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="e.g., 9876543210" className={getInputClassName('mobile', touched, errors)} />
                </div>
              </FormField>

              <FormField name="role" label="Role" touched={touched} errors={errors}>
                <div className="relative">
                  <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-solar-yellow`} />
                  <input type="text" value="Regional Admin" disabled className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-solar-yellow font-bold uppercase tracking-wider cursor-not-allowed opacity-80" />
                </div>
              </FormField>

              <div className="relative">
                <Select
                  name="status"
                  label="Account Status"
                  value={formData.status}
                  onChange={handleChange}
                  options={STATUS_OPTIONS}
                  icon={Activity}
                  error={touched.status && errors.status}
                />
              </div>
            </div>
          </div>
        );
      case 'region':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="regionName" label="Region Name" required touched={touched} errors={errors}>
                <div className="relative">
                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                    <input type="text" name="regionName" value={formData.regionName} onChange={handleChange} placeholder="e.g., North Zone" className={getInputClassName('regionName', touched, errors)} />
                </div>
              </FormField>

              <FormField name="regionCode" label="Region Code" required touched={touched} errors={errors}>
                <div className="relative">
                    <FileBadge className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                    <input type="text" name="regionCode" value={formData.regionCode} onChange={handleChange} placeholder="e.g., RE-NORTH-01" className={getInputClassName('regionCode', touched, errors)} />
                </div>
              </FormField>

              <div className="md:col-span-2">
                <LocationPicker
                  value={{
                    location: formData.location,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                  }}
                  onChange={(data) => {
                    handleLocationChange(data);
                    handleChange({ target: { name: 'location', value: data.location } });
                  }}
                  errors={errors}
                  touched={touched}
                  onBlur={(field) => setTouched(prev => ({ ...prev, [field]: true }))}
                />
              </div>

              <FormField name="country" label="Country" touched={touched} errors={errors}>
                <div className="relative">
                    <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                    <input type="text" name="country" value={formData.country} onChange={handleChange} className={getInputClassName('country', touched, errors)} />
                </div>
              </FormField>

              <div className="relative">
                <Select
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  options={Object.keys(INDIAN_STATES_AND_CITIES).map(s => ({ value: s, label: s }))}
                  icon={Map}
                  placeholder="Select State"
                  error={touched.state && errors.state}
                />
              </div>

               <div className="relative">
                <Select
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  options={formData.state ? INDIAN_STATES_AND_CITIES[formData.state]?.map(c => ({ value: c, label: c })) : []}
                  icon={MapPin}
                  placeholder={formData.state ? "Select City" : "Select State First"}
                  disabled={!formData.state}
                  error={touched.city && errors.city}
                />
              </div>

              <FormField name="utility" label="Utility Provider" required touched={touched} errors={errors}>
                <div className="relative">
                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                    <input type="text" name="utility" value={formData.utility} onChange={handleChange} placeholder="e.g., TATA Power" className={getInputClassName('utility', touched, errors)} />
                </div>
              </FormField>
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

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate('/region-admin')} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                </div>
                <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to List</span>
            </Button>
            <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                Register <span className="text-solar-yellow">Admin</span>
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
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <h2 className="text-2xl font-black uppercase tracking-wider">
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-white/40">
                         {TABS.find(t => t.id === activeTab)?.description}
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="glass rounded-3xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between"
                >
                    <div className="flex-1">
                        {renderContent()}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                        <p className="text-xs text-white/30 hidden sm:block">
                            Step {TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length}
                        </p>
                        <div className="flex gap-4 ml-auto">
                            {activeTab !== 'profile' && (
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
                            {activeTab !== 'region' ? (
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
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                >
                                    Create Admin <CheckCircle2 className="w-4 h-4 ml-2" />
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

export default CreateRegionAdmin;