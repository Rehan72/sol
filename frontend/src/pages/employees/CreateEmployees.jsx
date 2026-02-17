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
    X,
    Building2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Select from '../../components/ui/Select';
import EmployeeService from '../../services/EmployeeService';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';
import { getAllPlants } from '../../api/plant';
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
    const [plants, setPlants] = useState([]);
    const { addToast } = useToast();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'superadmin') {
            const fetchPlants = async () => {
                try {
                    const data = await getAllPlants();
                    setPlants(data.map(p => ({ value: p.id, label: p.plantName })));
                } catch (error) {
                    console.error("Failed to fetch plants", error);
                    addToast("Failed to load plants", "error");
                }
            };
            fetchPlants();
        }
    }, [user, addToast]);

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
                plantId: employee.plant?.id || '',
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
         <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="film-grain" />
            <div className="cinematic-vignette" />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 md:px-12 py-8 mx-auto w-full pb-20">
                {/* Premium Header Area */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/employees')}
                                className="p-0 h-auto hover:bg-transparent group/back"
                            >
                                <div className="w-8 h-8 glass rounded-full flex items-center justify-center group-hover/back:bg-white/10 transition-colors border-white/10">
                                    <ArrowLeft className="w-4 h-4 text-solar-yellow" />
                                </div>
                            </Button>
                            <span className="text-solar-yellow text-[10px] font-black uppercase tracking-[0.4em]">
                                Administration Control
                            </span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                            {isEditMode ? 'Edit' : 'Create'} <span className="text-solar-yellow italic">Employee</span>
                        </h1>
                    </div>

                    <div className="glass px-6 py-3 h-auto rounded-xl text-[10px] font-black tracking-[0.3em] uppercase border border-white/10 text-white/40">
                        <span className="text-white/40 mr-2">PROTOCOL:</span>
                        <span>{isEditMode ? 'MODIFICATION' : 'REGISTRATION'} ACTIVE</span>
                    </div>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="glass rounded-3xl p-8 md:p-12 mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                        {/* Plant Selection for Super Admin */}
                        {(user?.role === 'SUPER_ADMIN' || user?.role === 'superadmin') && (
                            <div className="relative">
                                <Controller
                                    name="plantId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            name="plantId"
                                            label="Assign Plant"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            options={plants}
                                            icon={Building2}
                                            placeholder="Select Plant"
                                            error={errors.plantId?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}

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