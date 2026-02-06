import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from "../components/ui/button";
import Toaster from "../components/ui/Toaster";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);


  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "EMAIL IS REQUIRED";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "INVALID EMAIL FORMAT";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addToast("RESET LINK SENT SUCCESSFULLY", "success");
      // Simulate API call and redirect
      setTimeout(() => {
         navigate('/login');
      }, 2000);
    } else {
      addToast("PLEASE FIX FORM ERRORS", "error");
    }
  };

  return (
    <AuthLayout>
      <Toaster toasts={toasts} onRemove={removeToast} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group/card">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-shimmer pointer-events-none" />
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Password <span className="text-solar-yellow">Reset</span></h2>
            <p className="text-blue-100/40 text-sm font-light uppercase tracking-widest">Recover your solar portal access</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-solar-yellow/50'}`} />
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold tracking-widest uppercase focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/20 ${errors.email ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-solar-yellow/50'}`}
                  />
                </div>
                {errors.email && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-4 text-[10px] font-black tracking-widest text-red-500 uppercase"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </motion.div>
                )}
              </div>
            </div>

            <Button className="w-full bg-solar-yellow text-deep-navy font-black py-7 rounded-2xl text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(255,215,0,0.2)] group overflow-hidden relative cursor-pointer">
              <span className="relative z-10 flex items-center justify-center gap-2">
                SEND RESET LINK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/10 text-center">
            <Button 
              variant="link"
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 mx-auto text-blue-100/40 hover:text-white transition-colors text-[10px] font-black tracking-[0.4em] uppercase group h-auto p-0"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Button>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
