import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Sun, 
  Zap, 
  Battery, 
  Activity,
  ArrowUpDown,
  MoreHorizontal,
  MapPin,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

import { MOCK_PLANTS as mockPlants } from '../../data/mockData';

export const columns = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
        <img 
          src={row.getValue("image")} 
          alt={row.getValue("name")} 
          className="w-full h-full object-cover"
        />
      </div>
    ),
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
    cell: ({ row }) => <div className="font-bold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-white/70">
        <MapPin className="w-4 h-4" />
        <span>{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => <div className="font-medium text-solar-yellow">{row.getValue("capacity")}</div>,
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
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {status}
            </span>
        )
    },
  },
  {
    accessorKey: "generation",
    header: "Generation (Today)",
    cell: ({ row }) => <div>{row.getValue("generation")}</div>,
  },
  {
    accessorKey: "efficiency",
    header: "Efficiency",
    cell: ({ row }) => {
        const efficiency = row.getValue("efficiency");
        return (
            <div className="w-[120px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-solar-yellow">{efficiency}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${efficiency}%` }}
                    className="h-full bg-linear-to-r from-solar-yellow to-solar-gold rounded-full transition-all duration-500"
                  />
                </div>
            </div>
        )
    }
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
      const plant = row.original

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
              onClick={() => navigate(`/plant-admin/create`)}
            >
              Create Plant Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(plant.id)}
            >
              Copy Plant ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/grid-plant/${plant.id}/payments`)}
            >
                Manage Payments
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Plant</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function PlantList() {
  const navigate = useNavigate();

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
                Power Infrastructure
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-black uppercase rim-light tracking-tighter">
                Your <span className="text-solar-yellow">Plants</span>
              </h1>
            </div>
            
            <Button 
              onClick={() => navigate('/grid-plant/create')}
              variant="default"
              size="lg"
              className="hover:scale-105 transition-transform font-black px-8 py-6 rounded-full text-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              ADD GRID PLANT
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
            { label: 'Total Plants', value: '3', icon: Sun },
            { label: 'Total Capacity', value: '85 kW', icon: Zap },
            { label: 'Today\'s Generation', value: '256 kWh', icon: Activity },
            { label: 'Avg Efficiency', value: '92.8%', icon: Battery },
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
                data={mockPlants} 
                searchKey="name"
                renderSubComponent={({ row }) => (
                    <div className="p-4 bg-black/20 rounded-lg m-2 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-white/40 uppercase">Installation Date</p>
                            <p className="font-semibold">{row.original.details.installationDate}</p>
                        </div>
                         <div>
                            <p className="text-xs text-white/40 uppercase">Panel Type</p>
                            <p className="font-semibold">{row.original.details.panelType}</p>
                        </div>
                         <div>
                            <p className="text-xs text-white/40 uppercase">Inverter Model</p>
                            <p className="font-semibold">{row.original.details.inverterModel}</p>
                        </div>
                         <div>
                            <p className="text-xs text-white/40 uppercase">Last Maintenance</p>
                            <p className="font-semibold">{row.original.details.lastMaintenance}</p>
                        </div>
                    </div>
                )}
            />
        </motion.div>

      </div>
    </div>
  );
}

export default PlantList;