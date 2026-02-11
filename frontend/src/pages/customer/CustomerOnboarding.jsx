import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sun, 
  MapPin, 
  Zap, 
  Home,
  Building2,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Building,
  Factory,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import LocationPicker from '../../components/ui/LocationPicker';
import Select from '../../components/ui/Select';
import { INDIAN_STATES_AND_CITIES } from '../../data/mockData';

const TABS = [
  { id: 'location', label: 'Location Details', icon: MapPin, description: 'Installation Site Coordinates' },
  { id: 'property', label: 'Property Details', icon: Home, description: 'Site & Infrastructure Info' },
  { id: 'requirement', label: 'Your Requirement', icon: Zap, description: 'Energy Needs & Preference' },
];

const PROPERTY_TYPES = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop/Office', icon: Building },
    { id: 'industrial', label: 'Industrial', icon: Factory },
];

const ROOF_TYPES = [
    { value: 'rcc', label: 'Concrete (RCC)' },
    { value: 'tin_shed', label: 'Tin Shed' },
    { value: 'open_ground', label: 'Open Ground' }
];

const BILL_RANGES = [
    { value: '< ₹3,000', label: '< ₹3,000' },
    { value: '₹3,000 - ₹5,000', label: '₹3,000 - ₹5,000' },
    { value: '₹5,000 - ₹10,000', label: '₹5,000 - ₹10,000' },
    { value: '> ₹10,000', label: '> ₹10,000' }
];

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema } from '../../schemas/validation';
import { onboardCustomer } from '../../api/onboarding';
import { getCustomerProfile } from '../../api/customer';
import { useAuthStore } from '../../store/authStore';

const CustomerOnboarding = () => {
    const navigate = useNavigate();
    const { setOnboardingStatus } = useAuthStore();
    const [activeTab, setActiveTab] = useState('location');

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        trigger,
        formState: { errors, touchedFields },
    } = useForm({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            country: 'India',
            location: '',
            latitude: 0,
            longitude: 0,
            state: '',
            city: '',
            pincode: '',
            propertyType: 'home',
            roofType: 'rcc',
            roofArea: 0,
            billRange: '',
            solarType: 'grid_tied'
        }
    });

    const [isOnboarded, setIsOnboarded] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const profile = await getCustomerProfile();
                if (profile?.isOnboarded) {
                    setIsOnboarded(true);
                }
            } catch (error) {
                console.error("Status check failed:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };
        checkStatus();
    }, []);

    const formData = watch();

    const handleNext = async () => {
        const fieldsToValidate = {
            location: ['location', 'state', 'city', 'pincode'],
            property: ['roofArea'],
            requirement: ['billRange']
        }[activeTab];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            const currentIndex = TABS.findIndex(t => t.id === activeTab);
            if (currentIndex < TABS.length - 1) {
                setActiveTab(TABS[currentIndex + 1].id);
            }
        }
    };

    const handleBack = () => {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(TABS[currentIndex - 1].id);
        }
    };

    

    const onSubmit = async (data) => {
        try {
            console.log("Submitting onboarding data...", data);
            await onboardCustomer(data);
            console.log("Onboarding successful!");
            
            // Update auth store with onboarding status
            setOnboardingStatus(true);
            
            navigate('/customer/dashboard');
        } catch (error) {
            console.error("Onboarding failed:", error);
            const data = error.response?.data;
            if (data?.errors && Array.isArray(data.errors)) {
                alert(`Validation failed:\n${data.errors.join('\n')}`);
            } else {
                alert("Onboarding failed. Please check the console for details.");
            }
        }
    };

    const onInvalid = (errors) => {
        console.log("Form Validation Errors:", errors);
    };

    const handleLocationChange = (val) => {
        setValue('location', val.location, { shouldValidate: true });
        setValue('latitude', Number(val.latitude), { shouldValidate: true });
        setValue('longitude', Number(val.longitude), { shouldValidate: true });
        
        if (val.addressDetails?.state) {
            setValue('state', val.addressDetails.state, { shouldValidate: true });
            setValue('city', '', { shouldValidate: true });
        }
        
        const city = val.addressDetails?.city || val.addressDetails?.town || val.addressDetails?.village;
        if (city) {
            setValue('city', city, { shouldValidate: true });
        }
        
        if (val.addressDetails?.postcode) {
            setValue('pincode', val.addressDetails.postcode, { shouldValidate: true });
        }
    };
    const renderContent = () => {
        switch (activeTab) {
            case 'location':
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <FormField name="location" label="Service Location" required touched={touchedFields} errors={errors} className="md:col-span-2">
                            <LocationPicker
                                value={{
                                    location: formData.location,
                                    latitude: formData.latitude,
                                    longitude: formData.longitude
                                }}
                                onChange={handleLocationChange}
                                errors={errors}
                                touched={touchedFields}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField name="state" label="State" touched={touchedFields} errors={errors}>
                                <Select
                                    name="state"
                                    value={formData.state}
                                    onChange={(e) => {
                                        setValue('state', e.target.value, { shouldValidate: true });
                                        setValue('city', '', { shouldValidate: true });
                                    }}
                                    options={Object.keys(INDIAN_STATES_AND_CITIES).map(s => ({ value: s, label: s }))}
                                    icon={MapPin}
                                    placeholder="Select State"
                                />
                            </FormField>

                            <FormField name="city" label="City" touched={touchedFields} errors={errors}>
                                <Select
                                    name="city"
                                    value={formData.city}
                                    onChange={(e) => setValue('city', e.target.value, { shouldValidate: true })}
                                    options={formData.state ? INDIAN_STATES_AND_CITIES[formData.state]?.map(c => ({ value: c, label: c })) : []}
                                    icon={MapPin}
                                    placeholder={formData.state ? "Select City" : "Select State First"}
                                    disabled={!formData.state}
                                />
                            </FormField>

                            <FormField name="pincode" label="Pincode" touched={touchedFields} errors={errors}>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="text"
                                        placeholder="e.g. 800001"
                                        {...register('pincode')}
                                        className={getInputClassName('pincode', touchedFields, errors)}
                                    />
                                </div>
                            </FormField>
                        </div>
                    </div>
                );
            case 'property':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4 block">Property Type</label>
                            <Controller
                                name="propertyType"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {PROPERTY_TYPES.map(type => {
                                            const Icon = type.icon;
                                            const active = value === type.id;
                                            return (
                                                <div
                                                    key={type.id}
                                                    onClick={() => onChange(type.id)}
                                                    className={`p-6 rounded-2xl border cursor-pointer group transition-all duration-300 ${active
                                                            ? 'bg-solar-yellow text-deep-navy border-solar-yellow shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                                                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <Icon className={`w-8 h-8 mb-4 transition-all duration-300 ${active ? 'text-deep-navy' : 'text-solar-yellow group-hover:scale-110'}`} />
                                                    <span className="text-xs font-black uppercase tracking-wider">{type.label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                            <FormField name="roofType" label="Roof Type" touched={touchedFields} errors={errors}>
                                <Select
                                    name="roofType"
                                    value={formData.roofType}
                                    onChange={(e) => setValue('roofType', e.target.value, { shouldValidate: true })}
                                    options={ROOF_TYPES}
                                    icon={Building2}
                                />
                            </FormField>

                            <FormField name="roofArea" label="Roof Area (Sq.ft)" touched={touchedFields} errors={errors}>
                                <div className="relative">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="number"
                                        placeholder="e.g. 1200"
                                        {...register('roofArea', { valueAsNumber: true })}
                                        className={getInputClassName('roofArea', touchedFields, errors)}
                                    />
                                </div>
                            </FormField>
                        </div>
                    </div>
                );
            case 'requirement':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <FormField name="billRange" label="Average Monthly Bill" touched={touchedFields} errors={errors}>
                            <Controller
                                name="billRange"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {BILL_RANGES.map(range => (
                                            <div
                                                key={range.value}
                                                onClick={() => onChange(range.value)}
                                                className={`p-4 rounded-xl border cursor-pointer text-center transition-all duration-300 ${value === range.value
                                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{range.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </FormField>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/60 block mb-4">Solar Preference</label>
                            <Controller
                                name="solarType"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${value === 'grid_tied'
                                                ? 'bg-solar-yellow/10 border-solar-yellow'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${value === 'grid_tied' ? 'border-solar-yellow bg-solar-yellow' : 'border-white/20'
                                                }`}>
                                                {value === 'grid_tied' && <Check className="w-4 h-4 text-deep-navy" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="solarType"
                                                checked={value === 'grid_tied'}
                                                onChange={() => onChange('grid_tied')}
                                                className="hidden"
                                            />
                                            <div>
                                                <p className="font-bold uppercase tracking-wider text-sm">Grid-Tied</p>
                                                <p className="text-xs text-white/40 uppercase">Optimized for savings</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${value === 'hybrid'
                                                ? 'bg-solar-yellow/10 border-solar-yellow'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${value === 'hybrid' ? 'border-solar-yellow bg-solar-yellow' : 'border-white/20'
                                                }`}>
                                                {value === 'hybrid' && <Check className="w-4 h-4 text-deep-navy" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="solarType"
                                                checked={value === 'hybrid'}
                                                onChange={() => onChange('hybrid')}
                                                className="hidden"
                                            />
                                            <div>
                                                <p className="font-bold uppercase tracking-wider text-sm">Hybrid</p>
                                                <p className="text-xs text-white/40 uppercase">With Battery Backup</p>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-deep-navy flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-solar-yellow animate-spin" />
                <p className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase">Syncing Satellite Data...</p>
            </div>
        );
    }

    if (isOnboarded) {
        return (
            <div className="relative bg-deep-navy text-white overflow-hidden flex items-center justify-center">
                <div className="film-grain" />
                <div className="cinematic-vignette" />
                <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass p-12 md:p-16 rounded-[3.5rem] border border-white/10 max-w-2xl text-center relative z-10 shadow-2xl backdrop-blur-3xl"
                >
                    <div className="w-24 h-24 bg-solar-yellow/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-solar-yellow/20 relative">
                        <CheckCircle2 className="w-12 h-12 text-solar-yellow" />
                        <div className="absolute inset-0 rounded-full border border-solar-yellow/30 animate-ping" />
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 rim-light">
                        ONBOARDING <span className="text-solar-yellow">COMPLETE</span>
                    </h2>
                    
                    <p className="text-blue-100/60 text-lg font-medium mb-12 italic leading-relaxed">
                        "Your installation request is under review. Please wait for a plant admin response as soon as possible."
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={() => navigate('/customer/dashboard')}
                            className="bg-solar-yellow text-deep-navy font-black px-12 py-7 rounded-2xl tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                        Complete <span className="text-solar-yellow">Onboarding</span>
                    </h1>
                </div>

                <div className="mx-auto">
                    {/* Horizontal Tabs (Same as CreatePlant) */}
                    <div className="mb-8 overflow-x-auto pb-2">
                        <nav className="flex items-center gap-2 min-w-max border-b border-white/10">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-6 py-4 flex items-center gap-3 transition-colors group ${activeTab === tab.id
                                            ? 'text-solar-yellow'
                                            : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-solar-yellow' : 'text-current'}`} />
                                    <span className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">{tab.label}</span>

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
                            <p className="text-white/40 text-sm italic">
                                {TABS.find(t => t.id === activeTab)?.description}
                            </p>
                        </div>
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onSubmit={handleSubmit(onSubmit)}
                            className="glass rounded-3xl p-8 md:p-12 min-h-[550px] flex flex-col justify-between border border-white/10"
                        >
                            <div className="flex-1">
                                {renderContent()}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 hidden sm:block">
                                    Step {TABS.findIndex(t => t.id === activeTab) + 1} of {TABS.length}
                                </p>
                                <div className="flex gap-4 ml-auto">
                                    {activeTab !== 'location' && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="px-8 text-white/60 hover:text-white uppercase text-xs font-bold"
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {activeTab !== 'requirement' ? (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            className="bg-solar-yellow text-deep-navy font-black hover:bg-gold px-10 rounded-xl"
                                        >
                                            Continue <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        >
                                            Complete Onboarding <CheckCircle2 className="w-4 h-4 ml-2" />
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
};

// Helpers (Consistent with CreatePlant.jsx)
const getInputClassName = (fieldName, touched, errors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full pl-12 pr-4 py-4 bg-white/5 border ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-solar-yellow/50'
        } rounded-xl text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 font-bold uppercase tracking-widest text-xs`;
};

const FormField = ({ name, label, required, children, className = '', touched = {}, errors = {} }) => (
    <div className={className}>
        <label className={`block text-[10px] font-black uppercase tracking-[0.3em] mb-4 transition-colors ${touched[name] && errors[name] ? 'text-red-400' : 'text-white/60'
            }`}>
            {label} {required && '*'}
        </label>
        {children}
        {touched[name] && errors[name] && (
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase tracking-widest"
            >
                <AlertCircle className="w-3 h-3" /> {errors[name].message || errors[name]}
            </motion.p>
        )}
    </div>
);

export default CustomerOnboarding;
