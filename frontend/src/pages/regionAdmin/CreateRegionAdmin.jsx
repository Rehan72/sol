import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Activity,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import LocationPicker from '../../components/ui/LocationPicker';
import Select from '../../components/ui/Select';
import { INDIAN_STATES_AND_CITIES } from '../../data/mockData';
import { createRegionAdmin, getRegionAdminById, updateRegionAdmin } from '../../api/regionAdmin';
import Toaster from '../../components/ui/Toaster';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { regionAdminSchema, defaultValues } from '../../schemas/regionAdminSchema';

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
  const location = useLocation();
  const adminId = location.state?.adminId; // Get ID from navigation state
  const { control, handleSubmit, trigger, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm({
    resolver: zodResolver(regionAdminSchema),
    defaultValues: defaultValues,
    mode: 'onBlur', // Validate on blur
    shouldUnregister: false, // Keep values when fields unmount (tab switch)
  });

  const [activeTab, setActiveTab] = React.useState('profile');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const stateValue = watch('state'); // Watch state to clear city if needed

  // Effect to clear city when state changes - need to handle this carefully with react-hook-form
  // Ideally, we handle this in the onChange of the State select, not in an effect to avoid loops

  // Fetch region admin data if in edit mode
  React.useEffect(() => {
    if (adminId) {
      setIsEditMode(true);
      fetchRegionAdminData();
    }
  }, [adminId]);

  const fetchRegionAdminData = async () => {
    try {
      setIsLoading(true);
      const admin = await getRegionAdminById(adminId);

      // Pre-populate form with admin data using reset()
      reset({
        adminName: admin.name || '',
        email: admin.email || '',
        mobile: admin.phone || '',
        password: '', // Don't populate password
        role: admin.role || 'REGION_ADMIN',
        status: admin.status || 'active',
        regionName: admin.regionName || '',
        regionCode: admin.regionCode || '',
        location: admin.location || '',
        utility: admin.utility || '',
        country: admin.country || '',
        state: admin.state || '',
        city: admin.city || '',
        pincode: admin.pincode || '',
      });
    } catch (error) {
      console.error('Error fetching region admin:', error);
      addToast('Failed to load region admin data', 'error');
      navigate('/region-admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);

    // Validate current tab fields before moving next
    const fieldsToValidate = currentIndex === 0
      ? ['adminName', 'email', 'password', 'mobile', 'role', 'status']
      : ['regionName', 'regionCode', 'location', 'utility', 'country', 'state', 'city'];

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted:', data);

      // Transform data to match backend DTO
      const payload = {
        name: data.adminName,           // Map adminName to name
        email: data.email,
        phone: data.mobile,             // Map mobile to phone
        state: data.state || undefined,
        city: data.city || undefined,
        pincode: data.pincode || undefined,  // Add pincode field
        location: data.location || undefined,
        regionName: data.regionName || undefined,
        regionCode: data.regionCode || undefined,
        country: data.country || undefined,
        utility: data.utility || undefined,
        role: data.role || undefined,
        status: data.status || undefined,
        // Convert latitude/longitude to numbers
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      };

      // Only include password if provided (for create or password change)
      if (data.password && data.password.trim()) {
        payload.password = data.password;
      }

      console.log('Transformed payload:', payload);

      if (isEditMode) {
        await updateRegionAdmin(adminId, payload);
        addToast('Region Admin updated successfully!', 'success');
      } else {
        await createRegionAdmin(payload);
        addToast('Region Admin created successfully!', 'success');
      }

      // Small delay to let toast be seen before navigation
      setTimeout(() => {
        navigate('/region-admin');
      }, 1000);
    } catch (error) {
      console.error('Error creating region admin:', error);
      const responseData = error.response?.data;

      // Handle validation errors from backend
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const errorMessages = responseData.errors.join('\n');
        addToast(`Validation failed:\n${errorMessages}`, 'error');
      } else if (responseData?.message) {
        addToast(responseData.message, 'error');
      } else {
        addToast('Failed to create Region Admin. Please try again.', 'error');
      }
    }
  };

  const onInvalid = (errors) => {
    console.log('Form Validation Errors:', errors);
    // Show toast for first validation error
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      addToast(firstError.message, 'error');
    }
  };



  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
      <Toaster toasts={toasts} onRemove={removeToast} />
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
            {isEditMode ? 'Edit' : 'Create'} <span className="text-solar-yellow">Region Admin</span>
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
                  className={`relative px-6 py-4 flex items-center gap-3 transition-colors group ${activeTab === tab.id
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
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="glass rounded-3xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between"
            >
              <div className="flex-1">
                {/* Profile Tab */}
                <div className={`${activeTab === 'profile' ? 'block' : 'hidden'} space-y-6 animate-in slide-in-from-right-4 duration-500`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="adminName" label="Admin Name" required errors={errors}>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="adminName"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g., John Doe" className={getInputClassName(errors.adminName)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <FormField name="email" label="Email Address" required errors={errors}>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="email" placeholder="e.g., john@example.com" className={getInputClassName(errors.email)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <FormField name="password" label="Password" required errors={errors}>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className={getInputClassName(errors.password) + " pr-12"}
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormField>

                    <FormField name="mobile" label="Phone Number" required errors={errors}>
                      <div className="relative">
                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="mobile"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="tel" placeholder="e.g., 9876543210" className={getInputClassName(errors.mobile)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <FormField name="role" label="Role" errors={errors}>
                      <div className="relative">
                        <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-solar-yellow`} />
                        <input type="text" value="Regional Admin" disabled className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-solar-yellow font-bold uppercase tracking-wider cursor-not-allowed opacity-80" />
                      </div>
                    </FormField>

                    <div className="relative">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name="status"
                            label="Account Status"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={STATUS_OPTIONS}
                            icon={Activity}
                            error={errors.status?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Region Tab */}
                <div className={`${activeTab === 'region' ? 'block' : 'hidden'} space-y-6 animate-in slide-in-from-right-4 duration-500`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField name="regionName" label="Region Name" required errors={errors}>
                      <div className="relative">
                        <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="regionName"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g., North Zone" className={getInputClassName(errors.regionName)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <FormField name="regionCode" label="Region Code" required errors={errors}>
                      <div className="relative">
                        <FileBadge className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="regionCode"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g., RE-NORTH-01" className={getInputClassName(errors.regionCode)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <div className="md:col-span-2">
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <LocationPicker
                            value={{
                              location: field.value,
                              latitude: watch('latitude'),
                              longitude: watch('longitude')
                            }}
                            onChange={(data) => {
                              const { addressDetails } = data;
                              setValue('location', data.location);
                              setValue('latitude', data.latitude);
                              setValue('longitude', data.longitude);
                              setValue('country', addressDetails?.country || watch('country') || '');

                              // Auto-populate pincode from address details
                              if (addressDetails?.postcode) {
                                setValue('pincode', addressDetails.postcode);
                              }

                              // Careful with state resetting logic here if needed
                              if (addressDetails?.state) {
                                setValue('state', addressDetails.state);
                                setValue('city', addressDetails.city || addressDetails.town || addressDetails.village || '');
                              }

                              trigger('location'); // Validate location manually after update
                            }}
                            errors={errors.location ? { location: errors.location.message } : {}}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </div>

                    <FormField name="country" label="Country" errors={errors}>
                      <div className="relative">
                        <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="country"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" className={getInputClassName(errors.country)} />
                          )}
                        />
                      </div>
                    </FormField>

                    <div className="relative">
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name="state"
                            label="State"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setValue('city', ''); // Reset city on state change
                            }}
                            options={Object.keys(INDIAN_STATES_AND_CITIES).map(s => ({ value: s, label: s }))}
                            icon={Map}
                            placeholder="Select State"
                            error={errors.state?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="relative">
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Select
                            name="city"
                            label="City"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={stateValue ? INDIAN_STATES_AND_CITIES[stateValue]?.map(c => ({ value: c, label: c })) : []}
                            icon={MapPin}
                            placeholder={stateValue ? "Select City" : "Select State First"}
                            disabled={!stateValue}
                            error={errors.city?.message}
                          />
                        )}
                      />
                    </div>

                    <FormField name="utility" label="Utility Provider" required errors={errors}>
                      <div className="relative">
                        <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30`} />
                        <Controller
                          name="utility"
                          control={control}
                          render={({ field }) => (
                            <input {...field} type="text" placeholder="e.g., TATA Power" className={getInputClassName(errors.utility)} />
                          )}
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
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
                      disabled={isSubmitting}
                      onClick={handleNext}
                      className="px-8 gap-2 bg-solar-yellow text-deep-navy hover:bg-solar-yellow/90 font-bold uppercase disabled:opacity-50"
                    >
                      {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Admin' : 'Create Admin')} <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating...' : (
                        <>Create Admin <CheckCircle2 className="w-4 h-4 ml-2" /></>
                      )}
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
const getInputClassName = (error) => {
  return `w-full pl-12 pr-4 py-4 bg-white/5 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-solar-yellow/50'
    } rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors`;
};

const FormField = ({ name, label, required, children, className = '', errors = {} }) => (
  <div className={className}>
    <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${errors[name] ? 'text-red-400' : 'text-white/60'
      }`}>
      {label} {required && '*'}
    </label>
    {children}
    {errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-xs mt-2 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" /> {errors[name]?.message}
      </motion.p>
    )}
  </div>
);

export default CreateRegionAdmin;