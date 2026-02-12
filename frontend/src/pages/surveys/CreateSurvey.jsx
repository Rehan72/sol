import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSurvey, updateSurvey, completeSurvey } from '../../api/surveys';
import { generateCostEstimation } from '../../api/costEstimation';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Upload, Sun, Zap, FileText, AlertTriangle, Users, Cloud, Wind, Monitor } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

import { useAuthStore } from '../../store/authStore';
import Select from '../../components/ui/Select';

const CUSTOMER_TYPES = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Utility', label: 'Utility' }
];

const SITE_TYPES = [
    { value: 'Rooftop', label: 'Rooftop' },
    { value: 'Ground Mounted', label: 'Ground Mounted' },
    { value: 'Carport', label: 'Carport' }
];

const ROOF_TYPES = [
    { value: 'RCC Flat', label: 'RCC Flat' },
    { value: 'Tin Shade', label: 'Tin Shade' },
    { value: 'Asbestos', label: 'Asbestos' },
    { value: 'Tiled', label: 'Tiled' }
];

const ROOF_CONDITIONS = [
    { value: 'Good', label: 'Good' },
    { value: 'Minor Repair', label: 'Minor Repair' },
    { value: 'Major Repair', label: 'Major Repair' },
    { value: 'Damaged', label: 'Damaged' }
];

const ORIENTATIONS = [
    { value: 'South', label: 'South' },
    { value: 'South-East', label: 'South-East' },
    { value: 'South-West', label: 'South-West' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
    { value: 'North', label: 'North' }
];

const SHADING_TIMES = [
    { value: 'None', label: 'None' },
    { value: 'Morning', label: 'Morning' },
    { value: 'Noon', label: 'Noon' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Throughout Day', label: 'Throughout Day' }
];

const DUST_LEVELS = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High (Industrial)', label: 'High (Industrial)' }
];

const WIND_ZONES = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
];

const CONNECTION_TYPES = [
    { value: 'Single Phase', label: 'Single Phase' },
    { value: 'Three Phase', label: 'Three Phase' },
    { value: 'HT', label: 'HT' }
];

const PAYMENT_PREFERENCES = [
    { value: 'Milestone-based', label: 'Milestone-based' },
    { value: 'Upfront', label: 'Upfront' },
    { value: 'Financed', label: 'Financed' }
];

const CreateSurvey = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customer } = location.state || {};

    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, trigger, setValue, control, formState: { errors } } = useForm({ mode: 'onChange' });

    const [photos, setPhotos] = useState({
        site: null,
        roof: null,
        shadow: null,
        bill: null,
        mainDB: null,
        meter: null,
        structure: null
    });

    const fileInputRef = useRef(null);
    const [activePhotoType, setActivePhotoType] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file && activePhotoType) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(prev => ({
                    ...prev,
                    [activePhotoType]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = (type) => {
        setActivePhotoType(type);
        fileInputRef.current.click();
    };

    // Auto-fill form if customer data is present
    React.useEffect(() => {
        if (customer) {
            setValue('customerName', customer.name || '');
            setValue('customerEmail', customer.email || '');
            setValue('customerPhone', customer.phone || '');
            setValue('siteAddress', (customer.address || customer.siteAddress) || '');
            setValue('city', customer.city || '');
            setValue('state', customer.state || '');
            setValue('pincode', customer.pincode || '');
            setValue('discomName', customer.discom || '');
            trigger();
        }
    }, [customer, setValue, trigger]);
    
    const { addToast } = useToast();

    // Use logged-in user ID
    const surveyorId = user?.id || "unknown-surveyor";

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                surveyorId,
                customerId: customer?.id,
                // Map photos to array if backend expects array, or single string. 
                // Currently backend defines string[] for photos. 
                // We'll wrap single photos in array for now or just pass the string if backend handles it.
                // Based on entity update, it expects arrays.
                roofPhotos: photos.roof ? [photos.roof] : [],
                shadowPhotos: photos.shadow ? [photos.shadow] : [],
                mainDBPhoto: photos.mainDB ? [photos.mainDB] : [],
                meterPhoto: photos.meter ? [photos.meter] : [],
                electricityBillCopy: photos.bill ? [photos.bill] : [],
                structureConditionPhotos: photos.structure ? [photos.structure] : [],
                photoUrls: photos.site ? [photos.site] : [], // General site photos

                recommendedSystemSize: parseFloat(data.recommendedSystemSize),
                averageMonthlyConsumption: parseFloat(data.averageMonthlyUnits), // Maps to averageMonthlyConsumption
                roofTiltAngle: parseFloat(data.roofTiltAngle),
                availableShadowFreeArea: parseFloat(data.availableShadowFreeArea),
                sanctionedLoad: parseFloat(data.existingSanctionLoad), // Maps to sanctionedLoad
                daytimeConsumptionPercentage: parseFloat(data.daytimeLoadPercentage), // Maps to daytimeConsumptionPercentage
                
                // New Float Fields
                roofArea: parseFloat(data.roofArea),
                parapetHeight: parseFloat(data.parapetHeight),
                nearbyBuildingHeight: parseFloat(data.nearbyBuildingHeight),
                distanceRoofToDB: parseFloat(data.distanceRoofToDB),
                contractDemand: parseFloat(data.contractDemand),
                cableRouteLength: parseFloat(data.cableRouteLength),
            };

            let survey;
            // Check if existing surveyId is passed via location state
            const existingSurveyId = location.state?.surveyId;

            if (existingSurveyId) {
                // Update existing DRAFT survey
                survey = await updateSurvey(existingSurveyId, formattedData);
            } else {
                // Create new survey
                survey = await createSurvey(formattedData);
            }
            
            // Auto generate cost estimation draft or complete status
            await completeSurvey(survey.id);

            // Removed automatic cost estimation generation as per requirement
            addToast('Survey submitted successfully!', 'success');
            
            setTimeout(() => {
                 navigate('/admin/leads'); // Redirect back to leads 
            }, 1500);
        } catch (error) {
            console.error(error);
            addToast('Failed to submit survey. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepFields = {
        1: ['customerName', 'customerPhone', 'customerEmail', 'customerType', 'siteAddress', 'city', 'state', 'pincode', 'discomName'],
        2: ['existingSanctionLoad', 'contractDemand', 'connectionType', 'averageMonthlyUnits', 'daytimeLoadPercentage', 'dieselGeneratorAvailable'],
        3: ['siteType', 'roofType', 'roofArea', 'availableShadowFreeArea', 'roofOrientation', 'roofTiltAngle', 'roofCondition', 'parapetHeight', 'obstructions'],
        4: ['shadingPresence', 'shadingSource', 'shadowTiming', 'seasonalShadingImpact', 'nearbyBuildingHeight', 'treeShading', 'dustLevel', 'windZone', 'coastalArea'],
        5: ['mainDBLocation', 'distanceRoofToDB', 'cableRouteLength', 'earthingAvailable', 'lightningArrestorAvailable', 'netMeteringFeasibility', 'transformerCapacity'],
        6: ['subsidyEligibility', 'gstApplicable', 'paymentPreference', 'recommendedSystemSize', 'installationChallenges', 'specialNotes']
    };

    const handleNext = async (e) => {
        e.preventDefault();
        const fields = stepFields[currentStep];
        const isValid = await trigger(fields);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 6));
        }
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const steps = [
        { id: 1, title: 'Customer', icon: <FileText size={20} /> },
        { id: 2, title: 'Energy & Load', icon: <Zap size={20} /> },
        { id: 3, title: 'Roof & Land', icon: <Sun size={20} /> },
        { id: 4, title: 'Environmental', icon: <Cloud size={20} /> },
        { id: 5, title: 'Electrical', icon: <Monitor size={20} /> },
        { id: 6, title: 'Financial & Obs', icon: <CheckCircle size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-deep-navy)] text-white p-6 pb-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-solar-yellow)] opacity-5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-solar-gold)] opacity-5 blur-[100px] rounded-full"></div>
            </div>

            <div className="mx-auto relative z-10 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-solar-yellow)]">
                            New Site Survey
                        </h1>
                        <p className="text-[var(--color-solar-light-gray)] text-sm">Comprehensive site assessment</p>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="mb-8 overflow-x-auto pb-4">
                    <div className="flex items-center min-w-max">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${currentStep === step.id ? 'bg-[var(--colors-solar-gold)]/20 border-[var(--color-solar-gold)] text-[var(--color-solar-gold)]' : currentStep > step.id ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-[var(--color-solar-dark-gray)] text-[var(--color-solar-gray)]'}`}>
                                    {step.icon}
                                    <span className="font-medium whitespace-nowrap">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-[1px] mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-[var(--color-solar-dark-gray)]'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Step 1: Customer & Site Info */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><FileText size={20} /> Customer Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Customer Name</label>
                                        <input {...register('customerName', { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="Enter full name" />
                                        {errors.customerName && <span className="text-red-400 text-xs">Required</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Mobile Number</label>
                                        <input {...register('customerPhone', { required: "Mobile number is required" })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Email</label>
                                        <input {...register('customerEmail')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="email@example.com" />
                                    </div>
                                    <Controller
                                        name="customerType"
                                        control={control}
                                        defaultValue="Residential"
                                        render={({ field }) => (
                                            <Select label="Customer Type" value={field.value} onChange={field.onChange} options={CUSTOMER_TYPES} icon={Users} />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><AlertTriangle size={20} /> Location Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Site Address</label>
                                        <textarea {...register('siteAddress', { required: "Address is required" })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" rows="3" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">City</label><input {...register('city')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">State</label><input {...register('state')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Pincode</label><input {...register('pincode')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">DISCOM</label><input {...register('discomName')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Energy & Load Details */}
                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Zap size={20} /> Consumption Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Avg. Monthly Units (kWh)</label>
                                        <input type="number" {...register('averageMonthlyUnits')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Daytime Load (%)</label>
                                        <input type="number" {...register('daytimeLoadPercentage')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 30" />
                                    </div>
                                    <div onClick={() => triggerUpload('bill')} className="mt-4 p-4 border border-dashed border-white/20 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">{photos.bill ? "Bill Uploaded" : "Upload Electricity Bill"}</span>
                                        {photos.bill ? <CheckCircle className="text-green-400" size={18} /> : <Upload className="text-[var(--color-solar-gold)]" size={18} />}
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Zap size={20} /> Connection Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Sanction Load (kW)</label><input type="number" {...register('existingSanctionLoad')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Contract Demand (kVA)</label><input type="number" {...register('contractDemand')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                    <Controller name="connectionType" control={control} defaultValue="Single Phase" render={({ field }) => (<Select label="Connection Type" value={field.value} onChange={field.onChange} options={CONNECTION_TYPES} />)} />
                                    <div className="pt-2">
                                        <label className="flex items-center gap-2 text-sm text-[var(--color-solar-light-gray)]">
                                            <input type="checkbox" {...register('dieselGeneratorAvailable')} className="w-4 h-4 rounded bg-black/20 border-white/20" />
                                            Diesel Generator Available?
                                        </label>
                                        <input {...register('dieselGeneratorCapacity')} className="mt-2 w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors text-sm" placeholder="Generator Capacity (if any)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Roof & Land Details */}
                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Sun size={20} /> Roof Specifications</h3>
                                <div className="space-y-4">
                                    <Controller name="siteType" control={control} defaultValue="Rooftop" render={({ field }) => (<Select label="Site Type" value={field.value} onChange={field.onChange} options={SITE_TYPES} />)} />
                                    <Controller name="roofType" control={control} defaultValue="RCC Flat" render={({ field }) => (<Select label="Roof Type" value={field.value} onChange={field.onChange} options={ROOF_TYPES} />)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Total Roof Area (sq.m)</label><input type="number" {...register('roofArea')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Shadow-Free Area (sq.m)</label><input type="number" {...register('availableShadowFreeArea')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Sun size={20} /> Structural Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller name="roofOrientation" control={control} defaultValue="South" render={({ field }) => (<Select label="Orientation" value={field.value} onChange={field.onChange} options={ORIENTATIONS} />)} />
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Tilt Angle (°)</label><input type="number" {...register('roofTiltAngle')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                    <Controller name="roofCondition" control={control} defaultValue="Good" render={({ field }) => (<Select label="Condition" value={field.value} onChange={field.onChange} options={ROOF_CONDITIONS} />)} />
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Parapet Height (m)</label><input type="number" step="0.1" {...register('parapetHeight')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Obstructions</label><input {...register('obstructions')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="Water tanks, AC units..." /></div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div onClick={() => triggerUpload('roof')} className="aspect-video border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden">
                                            {photos.roof ? <img src={photos.roof} className="w-full h-full object-cover" /> : <span className="text-xs text-[var(--color-solar-light-gray)]">Roof Photo</span>}
                                        </div>
                                         <div onClick={() => triggerUpload('structure')} className="aspect-video border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden">
                                            {photos.structure ? <img src={photos.structure} className="w-full h-full object-cover" /> : <span className="text-xs text-[var(--color-solar-light-gray)]">Structure Cond.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Shading & Environmental */}
                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Cloud size={20} /> Shading Analysis</h3>
                                <div className="space-y-4">
                                     <div className="grid grid-cols-2 gap-4">
                                        <Controller name="shadingPresence" control={control} defaultValue="None" render={({ field }) => (<Select label="Shading Presence" value={field.value} onChange={field.onChange} options={[{ value: 'None', label: 'None' }, { value: 'Partial', label: 'Partial' }, { value: 'Heavy', label: 'Heavy' }]} />)} />
                                        <Controller name="shadowTiming" control={control} defaultValue="None" render={({ field }) => (<Select label="Timing" value={field.value} onChange={field.onChange} options={SHADING_TIMES} />)} />
                                    </div>
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Shading Source</label><input {...register('shadingSource')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="Trees, Buildings..." /></div>
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Tree Shading Details</label><input {...register('treeShading')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="Type, Height..." /></div>
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Nearby Building Height (m)</label><input type="number" step="0.1" {...register('nearbyBuildingHeight')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    <label className="flex items-center gap-2 text-sm text-[var(--color-solar-light-gray)]">
                                        <input type="checkbox" {...register('seasonalShadingImpact')} className="w-4 h-4 rounded bg-black/20 border-white/20" />
                                        Seasonal Shading Impact?
                                    </label>
                                     <div onClick={() => triggerUpload('shadow')} className="mt-2 aspect-video w-full border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden">
                                        {photos.shadow ? <img src={photos.shadow} className="w-full h-full object-cover" /> : <span className="text-xs text-[var(--color-solar-light-gray)]">Shadow/Obstruction Photo</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Wind size={20} /> Environmental Factors</h3>
                                <div className="space-y-4">
                                     <Controller name="dustLevel" control={control} defaultValue="Low" render={({ field }) => (<Select label="Dust Level" value={field.value} onChange={field.onChange} options={DUST_LEVELS} />)} />
                                     <Controller name="windZone" control={control} defaultValue="Low" render={({ field }) => (<Select label="Wind Zone" value={field.value} onChange={field.onChange} options={WIND_ZONES} />)} />
                                      <label className="flex items-center gap-2 text-sm text-[var(--color-solar-light-gray)] p-3 bg-white/5 rounded-lg">
                                        <input type="checkbox" {...register('coastalArea')} className="w-4 h-4 rounded bg-black/20 border-white/20" />
                                        Coastal Area (Corrosion Risk)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Electrical Infrastructure */}
                    {currentStep === 5 && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Monitor size={20} /> Electrical Setup</h3>
                                <div className="space-y-4">
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Main DB Location</label><input {...register('mainDBLocation')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Roof to DB Distance (m)</label><input type="number" {...register('distanceRoofToDB')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                        <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Cable Route Length (m)</label><input type="number" {...register('cableRouteLength')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                    </div>
                                    <div><label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Transformer Capacity (if any)</label><input {...register('transformerCapacity')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" /></div>
                                </div>
                             </div>
                             <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Zap size={20} /> Safety & Feasibility</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Earthing Available?</span>
                                        <input type="checkbox" {...register('earthingAvailable')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Lightning Arrestor Required/Available?</span>
                                        <input type="checkbox" {...register('lightningArrestorAvailable')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Net Metering Feasible?</span>
                                        <input type="checkbox" {...register('netMeteringFeasibility')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div onClick={() => triggerUpload('mainDB')} className="aspect-video border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden">
                                            {photos.mainDB ? <img src={photos.mainDB} className="w-full h-full object-cover" /> : <span className="text-xs text-[var(--color-solar-light-gray)]">Main DB Photo</span>}
                                        </div>
                                         <div onClick={() => triggerUpload('meter')} className="aspect-video border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden">
                                            {photos.meter ? <img src={photos.meter} className="w-full h-full object-cover" /> : <span className="text-xs text-[var(--color-solar-light-gray)]">Meter Photo</span>}
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>
                    )}

                    {/* Step 6: Financial & Observations */}
                    {currentStep === 6 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><CheckCircle size={20} /> Recommendations</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Recommended System Size (kW)</label>
                                        <input type="number" step="0.1" {...register('recommendedSystemSize')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-2xl font-bold text-[var(--color-solar-gold)] focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 5.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Installation Challenges</label>
                                        <textarea {...register('installationChallenges')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" rows="3" placeholder="Describe any difficulties..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Special Notes</label>
                                        <textarea {...register('specialNotes')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" rows="3" placeholder="Any requests from customer..." />
                                    </div>
                                </div>
                             </div>
                             <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><CheckCircle size={20} /> Financial Details</h3>
                                <div className="space-y-4">
                                    <Controller name="paymentPreference" control={control} defaultValue="Milestone-based" render={({ field }) => (<Select label="Payment Preference" value={field.value} onChange={field.onChange} options={PAYMENT_PREFERENCES} />)} />
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Subsidy Eligible?</span>
                                        <input type="checkbox" {...register('subsidyEligibility')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">GST Applicable?</span>
                                        <input type="checkbox" {...register('gstApplicable')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 1 ? 'opacity-50 cursor-not-allowed text-gray-500' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                        >
                            <ChevronLeft size={20} /> Previous
                        </button>

                        {currentStep < 6 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-solar-yellow)] text-[var(--color-deep-navy)] font-bold hover:bg-[var(--color-solar-gold)] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Survey'} <Save size={20} />
                            </button>
                        )}
                    </div>
                </form>
                {/* Hidden File Input for Photos */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default CreateSurvey;
