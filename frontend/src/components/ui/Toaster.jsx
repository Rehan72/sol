import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const Toaster = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none items-center">
      <AnimatePresence mode="popLayout">
        {[...toasts].reverse().map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)", transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
            style={{ originY: 0 }} // Ensure scale origin is top to avoid jumping
            className={`pointer-events-auto relative group glass p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl flex items-start gap-4 overflow-hidden`}
          >
            {/* Background Glow */}
            <div className={`absolute -inset-1 opacity-20 blur-xl pointer-events-none transition-colors duration-500 ${
              toast.type === "error" ? "bg-red-500" : 
              toast.type === "success" ? "bg-[#07b97d]" : 
              "bg-blue-400"
            }`} />

            <div className="relative z-10">
              {toast.type === "error" && (
                <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
              {toast.type === "success" && (
                <div className="p-2 rounded-xl bg-[#07b97d]/20 border border-[#07b97d]/20">
                  <CheckCircle className="w-5 h-5 text-[#07b97d]" />
                </div>
              )}
              {toast.type === "info" && (
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/20">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
              )}
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1 leading-none">
                {toast.type || "Notification"}
              </h4>
              <p className="text-sm font-bold text-white leading-tight">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="relative z-10 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
                className={`h-full ${
                  toast.type === "error" ? "bg-red-500" : 
                  toast.type === "success" ? "bg-[#07b97d]" : 
                  "bg-blue-400"
                }`}
              />
            </div>

            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
