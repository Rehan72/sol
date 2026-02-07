import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    Users,
    Lock,
    Eye,
    EyeOff,
    Activity,
    FileBadge,
    Plus,
    X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import EmployeeService from '../../services/EmployeeService';
import Toaster from '../../components/ui/Toaster';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, defaultValues } from '../../schemas/employeeSchema';

const DESIGNATION_OPTIONS = [
    { value: 'Surveyor', label: 'Surveyor' },
    { value: 'Installer', label: 'Installer' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Supervisor', label: 'Supervisor' },
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
];

function CreateEmployees() {
    const navigate = useNavigate();
    const location = useLocation();
    const employeeId = location.state?.employeeId;

    const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: defaultValues,
        mode: 'onBlur',
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    useEffect(() => {
        if (employeeId) {
            setIsEditMode(true);
            fetchEmployeeData();
        }
    }, [employeeId]);

    const fetchEmployeeData = async () => {
        try {
            const employee = await EmployeeService.getEmployeeById(employeeId);
            reset({
                name: employee.name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                password: '',
                designation: employee.designation || '',
                teamName: employee.teamName || '',
                status: employee.status || 'active',
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            addToast('Failed to load employee data', 'error');
            navigate('/employees');
        }
    };

    const onSubmit = async (data) => {
        try {
            // Validate password for create mode
            if (!isEditMode && !data.password) {
                addToast('Password is required for new employees', 'error');
                return;
            }

            const payload = { ...data };
            if (!payload.password) delete payload.password; // Don't send empty password on edit

            if (isEditMode) {
                await EmployeeService.updateEmployee(employeeId, payload);
                addToast('Employee updated successfully!', 'success');
            } else {
                await EmployeeService.createEmployee(payload);
                addToast('Employee created successfully!', 'success');
            }

            setTimeout(() => navigate('/employees'), 1000);
        } catch (error) {
            console.error('Error saving employee:', error);
            addToast(error.response?.data?.message || 'Failed to save employee', 'error');
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

            <div className="relative z-10 px-6 md:px-12 mx-auto pb-20 pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/employees')} className="flex items-center gap-3 text-white/60 hover:text-white p-0 h-auto hover:bg-transparent">
                        <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-solar-yellow" />
                        </div>
                        <span className="text-sm text-solar-yellow font-bold uppercase tracking-widest">Back to List</span>
                    </Button>
                    <h1 className="text-2xl font-black uppercase rim-light tracking-tighter">
                        {isEditMode ? 'Edit' : 'Create'} <span className="text-solar-yellow">Employee</span>
                    </h1>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <FormField name="name" label="Full Name" required errors={errors}>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} placeholder="e.g., John Doe" className={getInputClassName(errors.name)} />
                                    )}
                                />
                            </div>
                        </FormField>

                        <FormField name="email" label="Email Address" required errors={errors}>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} type="email" placeholder="john@example.com" className={getInputClassName(errors.email)} />
                                    )}
                                />
                            </div>
                        </FormField>

                        <FormField name="password" label={isEditMode ? "Password (Leave blank to keep current)" : "Password"} required={!isEditMode} errors={errors}>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder={isEditMode ? "••••••••" : "Enter password"}
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

                        <FormField name="phone" label="Phone Number" required errors={errors}>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} placeholder="e.g., 9876543210" className={getInputClassName(errors.phone)} />
                                    )}
                                />
                            </div>
                        </FormField>

                        <div className="relative">
                            <Controller
                                name="designation"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        name="designation"
                                        label="Designation"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        options={DESIGNATION_OPTIONS}
                                        icon={Briefcase}
                                        placeholder="Select Designation"
                                        error={errors.designation?.message}
                                    />
                                )}
                            />
                        </div>

                        <FormField name="teamName" label="Team Name" errors={errors}>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <Controller
                                    name="teamName"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} placeholder="e.g., Team Alpha" className={getInputClassName(errors.teamName)} />
                                    )}
                                />
                            </div>
                        </FormField>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
                                Documents & Certifications
                            </label>
                            <Controller
                                name="documents"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-3">
                                        {(field.value || []).map((doc, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                                                <div className="bg-solar-yellow/20 p-2 rounded-lg text-solar-yellow">
                                                    <FileBadge className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm flex-1 truncate">{doc}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newDocs = [...(field.value || [])];
                                                        newDocs.splice(index, 1);
                                                        field.onChange(newDocs);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="flex gap-2">
                                            <input
                                                id="new-doc-input"
                                                type="text"
                                                placeholder="Add document link/name..."
                                                className={getInputClassName(null)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.currentTarget.value.trim();
                                                        if (val) {
                                                            field.onChange([...(field.value || []), val]);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('new-doc-input');
                                                    const val = input.value.trim();
                                                    if (val) {
                                                        field.onChange([...(field.value || []), val]);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-white/40">Enter document URL or name and press Enter</p>
                                    </div>
                                )}
                            />
                        </div>

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

                    <div className="flex justify-end pt-6 border-t border-white/10">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-solar-yellow hover:bg-solar-yellow/90 text-deep-navy font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Create Employee')}
                            {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                        </Button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}

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

export default CreateEmployees;