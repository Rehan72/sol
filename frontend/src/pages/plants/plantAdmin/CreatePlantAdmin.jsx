import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ChevronRight,
  Loader2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import Select from '../../../components/ui/Select';
import { z } from 'zod';
import { createPlantAdmin, getPlantAdminById, updatePlantAdmin } from '../../../api/plantAdmin';
import { getAllPlants } from '../../../api/plant';
import { useToast } from '../../../hooks/useToast';

// Zod Validation Schema
const plantAdminSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  status: z.string(),
  assignedPlantId: z.string().min(1, 'Plant assignment is required'),
});

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
  const location = useLocation();
  const adminId = location.state?.adminId; // Get ID from navigation state
  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    role: 'PLANT_ADMIN',
    status: 'active',
    assignedPlantId: '',
    region: '',
    plantCode: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [plants, setPlants] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchPlants();

    // Check if in edit mode
    if (adminId) {
      setIsEditMode(true);
      fetchPlantAdminData();
    }
  }, [adminId]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const data = await getAllPlants();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      addToast('Failed to load plants', 'error');
    } finally {
      // Don't set loading false here if in edit mode, wait for admin data
      if (!adminId) {
        setLoading(false);
      }
    }
  };

  const fetchPlantAdminData = async () => {
    try {
      const admin = await getPlantAdminById(adminId);

      // Pre-populate form with admin data
      setFormData({
        fullName: admin.fullName || admin.name || '',
        email: admin.email || '',
        mobile: admin.mobile || admin.phone || '',
        password: '', // Don't populate password for security
        role: admin.role || 'PLANT_ADMIN',
        status: admin.status || 'active',
        assignedPlantId: admin.assignedPlant?.id || admin.plant?.id || '',
        region: admin.assignedPlant?.state || admin.plant?.state || '',
        plantCode: admin.assignedPlant?.plantCode || admin.plant?.plantCode || ''
      });
    } catch (error) {
      console.error('Error fetching plant admin:', error);
      addToast('Failed to load plant admin data', 'error');
      navigate('/plant-admin');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get available plants options
  const plantOptions = plants.map(p => ({
    value: p.id,
    label: p.plantName,
    disabled: false // We'll handle assignment checking on backend
  }));

  const validateField = (name, value) => {
    try {
      const fieldSchema = {
        fullName: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.string().email('Invalid email address'),
        mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        assignedPlantId: z.string().min(1, 'Plant assignment is required'),
      };

      if (fieldSchema[name]) {
        // Clean mobile number
        const cleanValue = name === 'mobile' ? value.replace(/\D/g, '') : value;
        fieldSchema[name].parse(cleanValue);
      }
      return '';
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && error.errors.length > 0) {
        return error.errors[0].message;
      }
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
          region: selectedPlant.state || selectedPlant.location,
          plantCode: selectedPlant.plantCode
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
      const cleanValue = name === 'mobile' ? value.replace(/\D/g, '') : value;
      setErrors(prev => ({ ...prev, [name]: validateField(name, cleanValue) }));
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
      ? ['fullName', 'email', 'password', 'mobile']
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate with Zod (skip password validation in edit mode if empty)
      const validationSchema = isEditMode && !formData.password
        ? plantAdminSchema.omit({ password: true })
        : plantAdminSchema;

      const validationData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile.replace(/\D/g, ''),
        status: formData.status,
        assignedPlantId: formData.assignedPlantId,
      };

      // Only validate password if it's provided or in create mode
      if (!isEditMode || formData.password) {
        validationData.password = formData.password;
      }

      validationSchema.parse(validationData);

      setSubmitting(true);

      // Prepare data for API
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile.replace(/\D/g, ''), // Clean phone number
        status: formData.status,
        assignedPlantId: formData.assignedPlantId,
      };

      // Only include password if provided
      if (formData.password && formData.password.trim()) {
        apiData.password = formData.password;
      }

      if (isEditMode) {
        await updatePlantAdmin(adminId, apiData);
        addToast('Plant Admin updated successfully!', 'success');
      } else {
        await createPlantAdmin(apiData);
        addToast('Plant Admin created successfully!', 'success');
      }
      setTimeout(() => {
        navigate('/plant-admin');
      }, 1000);
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        let hasAssignmentError = false;

        error?.errors?.forEach(err => {
          const field = err.path[0];
          newErrors[field] = err.message;

          // Check if error is in assignment tab
          if (field === 'assignedPlantId') {
            hasAssignmentError = true;
          }
        });
        setErrors(newErrors);
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        // Switch to assignment tab if that's where the error is
        if (hasAssignmentError && activeTab !== 'assignment') {
          setActiveTab('assignment');
          addToast('Please select a plant to assign', 'error');
        } else {
          // Show first error in toast
          const firstError = error.errors[0]?.message;
          if (firstError) {
            addToast(firstError, 'error');
          }
        }
      } else {
        console.error('Error creating plant admin:', error);
        const errorMessage = error.response?.data?.message || 'Failed to create plant admin';
        addToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
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

              <FormField name="password" label="Password" required touched={touched} errors={errors}>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={getInputClassName('password', touched, errors) + ' pr-12'}
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
            {isEditMode ? 'Edit' : 'New'} <span className="text-solar-yellow">Plant Admin</span>
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
                      disabled={submitting}
                      className="bg-solar-yellow text-deep-navy font-bold hover:bg-solar-gold px-8 shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isEditMode ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEditMode ? 'Update Admin Member' : 'Create Admin Member'
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
  )
}

// Helpers
const getInputClassName = (fieldName, touched, errors) => {
  const hasError = touched[fieldName] && errors[fieldName];
  return `w-full pl-12 pr-4 py-4 bg-white/5 border ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-solar-yellow/50'
    } rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors`;
};

const FormField = ({ name, label, required, children, className = '', touched = {}, errors = {} }) => (
  <div className={className}>
    <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${touched[name] && errors[name] ? 'text-red-400' : 'text-white/60'
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