import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '@/services/storeService';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const { storeSlug } = useParams();
    const [store, setStore] = useState(null);
    const [isLoadingStore, setIsLoadingStore] = useState(true);
    const [storeError, setStoreError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadStore() {
            if (!storeSlug) {
                // If no slug, we might be at "/" - redirection handled in App.jsx
                setIsLoadingStore(false);
                return;
            }

            try {
                setIsLoadingStore(true);
                const data = await storeService.getStoreBySlug(storeSlug);
                
                if (!data) {
                    setStoreError('Loja não encontrada');
                } else {
                    setStore(data);
                }
            } catch (err) {
                console.error("Error loading store:", err);
                setStoreError('Erro ao carregar loja');
            } finally {
                setIsLoadingStore(false);
            }
        }

        loadStore();
    }, [storeSlug]);

    return (
        <StoreContext.Provider value={{ store, isLoadingStore, storeError, storeSlug }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
