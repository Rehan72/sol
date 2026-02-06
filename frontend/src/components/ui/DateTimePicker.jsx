import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X,
  Check
} from 'lucide-react';
import { Button } from './button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PRESETS = [
    { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
    { label: 'Yesterday', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { start: d, end: d }; } },
    { label: 'Last 7 Days', getValue: () => { const d = new Date(); const s = new Date(); s.setDate(s.getDate() - 6); return { start: s, end: d }; } },
    { label: 'This Month', getValue: () => { const d = new Date(); const s = new Date(d.getFullYear(), d.getMonth(), 1); return { start: s, end: d }; } },
];

const DateTimePicker = ({ 
    value, 
    onChange, 
    label, 
    placeholder = "Select Date",
    mode = "single", // 'single' | 'range'
    showTime = false,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date()); // For Calendar Navigation
    const [tempValue, setTempValue] = useState(value || (mode === 'range' ? { start: null, end: null } : null));
    const containerRef = useRef(null);

    // Sync internal state if prop changes
    useEffect(() => {
        if (value) {
            setTempValue(value);
            // If single date, view that month. If range, view start month.
            const dateToView = mode === 'range' ? (value.start || new Date()) : (value || new Date());
            setViewDate(new Date(dateToView));
        }
    }, [value, mode]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset temp value to actual value on close without apply
                if(value) setTempValue(value); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    // Helper: Generate Days for Grid
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        
        // Pad empty days at start
        const firstDayIndex = date.getDay();
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(null);
        }

        // Days of month
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const calendarDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

    // Day Click Handler
    const handleDayClick = (date) => {
        if (!date) return;
        
        // Normalize time to avoid timezone mess (keep 00:00:00 for dates unless time picked)
        // copy existing time from tempValue if exists
        const newDate = new Date(date);
        
        if (showTime) {
             const current = mode === 'range' 
                ? (tempValue?.start || new Date()) // Default to current time if fresh
                : (tempValue || new Date());
             newDate.setHours(current.getHours(), current.getMinutes());
        } else {
             newDate.setHours(0,0,0,0);
        }

        if (mode === 'single') {
            setTempValue(newDate);
        } else {
            // Range Logic
            if (!tempValue?.start || (tempValue.start && tempValue.end)) {
                // Warning: new start
                setTempValue({ start: newDate, end: null });
            } else {
                // Complete range
                let start = tempValue.start;
                let end = newDate;
                if (end < start) { [start, end] = [end, start]; }
                setTempValue({ start, end });
            }
        }
    };

    const isSelected = (date) => {
        if (!date) return false;
        if (mode === 'single') {
            return tempValue && date.toDateString() === tempValue.toDateString();
        } else {
            if (tempValue?.start && date.toDateString() === tempValue.start.toDateString()) return true;
            if (tempValue?.end && date.toDateString() === tempValue.end.toDateString()) return true;
            if (tempValue?.start && tempValue?.end) {
                return date > tempValue.start && date < tempValue.end;
            }
            return false;
        }
    };

    const isRangeStart = (date) => mode === 'range' && tempValue?.start && date?.toDateString() === tempValue.start.toDateString();
    const isRangeEnd = (date) => mode === 'range' && tempValue?.end && date?.toDateString() === tempValue.end.toDateString();
    const isInRange = (date) => mode === 'range' && tempValue?.start && tempValue?.end && date > tempValue.start && date < tempValue.end;

    const navigateMonth = (dir) => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + dir);
        setViewDate(d);
    };

    const applySelection = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const formatDate = (val) => {
        if (!val) return "";
        if (mode === 'single') {
             return val.toLocaleDateString() + (showTime ? ' ' + val.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '');
        } else {
            if (!val.start) return "";
            const s = val.start.toLocaleDateString();
            const e = val.end ? val.end.toLocaleDateString() : '...';
            return `${s} - ${e}`;
        }
    };

    const TimeControls = ({ label, val, setter }) => (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-white/40">{label}</span>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
                <input 
                    type="number" 
                    min="0" max="23" 
                    value={val.getHours()} 
                    onChange={(e) => {
                        const d = new Date(val);
                        d.setHours(parseInt(e.target.value));
                        setter(d);
                    }}
                    className="w-8 bg-transparent text-center text-sm font-bold focus:outline-none"
                />
                <span className="text-white/20">:</span>
                <input 
                    type="number" 
                    min="0" max="59" 
                    value={val.getMinutes()} 
                    onChange={(e) => {
                        const d = new Date(val);
                        d.setMinutes(parseInt(e.target.value));
                        setter(d);
                    }}
                    className="w-8 bg-transparent text-center text-sm font-bold focus:outline-none"
                />
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
                    {label}
                </label>
            )}

            {/* Trigger Input */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-3 
                    bg-white/5 border rounded-xl cursor-pointer transition-all duration-300
                    ${isOpen ? 'border-solar-yellow/50 bg-white/10 shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'border-white/10 hover:bg-white/10'}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <CalendarIcon className={`w-5 h-5 shrink-0 ${isOpen || tempValue ? 'text-solar-yellow' : 'text-white/30'}`} />
                    <span className={`text-sm font-medium truncate ${!tempValue || (mode==='range' && !tempValue.start) ? 'text-white/30' : 'text-white'}`}>
                        {formatDate(tempValue) || placeholder}
                    </span>
                </div>
                {tempValue && ((mode === 'single' && tempValue) || (mode === 'range' && tempValue.start)) && (
                     <div onClick={(e) => { e.stopPropagation(); onChange(null); setTempValue(null); }} className="p-1 hover:bg-white/10 rounded-full">
                         <X className="w-3 h-3 text-white/30 hover:text-white" />
                     </div>
                )}
            </div>

            {/* Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 mt-2 w-full min-w-[320px] max-w-sm bg-deep-navy/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-4"
                    >
                        {/* Header: Month Checks */}
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white h-auto w-auto">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <span className="font-black uppercase tracking-wide text-sm">
                                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white h-auto w-auto">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Presets (Range Mode Only) */}
                        {mode === 'range' && (
                            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-white/10">
                                {PRESETS.map(preset => (
                                    <Button
                                        key={preset.label}
                                        variant="ghost"
                                        onClick={() => {
                                            const val = preset.getValue();
                                            setTempValue(val);
                                            setViewDate(val.start); // Jump to start
                                        }}
                                        className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-solar-yellow transition-colors h-auto"
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-4">
                            {DAYS.map(d => <span key={d} className="text-[10px] font-bold text-white/30 uppercase mb-2">{d}</span>)}
                            
                            {calendarDays.map((date, i) => {
                                if (!date) return <div key={`empty-${i}`} />;
                                
                                const selected = isSelected(date);
                                const rangeStart = isRangeStart(date);
                                const rangeEnd = isRangeEnd(date);
                                const inRange = isInRange(date);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <button
                                        key={date.toString()}
                                        onClick={() => handleDayClick(date)}
                                        className={`
                                            h-9 rounded-lg text-xs font-medium transition-all relative
                                            ${rangeStart || rangeEnd || (mode === 'single' && selected) 
                                                ? 'bg-solar-yellow text-deep-navy font-bold shadow-[0_0_10px_rgba(255,215,0,0.4)] z-10' 
                                                : 'hover:bg-white/10 text-white/80'}
                                            ${inRange ? 'bg-solar-yellow/20 text-white rounded-none mx-[-2px]' : ''}
                                            ${rangeStart ? 'rounded-r-none!' : ''}
                                            ${rangeEnd ? 'rounded-l-none!' : ''}
                                            
                                        `}
                                    >
                                        {date.getDate()}
                                        {isToday && !selected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-solar-yellow rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Picker Section */}
                        {showTime && (
                           <div className="pt-4 border-t border-white/10 mb-4">
                                <div className="flex items-center gap-4">
                                    <Clock className="w-4 h-4 text-white/40" />
                                    {mode === 'single' && tempValue && (
                                        <TimeControls label="Time" val={tempValue} setter={setTempValue} />
                                    )}
                                    {mode === 'range' && tempValue?.start && (
                                        <div className="flex gap-4">
                                            <TimeControls label="Start Time" val={tempValue.start} setter={(d) => setTempValue({...tempValue, start: d})} />
                                            {tempValue.end && (
                                                 <TimeControls label="End Time" val={tempValue.end} setter={(d) => setTempValue({...tempValue, end: d})} />
                                            )}
                                        </div>
                                    )}
                                </div>
                           </div> 
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] text-white/30">
                                {tempValue ? formatDate(tempValue) : 'No Selection'}
                            </span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-white/40 hover:text-white" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button size="sm" className="bg-solar-yellow text-deep-navy" onClick={applySelection}>Apply</Button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DateTimePicker;
