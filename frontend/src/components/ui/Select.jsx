import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

const Select = ({ 
  name, 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option", 
  icon: Icon,
  error,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange({ target: { name, value: optionValue } }); // Mimic event object for ease of integration
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${
          error ? 'text-red-400' : 'text-white/60'
        }`}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative w-full pl-12 pr-10 py-4 cursor-pointer
          bg-white/5 border rounded-xl text-white transition-all duration-300
          hover:bg-white/10
          ${error 
            ? 'border-red-500/50' 
            : isOpen ? 'border-solar-yellow/50 bg-white/10 shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'border-white/10'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Leading Icon */}
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          isOpen || value ? 'text-solar-yellow' : 'text-white/30'
        }`}>
          {Icon && <Icon className="w-full h-full" />}
        </div>

        {/* Selected Value or Placeholder */}
        <div className={`text-base font-medium truncate ${!selectedOption?.label ? 'text-white/30' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </div>

        {/* Chevron */}
        <ChevronDown 
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-solar-yellow' : ''
          }`} 
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" /> {error}
        </motion.p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 overflow-hidden rounded-xl border border-white/10 bg-deep-navy/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5"
          >
            <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    relative px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors
                    ${value === option.value ? 'bg-solar-yellow/10 text-solar-yellow' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  {/* Option Checkmark (Custom bullet if selected) */}
                  <div className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                    value === option.value ? 'border-solar-yellow bg-solar-yellow text-deep-navy' : 'border-white/20 bg-transparent'
                  }`}>
                    {value === option.value && <Check className="w-3 h-3" />}
                  </div>
                  
                  <span className="font-medium">{option.label}</span>
                </div>
              ))}
              
              {options.length === 0 && (
                <div className="px-4 py-3 text-white/40 text-center italic">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
