import React, { useEffect, useRef } from 'react';
import { useToast } from '../../hooks/useToast';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';

const NotificationManager = () => {
    const { showToast } = useToast();
    const { isAuthenticated } = useAuthStore();
    const lastCheckRef = useRef(new Date().toISOString());

    // 1. Request Browser Permissions
    useEffect(() => {
        if (Notification.permission === 'default') {
            const ask = async () => {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('[NotificationManager] Permission granted.');
                }
            };
            setTimeout(ask, 3000);
        }
    }, []);

    // 2. Poll for new notifications
    useEffect(() => {
        if (!isAuthenticated) return;

        const pollNotifications = async () => {
            try {
                // Fetch notifications created after last check
                // In a real app, we'd pass ?since=timestamp to the API
                // For now, we'll fetch all unread and filter on client or show recent
                const res = await client.get('/notifications?unreadOnly=true'); 
                const notifications = res.data;

                // Simple logic: Display unread notifications that are new
                // For this demo, we'll just show the latest unread one to avoid spamming
                const unread = notifications.filter(n => !n.isRead);
                
                if (unread.length > 0) {
                     // Check if we haven't seen this one yet (in a real app, track IDs)
                     const latest = unread[0];
                     // Store ID in session/local storage to avoid re-toasting? 
                     // For demo simplicity, assume the backend logic handles "newness" or we just show it.
                     // A better approach is fetching only *new* ones.
                     
                     // Let's just listen for the 'test-alert' or explicit events for now 
                     // OR rely on the window event for real-time simulation locally.
                }
            } catch (error) {
                // Silent fail on poll error
            }
        };

        // Poll every 30 seconds
        const interval = setInterval(pollNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // 3. Listen for Window Events (Simulating Real-time Push from WebSocket/MQTT)
    useEffect(() => {
        const handlePush = (event) => {
            const { title, body } = event.detail;
            
            // Native browser notification
            if (Notification.permission === 'granted') {
                new Notification(title, { body, icon: '/assets/sun.png' });
            }
            
            // In-app toast
            showToast(`${title}: ${body}`, 'info');
        };

        window.addEventListener('solar-push-notification', handlePush);
        return () => window.removeEventListener('solar-push-notification', handlePush);
    }, [showToast]);

    return null; 
};

export default NotificationManager;
