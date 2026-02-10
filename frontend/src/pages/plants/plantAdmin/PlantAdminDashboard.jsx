import React, { useEffect } from 'react'
import loadingState from '../../../api/loadingState'

function PlantAdminDashboard() {
    useEffect(() => {
        // Simulate an API call on mount
        loadingState.start();
        
        const timer = setTimeout(() => {
            loadingState.stop();
        }, 3000); // Loader visible for 3 seconds

        return () => {
            clearTimeout(timer);
            loadingState.stop();
        };
    }, []);

    return (
        <div className='relative min-h-screen bg-deep-navy text-white text-2xl font-bold flex items-center justify-center h-full'>Coming Soon...</div>
    )
}

export default PlantAdminDashboard