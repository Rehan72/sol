import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Zap,
  Settings,
  ShieldAlert,
  ChevronLeft,
  Sun,
  PieChart,
  HardDrive,
  BugPlay,
  Users,
  Map,
  ClipboardCheck,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const { role } = useAuthStore();

  const menuItems = [
    { name: 'DASHBOARD', icon: LayoutDashboard, path: '/dashboard', allowedRoles: ['SUPER_ADMIN'] },
    { name: 'REGION ADMIN', icon: LayoutDashboard, path: '/region-admin', allowedRoles: ['SUPER_ADMIN'] },
    { name: 'GRID PLANT', icon: BugPlay, path: '/grid-plant', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { name: 'PLANT ADMIN', icon: BugPlay, path: '/plant-admin', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { name: 'DASHBOARD', icon: Users, path: '/plant-admin-dashboard', allowedRoles: ['PLANT_ADMIN'] },
    { name: 'SURVEY TEAMS', icon: Map, path: '/survey-teams', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'INSTALLATION TEAMS', icon: Users, path: '/installation-teams', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'WORKFLOW EXECUTION', icon: ClipboardCheck, path: '/installation-workflow', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'INSTALLATION_TEAM'] },
    { name: 'SOLAR REQUESTS', icon: Sun, path: '/admin/leads', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'CUSTOMER', icon: Users, path: '/customer', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'DASHBOARD', icon: LayoutDashboard, path: '/customer/dashboard', allowedRoles: ['CUSTOMER'] },
    { name: 'ONBOARDING', icon: ClipboardCheck, path: '/customer/setup', allowedRoles: ['CUSTOMER'] },
    { name: 'EMPLOYEES', icon: Users, path: '/employees', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'ANALYTICS', icon: Activity, path: '/analytics', allowedRoles: ['SUPER_ADMIN'] },
    { name: 'SYSTEM HEALTH', icon: Zap, path: '/health', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'DEVICES', icon: HardDrive, path: '/devices', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { name: 'SECURITY', icon: ShieldAlert, path: '/security', allowedRoles: ['SUPER_ADMIN'] },
    { name: 'REPORTS', icon: PieChart, path: '/reports', allowedRoles: ['SUPER_ADMIN'] },
    { name: 'SETTINGS', icon: Settings, path: '/settings', allowedRoles: ['SUPER_ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!role) return true; // Or false if you want strict security
    if (item.allowedRoles.includes('ALL')) return true;
    return item.allowedRoles.includes(role);
  });

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-[73px] z-40 h-[calc(100vh-73px)] flex w-72 flex-col glass border-r border-white/10 duration-300 ease-[0.22,1,0.36,1] lg:static lg:h-auto lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 relative">
          {/* Subtle Internal Glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-radial-gradient from-solar-yellow/5 to-transparent pointer-events-none" />

          <div className="mb-4 relative z-10">
            <span className="block px-4 text-2xl font-black tracking-tighter uppercase whitespace-nowrap mb-4">
              CORE<span className="text-solar-yellow italic">MANAGEMENT</span>
            </span>
            <nav className="space-y-1">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                      ? 'bg-solar-yellow/10 text-solar-yellow shadow-[0_0_20px_rgba(255,215,0,0.05)] border border-solar-yellow/20'
                      : 'text-white/90 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-solar-yellow' : 'text-white/50 group-hover:text-solar-yellow/60'}`} />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{item.name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-solar-yellow shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>


        </div>
      </aside>
    </>
  );
};

export default Sidebar;
