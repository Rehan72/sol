import React from 'react';
import { Search, Bell, Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { logout } from '../api/auth';
import { motion } from 'framer-motion';
import RealisticSun from './ui/RealisticSun';
import { Button } from './ui/button';
import { useAuthStore } from '../store/authStore';


function Header({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, role } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatRole = (roleStr) => {
    if (!roleStr) return '';
    return roleStr.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="flex h-16 items-center justify-between px-6 md:px-10">
      {/* Branding & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors border border-white/5 h-auto w-auto"
        >
          <Menu className="w-5 h-5 text-solar-yellow" />
        </Button>

        <div className="flex items-center group">
          {/* <div className="w-12 h-12 relative flex items-center justify-center overflow-hidden shrink-0">
            <RealisticSun className="w-12 h-12" scale={0.5} rotate={true} />
          </div> */}
          <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap -ml-1">
            SOLAR<span className="text-solar-yellow italic">MAX</span>
          </span>
        </div>
      </div>

      {/* Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex flex-1 max-w-xl px-10">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-solar-yellow transition-colors" />
          <input
            type="text"
            placeholder="SEARCH TELEMETRY..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] uppercase focus:outline-none focus:bg-white/10 focus:border-solar-yellow/20 transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group h-auto w-auto"
        >
          <Bell className="w-5 h-5 text-solar-yellow/60 group-hover:text-solar-yellow transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-solar-yellow rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
        </Button>

        <div className="h-10 w-px bg-white/5 mx-2 hidden sm:block" />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 glass p-1.5 pr-4 rounded-2xl border-white/5 cursor-pointer group outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-solar-yellow/10 flex items-center justify-center border border-solar-yellow/20 group-hover:bg-solar-yellow/20 transition-colors">
                <User className="w-4 h-4 text-solar-yellow" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-black tracking-widest uppercase leading-none mb-1">
                  {user?.name || user?.email || 'User'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse" />
                  <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Online</p>
                </div>
              </div>
            </motion.div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="min-w-[200px] glass-dark border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl z-50 animate-in fade-in zoom-in-95 duration-200"
              sideOffset={8}
            >
              <div className="px-3 py-2 border-b border-white/5 mb-2">
                <p className="text-[10px] font-black tracking-widest uppercase text-white/80">{user?.name || 'User'}</p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">{user?.email}</p>
                <p className="text-[8px] font-bold text-solar-yellow/40 uppercase tracking-widest mt-1">{formatRole(role)}</p>
              </div>

              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-solar-yellow text-white/60 text-xs font-bold tracking-wider uppercase transition-colors outline-none cursor-pointer">
                <User className="w-4 h-4" /> Profile
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-white/60 text-xs font-bold tracking-wider uppercase transition-colors outline-none cursor-pointer mt-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default Header;