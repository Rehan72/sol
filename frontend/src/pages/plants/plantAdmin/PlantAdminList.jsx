import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Mail,
  Shield,
  User
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/shared/data-table';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

// Mock Data
const MOCK_ADMINS = [
  {
    id: 'admin-1',
    fullName: 'Robert Fox',
    email: 'robert.fox@solar.com',
    mobile: '+91 98765 43210',
    role: 'PLANT_ADMIN',
    status: 'active',
    assignedPlant: {
        name: 'Sector 45 Residence',
        code: 'SOL-2024-001'
    }
  },
  {
    id: 'admin-2',
    fullName: 'Arlene McCoy',
    email: 'arlene.mccoy@solar.com',
    mobile: '+91 98765 12345',
    role: 'PLANT_ADMIN',
    status: 'inactive',
    assignedPlant: {
        name: 'Industrial Hub Alpha',
        code: 'SOL-2024-002'
    }
  }
];



function PlantAdminList() {
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
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Administrator
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-white/70" />
            </div>
            <div>
                <p className="font-bold text-white">{row.getValue("fullName")}</p>
                <p className="text-xs text-white/40">{row.original.id}</p>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "assignedPlant",
    header: "Assigned Plant",
    cell: ({ row }) => {
        const plant = row.original.assignedPlant;
        return (
            <div>
                 <p className="font-medium text-solar-yellow flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    {plant.name}
                </p>
                 <p className="text-xs text-white/40">{plant.code}</p>
            </div>
        )
    },
  },
  {
    accessorKey: "contact",
    header: "Contact Details",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <Mail className="w-3 h-3 text-solar-yellow/70" />
          <span>{row.original.email}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <Phone className="w-3 h-3 text-solar-yellow/70" />
          <span>{row.original.mobile}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status");
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-wider flex w-fit items-center gap-1 ${
                status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {status}
            </span>
        )
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
              onClick={() => navigate(`/installation-teams/create`)}
            >
              Add Teams
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(admin.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">Deactivate User</DropdownMenuItem>
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
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #000033 0%, #001f3f 40%, #003366 80%, #001f3f 100%)' }} />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solar-yellow/5 blur-[150px] rounded-full pointer-events-none" />

       <div className="relative z-10 px-6 md:px-12 py-8">
           {/* Header */}
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
                    Team Management
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-black uppercase rim-light tracking-tighter">
                    Plant <span className="text-solar-yellow">Admins</span>
                </h1>
                </div>
                
                <Button 
                onClick={() => navigate('/plant-admin/create')}
                variant="default"
                size="lg"
                className="hover:scale-105 transition-transform font-black px-8 py-6 rounded-full text-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-3"
                >
                <Plus className="w-5 h-5" />
                Add Plant Admin
                </Button>
            </div>
            </motion.div>

             {/* Data Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="glass rounded-2xl p-6"
            >
                <DataTable 
                    columns={columns} 
                    data={MOCK_ADMINS} 
                    searchKey="fullName"
                />
            </motion.div>
       </div>
    </div>
  )
}

export default PlantAdminList