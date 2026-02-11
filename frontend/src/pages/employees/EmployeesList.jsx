import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Users,
    Briefcase,
    ShieldCheck,
    Activity,
    ArrowUpDown,
    MoreHorizontal,
    Mail,
    Phone,
    UserCheck,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    MapPin
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

import EmployeeService from '../../services/EmployeeService';
import { useToast } from '../../hooks/useToast';

function EmployeesList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        surveyors: 0,
        installers: 0,
        activeTeams: 0
    });
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await EmployeeService.getAllEmployees();

            setEmployees(data);

            // Calculate stats
            const surveyors = data.filter(e => e.designation?.toLowerCase().includes('survey')).length;
            const installers = data.filter(e => e.designation?.toLowerCase().includes('install')).length;
            const teams = new Set(data.map(e => e.teamName).filter(Boolean)).size;

            setStats({
                totalEmployees: data.length,
                surveyors,
                installers,
                activeTeams: teams
            });
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            addToast("Failed to load employees", "error");
        } finally {
            setLoading(false);
        }
    };

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!employeeToDelete) return;

        try {
            await EmployeeService.deleteEmployee(employeeToDelete.id);
            addToast(`Employee ${employeeToDelete.name} deleted successfully`, "success");

            // Refresh list
            fetchData();
        } catch (error) {
            console.error("Failed to delete employee:", error);
            addToast("Failed to delete Employee", "error");
        } finally {
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        }
    };

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
                        <span>{row.original.phone || 'N/A'}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "designation",
            header: "Designation",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-medium text-white">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    {row.getValue("designation") || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "teamName",
            header: "Team",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-white/70">
                    <Users className="w-4 h-4 text-white/30" />
                    <span className="text-sm">{row.getValue("teamName") || 'Unassigned'}</span>
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const employee = row.original
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
                            <DropdownMenuItem onClick={() => navigate('/employees/create', { state: { employeeId: employee.id } })}>
                                Edit Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(employee)} className="text-red-400">
                                Delete Employee
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

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
                                Workforce Management
                            </motion.span>
                            <h1 className="text-4xl md:text-6xl font-black uppercase rim-light tracking-tighter">
                                Our <span className="text-solar-yellow">Employees</span>
                            </h1>
                        </div>

                        {/* <Button
                            onClick={() => navigate('/employees/create')}
                            variant="default"
                            size="lg"
                            className="hover:scale-105 transition-transform font-black px-8 py-6 rounded-full text-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center gap-3"
                        >
                            <Plus className="w-5 h-5" />
                            ADD EMPLOYEE
                        </Button> */}
                        <Button
                            onClick={() => navigate('/employees/create')}
                            className="bg-solar-yellow text-deep-navy font-bold hover:bg-gold flex items-center gap-2 px-6"
                        >
                            <Plus className="w-5 h-5" /> New Employee
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
                        { label: 'Total Employees', value: stats.totalEmployees, icon: Users },
                        { label: 'Surveyors', value: stats.surveyors, icon: MapPin },
                        { label: 'Installers', value: stats.installers, icon: Briefcase },
                        { label: 'Active Teams', value: stats.activeTeams, icon: ShieldCheck },
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
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solar-yellow"></div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={employees}
                            searchKey="name"
                        />
                    )}
                </motion.div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {deleteDialogOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass rounded-2xl p-6 max-w-md w-full border border-red-500/30"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-wider text-lg">Delete Employee</h3>
                                    <p className="text-xs text-white/40">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-white/70 mb-6">
                                Are you sure you want to delete <span className="font-bold text-solar-yellow">{employeeToDelete?.name}</span>?
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setDeleteDialogOpen(false)}
                                    variant="ghost"
                                    className="flex-1 px-4 py-3 text-white/60 hover:text-white border border-white/10 rounded-xl transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EmployeesList;