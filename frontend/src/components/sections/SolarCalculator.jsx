import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, DollarSign, Leaf, Shield } from "lucide-react";

const SolarCalculator = () => {
  const [bill, setBill] = useState(5000);
  const [savings, setSavings] = useState({ monthly: 0, yearly: 0, co2: 0 });

  useEffect(() => {
    // Average unit rate in India ~₹8
    const units = bill / 8;
    // 1kW produces approx 4 units/day = 120 units/month
    const kwSize = Math.max(1, Math.min(10, Math.ceil(units / 120)));
    
    // PM-Surya Ghar Subsidy (Exact INR values)
    // Up to 1kW: ₹30,000
    // Up to 2kW: ₹60,000
    // 3kW and above: ₹78,000
    let subsidy = 0;
    if (kwSize === 1) subsidy = 30000;
    else if (kwSize === 2) subsidy = 60000;
    else subsidy = 78000;

    const monthlySaved = bill * 0.9; // Assuming 90% bill reduction

    setSavings({
      monthly: Math.round(monthlySaved),
      yearly: Math.round(monthlySaved * 12),
      co2: Math.round(units * 0.8), // 0.8kg CO2 per unit
      subsidy: subsidy.toLocaleString('en-IN'),
      kw: kwSize
    });
  }, [bill]);

  return (
    <div className="w-full px-8 md:px-16 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.3em] text-solar-yellow mb-6">
              YOUR MONTHLY BILL: <span className="text-white text-3xl ml-4">₹{bill.toLocaleString('en-IN')}</span>
            </label>
            <input 
              type="range" 
              min="1000" 
              max="20000" 
              step="500"
              value={bill}
              onChange={(e) => setBill(parseInt(e.target.value))}
              className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-solar-yellow hover:bg-white/10 transition-colors"
            />
            <div className="flex justify-between text-[10px] font-black tracking-widest text-white/20 mt-4 uppercase">
              <span>Min ₹1,000</span>
              <span>Max ₹20,000+</span>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 relative group overflow-hidden">
             <div className="absolute inset-0 bg-radial-gradient from-solar-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-full bg-solar-yellow/20 flex items-center justify-center border border-solar-yellow/30">
                  <Shield className="w-5 h-5 text-solar-yellow" />
               </div>
               <span className="text-xs font-black tracking-widest text-solar-yellow uppercase">Govt Approved Subsidy</span>
            </div>
            <p className="text-lg text-blue-100/40 leading-relaxed font-light italic relative z-10">
              "You are eligible for the <span className="text-white font-bold">PM-Surya Ghar Yojana</span>. For a {savings.kw}kW system, you can receive up to <span className="text-solar-yellow font-black">${savings.subsidy}</span> in direct subsidies."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "MONTHLY SAVINGS", value: `₹${savings.monthly.toLocaleString('en-IN')}`, icon: DollarSign, color: "text-green-400" },
            { label: "YEARLY SAVINGS", value: `₹${savings.yearly.toLocaleString('en-IN')}`, icon: Zap, color: "text-solar-yellow" },
            { label: "GOVT SUBSIDY (PM-SY)", value: `₹${savings.subsidy}`, icon: Shield, color: "text-blue-400" },
            { label: "CO2 REDUCTION", value: `${savings.co2}kg`, icon: Leaf, color: "text-emerald-400" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass p-8 rounded-[2rem] flex items-center gap-8 border border-white/5 group hover:bg-white/5 transition-colors"
            >
              <div className={`p-5 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-2">{item.label}</p>
                <p className="text-4xl font-black tracking-tighter">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarCalculator;
