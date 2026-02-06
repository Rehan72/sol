import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  Map,
  Activity,
  ArrowUpDown,
  MoreHorizontal,
  MapPin,
  ShieldCheck,
  Briefcase
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

// Mock data for survey teams
const mockTeams = [
  {
    id: 1,
    teamName: 'Survey Squad A',
    teamLead: 'Alice Springer',
    membersCount: 3,
    status: 'active',
    assignedPlant: 'Sector 45 Residence',
    type: 'Survey',
    contact: 'alice@example.com'
  },
  {
    id: 2,
    teamName: 'Rapid Assessors',
    teamLead: 'Bob Martin',
    membersCount: 2,
    status: 'inactive',
    assignedPlant: 'Industrial Hub Alpha',
    type: 'Survey',
    contact: 'bob@example.com'
  },
];

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
    accessorKey: "teamName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Map className="w-5 h-5 text-solar-yellow" />
             </div>
             <div className="font-bold">{row.getValue("teamName")}</div>
        </div>
    ),
  },
  {
    accessorKey: "teamLead",
    header: "Team Lead",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-white/90 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>{row.getValue("teamLead")}</span>
      </div>
    ),
  },
  {
    accessorKey: "membersCount",
    header: "Members",
    cell: ({ row }) => <div className="font-medium pl-4">{row.getValue("membersCount")}</div>,
  },
  {
    accessorKey: "assignedPlant",
    header: "Assigned Grid Plant",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-white/70">
        <Briefcase className="w-4 h-4" />
        <span>{row.getValue("assignedPlant")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status");
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
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
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;
      const navigate = useNavigate();

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
              onClick={() => navigate(`/survey-teams/${team.id}`)}
            >
              View Team Details
            </DropdownMenuItem>
             <DropdownMenuItem
              onClick={() => navigate(`/survey-teams/${team.id}`)}
            >
              Edit Team
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400 focus:text-red-400">
               Deactivate Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function SurveyTeamList() {
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
                Feasibility & Planning
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-black uppercase rim-light tracking-tighter">
                Survey <span className="text-solar-yellow">Teams</span>
              </h1>
            </div>
            
            <Button 
              onClick={() => navigate('/survey-teams/create')}
              variant="default"
              size="lg"
              className="bg-solar-yellow hover:bg-white text-deep-navy hover:scale-105 transition-transform font-black px-8 py-6 rounded-full text-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              CREATE SURVEY TEAM
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
            { label: 'Total Surveyors', value: '8', icon: Users },
            { label: 'Pending Surveys', value: '12', icon: Activity },
            { label: 'Sites Completed', value: '45', icon: MapPin },
            { label: 'Active Teams', value: '3', icon: ShieldCheck },
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
                data={mockTeams} 
                searchKey="teamName"
            />
        </motion.div>

      </div>
    </div>
  );
}

export default SurveyTeamList;
