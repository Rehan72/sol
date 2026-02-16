import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Info, 
  Trash2,
  Filter,
  X,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import client from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';

const NotificationItem = ({ notification, handleMarkAsRead, getIcon, getBorderColor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group relative overflow-hidden p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer ${
                notification.isRead 
                ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                : `bg-black/40 ${getBorderColor(notification.type)} shadow-lg`
            }`}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-solar-yellow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start gap-6 relative z-10">
                <div className={`p-4 rounded-2xl shadow-inner ${notification.isRead ? 'bg-white/5' : 'bg-black/40 border border-white/10'}`}>
                    {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                        <h3 className={`text-lg font-bold truncate pr-4 ${notification.isRead ? 'text-white/60' : 'text-white group-hover:text-solar-yellow transition-colors'}`}>
                            {notification.title}
                        </h3>
                        <span className="text-[10px] font-bold text-white/30 px-3 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            {new Date(notification.createdAt).toLocaleString(undefined, { 
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                        </span>
                    </div>

                    <motion.div layout>
                        <p className={`text-sm text-white/50 leading-relaxed max-w-3xl transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {notification.message}
                        </p>
                    </motion.div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <button 
                            className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1"
                        >
                            {isExpanded ? (
                                <>Show Less <ChevronUp className="w-3 h-3" /></>
                            ) : (
                                <>Read More <ChevronDown className="w-3 h-3" /></>
                            )}
                        </button>

                        {!notification.isRead && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-solar-yellow hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                            >
                                Mark as Read <Check className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, ALERT, INFO
    const [searchQuery, setSearchQuery] = useState('');
    const { showToast } = useToast();
    const { user } = useAuthStore();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await client.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await client.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            showToast('Marked as read', 'success');
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await client.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            showToast('All marked as read', 'success');
        } catch (error) {
            showToast('Failed to update all', 'error');
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = 
            filter === 'ALL' ? true :
            filter === 'UNREAD' ? !n.isRead :
            filter === 'ALERT' ? n.type === 'ALERT' || n.type === 'WARNING' :
            filter === 'INFO' ? n.type === 'INFO' || n.type === 'SUCCESS' : true;

        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.message.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-solar-yellow" />;
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getBorderColor = (type) => {
        switch (type) {
            case 'ALERT': return 'border-red-500/50';
            case 'WARNING': return 'border-solar-yellow/50';
            case 'SUCCESS': return 'border-emerald-500/50';
            default: return 'border-white/10';
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-1/4 w-96 h-96 bg-solar-yellow/5 rounded-full blur-3xl -z-10 pointer-events-none" />
             <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                        Notification <span className="text-solar-yellow">Hub</span>
                    </h1>
                    <p className="text-white/40 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live System Updates
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-solar-yellow transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH LOGS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-bold tracking-wider text-white placeholder-white/20 focus:outline-none focus:border-solar-yellow/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleMarkAllRead}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all group"
                    >
                        <Check className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60 group-hover:text-white">Mark All Read</span>
                    </button>
                </div>
            </div>

            {/* Glassmorphic Filter Bar */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar p-1">
                {['ALL', 'UNREAD', 'ALERT', 'INFO'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all overflow-hidden ${
                            filter === f 
                            ? 'text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {filter === f && (
                            <motion.div 
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-solar-yellow rounded-xl -z-10"
                            />
                        )}
                        {f}
                    </button>
                ))}
            </div>

            {/* Notifications Grid */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length === 0 && !loading ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Bell className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">All Caught Up</h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">No notifications found in this category</p>
                        </motion.div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <NotificationItem 
                                key={notification.id}
                                notification={notification}
                                handleMarkAsRead={handleMarkAsRead}
                                getIcon={getIcon}
                                getBorderColor={getBorderColor}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
