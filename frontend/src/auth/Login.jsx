import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import { Sun, Mail, Lock, ArrowRight, Github, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import Toaster from "../components/ui/Toaster";
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { getRedirectPath } from '../lib/authUtils';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/validation';

const Login = () => {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const data = await login(formData);
      useAuthStore.getState().login(data.access_token);
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      
      addToast("AUTHENTICATION SUCCESSFUL", "success");
      
      const role = useAuthStore.getState().role;
      const redirectPath = getRedirectPath(role);
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "LOGIN FAILED";
      addToast(Array.isArray(msg) ? msg[0] : msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster toasts={toasts} onRemove={removeToast} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl px-6"
      >
        <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group/card">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-shimmer pointer-events-none" />
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Welcome <span className="text-solar-yellow">Back</span></h2>
            <p className="text-blue-100/40 text-sm font-light uppercase tracking-widest">Access your solar portal</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
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
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-4 text-[10px] font-black tracking-widest text-red-500 uppercase"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    {...register('password')}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-sm font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.password ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-solar-yellow/50 hover:text-solar-yellow transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-4 text-[10px] font-black tracking-widest text-red-500 uppercase"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.password.message}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-solar-yellow transition-colors">
                  <div className="w-2 h-2 bg-solar-yellow rounded-sm opacity-0 group-has-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-blue-100/40 group-hover:text-white transition-colors">Remember Me</span>
              </label>
              <Button variant="link" onClick={() => navigate('/forgot-password')} className="text-solar-yellow hover:text-solar-gold transition-colors underline decoration-dotted underline-offset-4 cursor-pointer p-0 h-auto font-black tracking-widest uppercase">Forgot Password?</Button>
            </div>

            <Button disabled={isLoading} className="w-full bg-solar-yellow text-deep-navy font-black py-7 rounded-2xl text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(255,215,0,0.2)] group overflow-hidden relative cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> AUTHENTICATING...
                  </>
                ) : (
                  <>
                    AUTHENTICATE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/10">
            <p className="text-center text-xs font-black text-blue-100/20 tracking-[0.3em] uppercase mb-6">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="ghost" className="flex items-center justify-center gap-3 glass py-3 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black tracking-widest uppercase h-auto">
                <Github className="w-4 h-4 text-solar-yellow" /> Github
              </Button>
              <Button variant="ghost" className="flex items-center justify-center gap-3 glass py-3 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black tracking-widest uppercase h-auto">
                <svg className="w-4 h-4 text-solar-yellow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-2.008 4.252-1.348 1.348-3.488 2.82-7.84 2.82-6.72 0-12.12-5.4-12.12-12.12s5.4-12.12 12.12-12.12c3.48 0 6.24 2.32 7.84 4.56l2.48-2.48C18.12 2.36 15.36 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c3.72 0 6.6-1.2 8.76-3.48 2.22-2.22 2.94-5.28 2.94-7.8 0-.72-.06-1.38-.18-1.92h-11.52z" />
                </svg>
                Google
              </Button>
            </div>
          </div>
          
          <p className="mt-10 text-center text-xs font-bold tracking-widest uppercase text-blue-100/40">
            DON'T HAVE AN ACCOUNT?{' '}
            <Button 
             variant="link"
              onClick={() => navigate('/register')}
              className="text-solar-yellow hover:text-solar-gold transition-colors font-black p-0 h-auto"
            >
              INITIALIZE SIGNUP
            </Button>
          </p>
        </div>

        {/* Back to Home */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mt-8 flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black tracking-[0.4em] uppercase w-full group relative z-20 bg-transparent hover:bg-transparent h-auto p-0"
        >
          <Sun className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" /> Return to Earth
        </Button>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;