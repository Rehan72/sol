import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSurvey, completeSurvey } from '../../api/surveys';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Upload, Sun, Zap, FileText, AlertTriangle, Users } from 'lucide-react';
import Toaster from '../../components/ui/Toaster';

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
    { value: 'West', label: 'West' }
];

const SHADING_TIMES = [
    { value: 'None', label: 'None' },
    { value: 'Morning', label: 'Morning' },
    { value: 'Noon', label: 'Noon' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Throughout Day', label: 'Throughout Day' }
];

const YES_NO_OPTIONS = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
];

const CONNECTION_TYPES = [
    { value: 'Single Phase', label: 'Single Phase' },
    { value: 'Three Phase', label: 'Three Phase' }
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
        bill: null
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
            // Strip non-digit characters for phone to ensure it matches simple validation, OR keep it if we relaxed validation
            // For now, let's keep it as is but ensure we handle potential nulls
            setValue('customerPhone', customer.phone || '');
            setValue('siteAddress', (customer.address || customer.siteAddress) || '');
            setValue('city', customer.city || '');
            setValue('state', customer.state || '');
            setValue('pincode', customer.pincode || '');
            setValue('discomName', customer.discom || '');
            // Trigger validation after setting values to ensure button state updates if we were using isValid
            trigger();
        }
    }, [customer, setValue, trigger]);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // Use logged-in user ID
    const surveyorId = user?.id || "unknown-surveyor";

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...data,
                surveyorId,
                photos,
                recommendedSystemSize: parseFloat(data.recommendedSystemSize),
                averageMonthlyUnits: parseFloat(data.averageMonthlyUnits),
                roofTiltAngle: parseFloat(data.roofTiltAngle),
                availableShadowFreeArea: parseFloat(data.availableShadowFreeArea),
                existingSanctionLoad: parseFloat(data.existingSanctionLoad),
                daytimeLoadPercentage: parseFloat(data.daytimeLoadPercentage),
                // Boolean conversions if needed, though react-hook-form handles checkboxes as booleans usually
            };

            const survey = await createSurvey(formattedData);
            const quotation = await completeSurvey(survey.id);
            addToast('Survey submitted and Quotation generated!', 'success');
            setTimeout(() => navigate(`/quotations/${quotation.id}`), 1500);
        } catch (error) {
            console.error(error);
            addToast('Failed to submit survey. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepFields = {
        1: ['customerName', 'customerPhone', 'customerEmail', 'customerType', 'siteAddress', 'city', 'state', 'pincode', 'discomName'],
        2: ['siteType', 'roofType', 'roofCondition', 'roofOrientation', 'roofTiltAngle', 'availableShadowFreeArea', 'shadingPresence', 'shadingTime', 'shadingSource', 'seasonalShadingImpact'],
        3: ['existingSanctionLoad', 'connectionType', 'averageMonthlyUnits', 'daytimeLoadPercentage', 'dieselGeneratorAvailable', 'earthingAvailability', 'netMeteringAllowed', 'lightningArrestorRequired'],
        4: ['recommendedSystemSize', 'installationChallenges', 'specialNotes']
    };

    const handleNext = async () => {
        const fields = stepFields[currentStep];
        const isValid = await trigger(fields);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const steps = [
        { id: 1, title: 'Customer & Site', icon: <FileText size={20} /> },
        { id: 2, title: 'Roof & Location', icon: <Sun size={20} /> },
        { id: 3, title: 'Technical Details', icon: <Zap size={20} /> },
        { id: 4, title: 'Observations', icon: <CheckCircle size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-deep-navy)] text-white p-6 pb-24 relative overflow-hidden">
            <Toaster toasts={toasts} onRemove={removeToast} />
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-solar-yellow)] opacity-5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-solar-gold)] opacity-5 blur-[100px] rounded-full"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-solar-yellow)]">
                            New Site Survey
                        </h1>
                        <p className="text-[var(--color-solar-light-gray)] text-sm">Fill in the details to generate a quotation</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-[var(--color-solar-yellow)] uppercase tracking-widest">Surveyor</p>
                            <p className="text-sm font-bold text-white uppercase">{user?.name || 'Unknown'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg border border-[var(--color-solar-gray)] text-[var(--color-solar-light-gray)] hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${currentStep === step.id ? 'bg-[var(--colors-solar-gold)]/20 border-[var(--color-solar-gold)] text-[var(--color-solar-gold)]' : currentStep > step.id ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-[var(--color-solar-dark-gray)] text-[var(--color-solar-gray)]'}`}>
                                    {step.icon}
                                    <span className="font-medium whitespace-nowrap">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-[1px] mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-[var(--color-solar-dark-gray)]'}`}></div>
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
                            {/* Card 1: Customer Info */}
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
                                        <input {...register('customerPhone', { required: "Mobile number is required", pattern: { value: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+91)?\d{10}$/, message: "Invalid phone number" } })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                                        {errors.customerPhone && <span className="text-red-400 text-xs">{errors.customerPhone.message}</span>}
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
                                            <Select
                                                label="Customer Type"
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={CUSTOMER_TYPES}
                                                icon={Users}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Card 2: Site Address */}
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><AlertTriangle size={20} /> Site Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Site Address</label>
                                        <textarea {...register('siteAddress', { required: "Address is required" })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" rows="3" placeholder="Full address" />
                                        {errors.siteAddress && <span className="text-red-400 text-xs">{errors.siteAddress.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">City</label>
                                            <input {...register('city')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">State</label>
                                            <input {...register('state')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Pincode</label>
                                            <input {...register('pincode')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">DISCOM</label>
                                            <input {...register('discomName')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Roof & Location */}
                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Sun size={20} /> Roof Specifications</h3>
                                <div className="space-y-4">
                                    <Controller
                                        name="siteType"
                                        control={control}
                                        defaultValue="Rooftop"
                                        render={({ field }) => (
                                            <Select
                                                label="Site Type"
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={SITE_TYPES}
                                            />
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="roofType"
                                            control={control}
                                            defaultValue="RCC Flat"
                                            render={({ field }) => (
                                                <Select
                                                    label="Roof Type"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={ROOF_TYPES}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="roofCondition"
                                            control={control}
                                            defaultValue="Good"
                                            render={({ field }) => (
                                                <Select
                                                    label="Condition"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={ROOF_CONDITIONS}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Orientation (Azimuth)</label>
                                            <input {...register('roofOrientation')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. South" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Tilt Angle (°)</label>
                                            <input type="number" {...register('roofTiltAngle')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 15" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Shadow-Free Area (sq.m)</label>
                                        <input type="number" {...register('availableShadowFreeArea')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 100" />
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Upload size={20} /> Shading & Photos</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="shadingPresence"
                                            control={control}
                                            defaultValue="None"
                                            render={({ field }) => (
                                                <Select
                                                    label="Shading Presence"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={[
                                                        { value: 'None', label: 'None' },
                                                        { value: 'Partial', label: 'Partial' },
                                                        { value: 'Heavy', label: 'Heavy' }
                                                    ]}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="shadingTime"
                                            control={control}
                                            defaultValue="None"
                                            render={({ field }) => (
                                                <Select
                                                    label="Shading Time"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={SHADING_TIMES}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Shading Source</label>
                                        <input {...register('shadingSource')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="Trees, Buildings..." />
                                    </div>

                                    <label className="flex items-center gap-2 text-sm text-[var(--color-solar-light-gray)] mb-4">
                                        <input type="checkbox" {...register('seasonalShadingImpact')} className="w-4 h-4 rounded bg-black/20 border-white/20" />
                                        Seasonal Shading Impact?
                                    </label>

                                    <div className="grid grid-cols-3 gap-2">
                                        {['site', 'roof', 'shadow'].map((type) => (
                                            <div
                                                key={type}
                                                onClick={() => triggerUpload(type)}
                                                className="aspect-square border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden group"
                                            >
                                                {photos[type] ? (
                                                    <>
                                                        <img src={photos[type]} className="w-full h-full object-cover" alt={type} />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Upload size={16} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mb-1 text-[var(--color-solar-gold)]" size={20} />
                                                        <span className="text-[10px] text-[var(--color-solar-light-gray)] uppercase">{type} Photo</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Technical Details */}
                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><Zap size={20} /> Electrical Info</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Sanction Load (kW)</label>
                                            <input type="number" {...register('existingSanctionLoad')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                        </div>
                                        <Controller
                                            name="connectionType"
                                            control={control}
                                            defaultValue="Single Phase"
                                            render={({ field }) => (
                                                <Select
                                                    label="Connection Type"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={CONNECTION_TYPES}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Avg. Monthly Units (kWh)</label>
                                        <input type="number" {...register('averageMonthlyUnits')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Daytime Load %</label>
                                        <input type="number" {...register('daytimeLoadPercentage')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 30" />
                                    </div>

                                    <div
                                        onClick={() => triggerUpload('bill')}
                                        className="p-3 border border-dashed border-white/20 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors overflow-hidden"
                                    >
                                        <span className="text-sm text-[var(--color-solar-light-gray)] truncate">
                                            {photos.bill ? "Bill Uploaded" : "Upload Electricity Bill"}
                                        </span>
                                        {photos.bill ? <CheckCircle className="text-green-400" size={18} /> : <Upload className="text-[var(--color-solar-gold)]" size={18} />}
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><AlertTriangle size={20} /> Safety & Compliance</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Diesel Generator Available?</span>
                                        <input type="checkbox" {...register('dieselGeneratorAvailable')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Earthing (Chemical/Strip) Available?</span>
                                        <input type="checkbox" {...register('earthingAvailability')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Net Metering Feasible?</span>
                                        <input type="checkbox" {...register('netMeteringAllowed')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                    <label className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-sm text-[var(--color-solar-light-gray)]">Lightning Arrestor Required?</span>
                                        <input type="checkbox" {...register('lightningArrestorRequired')} className="w-5 h-5 accent-[var(--color-solar-yellow)]" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Observations */}
                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 gap-6 animate-fadeIn">
                            <div className="glass p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-solar-yellow)] flex items-center gap-2"><CheckCircle size={20} /> Final Observations</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-[var(--color-solar-light-gray)] mb-1">Recommended System Size (kW)</label>
                                        <input type="number" step="0.1" {...register('recommendedSystemSize')} className="w-full md:w-1/3 bg-black/20 border border-white/10 rounded-lg p-3 text-2xl font-bold text-[var(--color-solar-gold)] focus:border-[var(--color-solar-yellow)] focus:outline-none transition-colors" placeholder="e.g. 5.5" />
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

                        {currentStep < 4 ? (
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
                                {isSubmitting ? 'Submitting...' : 'Submit & Generate Quote'} <Save size={20} />
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
