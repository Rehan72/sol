import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Sun, Mail, Lock, User, ArrowRight, ShieldCheck, Phone, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import Toaster from "../components/ui/Toaster";
import { useNavigate } from 'react-router-dom';
import { register as registerUser } from '../api/auth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/validation';

const Register = () => {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termOfService: false,
      role: 'CUSTOMER'
    }
  });

  const termOfService = watch('termOfService');

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = { ...data };
      delete payload.confirmPassword;

      const response = await registerUser(payload);
      
      addToast(response.message || "REGISTRATION SUCCESSFUL", "success");
      setTimeout(() => navigate("/login"), 1500); 
    } catch (error) {
       console.error(error);
       const msg = error.response?.data?.message || "REGISTRATION FAILED";
       addToast(Array.isArray(msg) ? msg[0] : msg, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout>
      <Toaster toasts={toasts} onRemove={removeToast} />
      
      <motion.div 
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl px-6 my-12"
      >
        <div className="glass-dark p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group/card">
          <div className="absolute inset-0 bg-linear-to-br from-solar-yellow/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Initialize <span className="text-solar-yellow">Access</span></h2>
            <p className="text-blue-100/40 text-sm font-light uppercase tracking-widest">Join the solar revolution</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.fullName ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                <input 
                  type="text" 
                  placeholder="FULL NAME"
                  {...register('fullName')}
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.fullName ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                />
              </div>
              {errors.fullName && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS"
                  {...register('email')}
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.email ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                />
              </div>
              {errors.email && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.phone ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                <input 
                  type="tel" 
                  placeholder="PHONE NUMBER"
                  {...register('phone')}
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.phone ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                />
              </div>
              {errors.phone && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    {...register('password')}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-xs font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.password ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-solar-yellow/50 hover:text-solar-yellow transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password.message}
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="CONFIRM"
                    {...register('confirmPassword')}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-xs font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-solar-yellow/50 hover:text-solar-yellow transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                  </motion.div>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-2xl transition-all ${
              errors.termOfService 
                ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                : termOfService 
                  ? 'bg-solar-yellow/10 border-solar-yellow/20' 
                  : 'bg-white/5 border-white/10'
            } border`}>
              <label 
                className="flex items-start gap-4 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  setValue('termOfService', !termOfService, { shouldValidate: true });
                }}
              >
                <div className={`mt-1 w-5 h-5 shrink-0 rounded-lg border flex items-center justify-center transition-all ${termOfService ? 'bg-solar-yellow border-solar-yellow' : 'border-white/20 group-hover:border-solar-yellow'}`}>
                  {termOfService && <ShieldCheck className="w-3 h-3 text-deep-navy" />}
                </div>
                <span className="text-[10px] leading-relaxed text-blue-100/40 group-hover:text-white transition-colors font-bold uppercase tracking-widest">
                  I AGREE TO THE <Button variant="link" className="text-solar-yellow underline underline-offset-4 decoration-dotted p-0 h-auto font-bold uppercase tracking-widest text-[10px]">TERMS OF SERVICE</Button> AND <Button variant="link" className="text-solar-yellow underline underline-offset-4 decoration-dotted p-0 h-auto font-bold uppercase tracking-widest text-[10px]">PRIVACY POLICY</Button>
                </span>
              </label>
              {errors.termOfService && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 mt-2 text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.termOfService.message}
                </motion.div>
              )}
            </div>

            <Button disabled={isLoading} className="w-full bg-solar-yellow text-deep-navy font-black py-8 rounded-2xl text-base tracking-[0.3em] shadow-[0_0_30px_rgba(255,215,0,0.2)] group overflow-hidden relative disabled:opacity-70 disabled:cursor-not-allowed">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </Button>
          </form>
          
          <p className="mt-10 text-center text-xs font-bold tracking-widest uppercase text-blue-100/40">
            ALREADY SECURED?{' '}
            <Button
              variant="link" 
              onClick={() => navigate('/login')}
              className="text-solar-yellow hover:text-solar-gold transition-colors font-black p-0 h-auto"
            >
              NAVIGATE TO LOGIN
            </Button>
          </p>
        </div>

        {/* Home Link */}
        <Button 
          variant="ghost"
          onClick={() => navigate('/')}
          className="mt-8 flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black tracking-[0.4em] uppercase w-full group relative z-20 bg-transparent hover:bg-transparent h-auto p-0"
        >
          <Sun className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" /> Back to Solar System
        </Button>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;