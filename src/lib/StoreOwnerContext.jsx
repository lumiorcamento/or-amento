import React, { createContext, useState, useContext, useEffect } from 'react';
import { storeOwnerAuthService } from '@/services';
import { isSupabaseConfigured } from '@/lib/supabase';

const StoreOwnerContext = createContext();

export const StoreOwnerProvider = ({ children }) => {
    const [storeOwner, setStoreOwner] = useState(null);
    const [currentStore, setCurrentStore] = useState(null);
    const [availableStores, setAvailableStores] = useState([]);
    const [isLoadingStoreOwner, setIsLoadingStoreOwner] = useState(true);
    const [isStoreOwnerAuthenticated, setIsStoreOwnerAuthenticated] = useState(false);

    useEffect(() => {
        loadOwner();
        
        const unsubscribe = storeOwnerAuthService.onStoreOwnerAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                loadOwner();
            } else if (event === 'SIGNED_OUT') {
                setStoreOwner(null);
                setCurrentStore(null);
                setAvailableStores([]);
                setIsStoreOwnerAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadOwner = async () => {
        setIsLoadingStoreOwner(true);
        try {
            const data = await storeOwnerAuthService.getCurrentStoreOwner();
            if (data) {
                setStoreOwner(data.user);
                setAvailableStores(data.ownerRecords.map(r => r.stores));
                setCurrentStore(data.primaryStore);
                setIsStoreOwnerAuthenticated(true);
            } else {
                setStoreOwner(null);
                setCurrentStore(null);
                setAvailableStores([]);
                setIsStoreOwnerAuthenticated(false);
            }
        } catch (error) {
            console.error('Error loading store owner:', error);
        } finally {
            setIsLoadingStoreOwner(false);
        }
    };

    const signIn = async ({ email, password }) => {
        const data = await storeOwnerAuthService.signInStoreOwner({ email, password });
        if (data) {
            setStoreOwner(data.user);
            // In demo mode or if just signed in, we might need to refresh
            await loadOwner();
            return data;
        }
    };

    const signOut = async () => {
        await storeOwnerAuthService.signOutStoreOwner();
        setStoreOwner(null);
        setCurrentStore(null);
        setAvailableStores([]);
        setIsStoreOwnerAuthenticated(false);
    };

    const selectStore = (storeId) => {
        const store = availableStores.find(s => s.id === storeId);
        if (store) {
            setCurrentStore(store);
        }
    };

    return (
        <StoreOwnerContext.Provider value={{
            storeOwner,
            currentStore,
            availableStores,
            isStoreOwnerAuthenticated,
            isLoadingStoreOwner,
            signIn,
            signOut,
            refreshStoreOwner: loadOwner,
            selectStore
        }}>
            {children}
        </StoreOwnerContext.Provider>
    );
};

export const useStoreOwner = () => {
    const context = useContext(StoreOwnerContext);
    if (!context) {
        throw new Error('useStoreOwner must be used within a StoreOwnerProvider');
    }
    return context;
};
