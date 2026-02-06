import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Activity,
  ArrowUpDown,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/shared/data-table';
import { Checkbox } from '../../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

import { MOCK_REGION_ADMINS as mockAdmins } from '../../data/mockData';



function RegionAdminList() {
  const navigate = useNavigate();

  const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-bold text-white">{row.getValue("name")}</span>
            <span className="text-xs text-white/40">{row.original.id}</span>
        </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-xs text-white/70">
        <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-solar-yellow" />
            <span>{row.getValue("email")}</span>
        </div>
        <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-solar-yellow" />
            <span>{row.original.mobile}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-white">
            <Building2 className="w-3 h-3 text-emerald-400" />
            {row.getValue("region")}
        </div>
        <span className="text-xs text-white/40">{row.original.code}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
        <div className="flex items-center gap-2 text-white/70">
          <MapPin className="w-4 h-4 text-white/30" />
          <span className="text-sm">{row.getValue("location")}</span>
        </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status");
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {status}
            </span>
        )
    },
  },
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
            variant="ghost"
            onClick={row.getToggleExpandedHandler()}
            className="h-8 w-8 p-0"
        >
            {row.getIsExpanded() ? (
                <ChevronUp className="h-4 w-4" />
            ) : (
                <ChevronDown className="h-4 w-4" />
            )}
        </Button>
      ) : null
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const admin = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            onClick={() => navigate('/grid-plant/create', { state: { adminId: admin.id } })}
            >Add Grid Plant</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(admin.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Admin</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
  return (
    <div className="relative min-h-screen bg-deep-navy text-white overflow-hidden">
      {/* Cinematic Overlays */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />

      {/* Background Gradient */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)'
        }}
      />

      {/* Volumetric Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 py-8">
        {/* Header Section */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-solar-yellow font-black tracking-widest uppercase text-xs mb-4 block"
                    >
                        Access Management
                    </motion.span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase rim-light tracking-tighter">
                        Region <span className="text-solar-yellow">Admins</span>
                    </h1>
                </div>
                
                <Button 
                    onClick={() => navigate('/region-admin/create')}    
                    variant="default"
                    size="lg"
                    className="hover:scale-105 transition-transform font-black px-8 py-6 rounded-full text-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    ADD REGION ADMIN
                </Button>
            </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
            {[
                { label: 'Total Admins', value: '3', icon: Users },
                { label: 'Active Regions', value: '3', icon: MapPin },
                { label: 'Total Utilities', value: '3', icon: Building2 },
                { label: 'System Status', value: 'Healthy', icon: Activity },
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass p-6 rounded-2xl group hover:border-solar-yellow/30 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-solar-yellow/10 rounded-xl flex items-center justify-center group-hover:bg-solar-yellow/20 transition-colors">
                            <stat.icon className="w-6 h-6 text-solar-yellow" />
                        </div>
                        <div>
                            <p className="text-sm text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>

        {/* Data Table Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-6"
        >
            <DataTable 
                columns={columns} 
                data={mockAdmins} 
                searchKey="name"
                renderSubComponent={({ row }) => (
                    <div className="p-4 bg-black/20 rounded-lg m-2 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div>
                            <p className="text-xs text-white/40 uppercase">Joined Date</p>
                            <p className="font-semibold">{row.original.joinedDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 uppercase">Utility Provider</p>
                            <p className="font-semibold">{row.original.utility}</p>
                        </div>
                        <div>
                             <p className="text-xs text-white/40 uppercase">Region Code</p>
                             <p className="font-semibold">{row.original.code}</p>
                        </div>
                        <div>
                             <p className="text-xs text-white/40 uppercase">Access Level</p>
                             <p className="font-semibold flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-solar-yellow" /> Full Access
                             </p>
                        </div>
                    </div>
                )}
            />
        </motion.div>
      </div>
    </div>
  );
}

export default RegionAdminList;