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
  FileText,
  Wallet,
  MessageSquare,
  Calculator,
  Package,
  BarChart3,
  Crown,
  Box,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { role } = useAuthStore();

  const categories = [
    { id: 'overview', name: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'operations', name: 'OPERATIONS', icon: Activity },
    { id: 'commercial', name: 'COMMERCIAL', icon: Wallet },
    { id: 'system', name: 'SYSTEM', icon: Settings },
  ];

  const menuItems = [
    // Overview
    { category: 'overview', name: 'DASHBOARD', icon: LayoutDashboard, path: '/dashboard', allowedRoles: ['SUPER_ADMIN'] },
    { category: 'overview', name: 'DASHBOARD', icon: LayoutDashboard, path: '/employee-dashboard', allowedRoles: ['EMPLOYEE'] },
    { category: 'overview', name: 'DASHBOARD', icon: LayoutDashboard, path: '/plant-admin-dashboard', allowedRoles: ['PLANT_ADMIN'] },
    { category: 'overview', name: 'DASHBOARD', icon: LayoutDashboard, path: '/customer/dashboard', allowedRoles: ['CUSTOMER'] },
    { category: 'overview', name: 'DASHBOARD', icon: LayoutDashboard, path: '/region-admin-dashboard', allowedRoles: ['REGION_ADMIN'] },
    { category: 'overview', name: 'NOTIFICATIONS', icon: Bell, path: '/notifications', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'EMPLOYEE', 'CUSTOMER', 'INSTALLATION_TEAM', 'SURVEY_TEAM', 'MAINTENANCE_TEAM'] },
    { category: 'overview', name: 'ANALYTICS', icon: BarChart3, path: '/analytics', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },

    // Operations
    { category: 'operations', name: 'REGION ADMIN', icon: Map, path: '/region-admin', allowedRoles: ['SUPER_ADMIN'] },
    { category: 'operations', name: 'GRID PLANT', icon: BugPlay, path: '/grid-plant', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { category: 'operations', name: 'PLANT ADMIN', icon: Users, path: '/plant-admin', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { category: 'operations', name: 'EMPLOYEES', icon: Users, path: '/employees', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { category: 'operations', name: 'SURVEY TEAMS', icon: Map, path: '/survey-teams', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
   
    { category: 'operations', name: 'INSTALLATION', icon: Users, path: '/installation-teams', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { category: 'operations', name: 'MAINTENANCE', icon: Users, path: '/maintenance-teams', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { category: 'operations', name: 'WORKFLOW', icon: ClipboardCheck, path: '/installation-workflow', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'INSTALLATION_TEAM', 'EMPLOYEE'] },
    { category: 'operations', name: 'SOLAR REQUESTS', icon: Sun, path: '/admin/leads', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { category: 'operations', name: 'LIVE MONITOR', icon: Activity, path: '/monitoring/demo', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'CUSTOMER'] },
    { category: 'operations', name: 'DIGITAL TWIN', icon: Box, path: '/digital-twin/demo', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'CUSTOMER'] },
    { category: 'operations', name: 'INVENTORY', icon: Package, path: '/inventory', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },

    // Commercial
    { category: 'commercial', name: 'COST ESTIMATION', icon: Calculator, path: '/cost-estimation', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'EMPLOYEE'] },
    { category: 'commercial', name: 'CUSTOMER', icon: Users, path: '/customer', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN'] },
    { category: 'commercial', name: 'SERVICE TICKETS', icon: MessageSquare, path: '/admin/service', allowedRoles: ['SUPER_ADMIN', 'PLANT_ADMIN'] },
    { category: 'commercial', name: 'PAYMENTS', icon: Wallet, path: '/customer/payments', allowedRoles: ['CUSTOMER'] },
    { category: 'commercial', name: 'SERVICE TICKETS', icon: MessageSquare, path: '/customer/tickets', allowedRoles: ['CUSTOMER'] },
    { category: 'commercial', name: 'PRICING RULES', icon: Calculator, path: '/pricing', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { category: 'commercial', name: 'SUBSCRIPTIONS', icon: Crown, path: '/subscription/plans', allowedRoles: ['SUPER_ADMIN'] },
    { category: 'commercial', name: 'NEW SURVEY', icon: FileText, path: '/surveys/create', allowedRoles: ['SURVEY_TEAM', 'SUPER_ADMIN', 'REGION_ADMIN', 'PLANT_ADMIN', 'EMPLOYEE'] },

    // System
   
    { category: 'system', name: 'COMPLIANCE', icon: ShieldAlert, path: '/compliance', allowedRoles: ['SUPER_ADMIN', 'REGION_ADMIN'] },
    { category: 'system', name: 'ONBOARDING', icon: ClipboardCheck, path: '/customer/setup', allowedRoles: ['CUSTOMER'] },
    { category: 'system', name: 'SETTINGS', icon: Settings, path: '/settings', allowedRoles: ['SUPER_ADMIN', 'EMPLOYEE'] },

    //Customer
    // { category: 'customer', name: 'DASHBOARD', icon: LayoutDashboard, path: '/customer/dashboard', allowedRoles: ['CUSTOMER'] },
    // { category: 'customer', name: 'PAYMENTS', icon: Wallet, path: '/customer/payments', allowedRoles: ['CUSTOMER'] },
    // { category: 'customer', name: 'SERVICE TICKETS', icon: MessageSquare, path: '/customer/tickets', allowedRoles: ['CUSTOMER'] },
    // { category: 'customer', name: 'ONBOARDING', icon: ClipboardCheck, path: '/customer/setup', allowedRoles: ['CUSTOMER'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!role) return true;
    return item.allowedRoles.includes(role);
  });

  // Determine active category based on current path
  const currentPathItem = filteredMenuItems.find(item =>
    location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/')
  );

  const [activeCategoryId, setActiveCategoryId] = React.useState(
    currentPathItem?.category || categories[0].id
  );

  // Sync active category with location changes ONLY when path changes
  const prevPathRef = React.useRef(location.pathname);
  React.useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      if (currentPathItem) {
        setActiveCategoryId(currentPathItem.category);
      }
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, currentPathItem]);

  const activeCategoryItems = filteredMenuItems.filter(item => item.category === activeCategoryId);

  return (
    <>
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
        className={`fixed left-0 top-[73px] z-50 h-[calc(100vh-73px)] flex w-72 glass border-r border-white/10 duration-500 ease-[0.22,1,0.36,1] lg:static lg:h-auto lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Category Icons Rail (Left) */}
        <div className="w-[72px] flex flex-col items-center py-6 border-r border-white/5 bg-black/20 relative z-20">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategoryId(cat.id);
                }}
                className={`relative w-full flex flex-col items-center py-4 transition-all duration-300 group cursor-pointer ${isActive ? 'text-solar-yellow' : 'text-gray-300 hover:text-white'}`}
              >
                <cat.icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'} transition-transform`} />
                <span className={`text-[9px] font-black tracking-tighter uppercase transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {cat.name}
                </span>

                {isActive && (
                  <>
                    <motion.div
                      layoutId="category-bg"
                      className="absolute inset-x-2 inset-y-2 bg-solar-yellow/5 rounded-xl -z-10"
                    />
                    <motion.div
                      layoutId="category-indicator"
                      className="absolute -left-px top-1/2 -translate-y-1/2 w-[2px] h-8 bg-solar-yellow rounded-r-full shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                    />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-menu Panel (Right) */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 relative z-10">
          <div className="absolute top-0 left-0 w-full h-32 bg-radial-gradient from-solar-yellow/5 to-transparent pointer-events-none" />

          <div className="mb-2">
            <h3 className="text-[10px] font-black tracking-[0.5em] text-solar-yellow uppercase px-4 mb-6">
              {categories.find(c => c.id === activeCategoryId)?.name}
            </h3>

            <nav className="space-y-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategoryId}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeCategoryItems.map((item) => {
                    const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
                    return (
                      <Link
                        key={item.name + item.path}
                        to={item.path}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${isActive
                          ? 'bg-white/5 text-solar-yellow border border-white/10 ring-1 ring-white/5'
                          : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
                          }`}
                      >
                        <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-solar-yellow' : 'text-gray-400 group-hover:text-solar-yellow/80'}`} />
                        <span className="text-[10px] font-bold tracking-widest uppercase truncate">{item.name}</span>

                        {isActive && (
                          <motion.div
                            layoutId="active-dot"
                            className="ml-auto w-1 h-1 rounded-full bg-solar-yellow"
                          />
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
