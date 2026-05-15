import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '@/services/storeService';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const { storeSlug } = useParams();
    const [store, setStore] = useState(null);
    const [isLoadingStore, setIsLoadingStore] = useState(true);
    const [storeError, setStoreError] = useState(null);
    const loadingRef = useRef(null);

    useEffect(() => {
        // Prevent re-loading the same slug if already loading or loaded
        if (loadingRef.current === storeSlug) return;

        async function loadStore() {
            if (!storeSlug) {
                console.warn("[StoreContext] No store slug provided");
                setIsLoadingStore(false);
                return;
            }

            try {
                loadingRef.current = storeSlug;
                setIsLoadingStore(true);
                setStoreError(null);
                
                const data = await storeService.getStoreBySlug(storeSlug);
                
                if (!data) {
                    console.error(`[StoreContext] Store not found: ${storeSlug}`);
                    setStoreError('Loja não encontrada');
                    setStore(null);
                } else {
                    setStore(data);
                }
            } catch (err) {
                console.error(`[StoreContext] Error loading store (${storeSlug}):`, err);
                setStoreError('Erro ao carregar os dados da loja');
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
