import React, { createContext, useContext, useEffect, useState } from 'react';
import loadingState from '../api/loadingState';

const LoadingContext = createContext({ loading: false });

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(loadingState.isLoading());

    useEffect(() => {
        // Subscribe to global loading state changes
        const unsubscribe = loadingState.subscribe((state) => {
            setLoading(state);
        });

        return () => unsubscribe();
    }, []);

    return (
        <LoadingContext.Provider value={{ loading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
