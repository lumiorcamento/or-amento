import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService, buyerService } from '@/services';
import { isSupabaseConfigured } from './supabase';
import { DEMO_BUYERS } from './buyerData';

const BuyerContext = createContext(null);

export function BuyerProvider({ children }) {
    const [buyer, setBuyer] = useState(null);
    const [buyerProfile, setBuyerProfile] = useState(null);
    const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);
    const [isBuyerAuthenticated, setIsBuyerAuthenticated] = useState(false);
    const loadingRef = useRef(false);

    const loadBuyerData = useCallback(async (authUser) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setIsLoadingBuyer(true);
        
        try {
            if (!authUser) {
                setBuyer(null);
                setBuyerProfile(null);
                setIsBuyerAuthenticated(false);
                return;
            }

            const bUser = await buyerService.getOrCreateBuyerProfile({
                userId: authUser.id,
                name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
                email: authUser.email || '',
                phone: authUser.user_metadata?.phone || ''
            });
            
            setBuyer(bUser);
            setIsBuyerAuthenticated(true);
        } catch (err) {
            console.error("[BuyerContext] Error loading buyer data:", err);
            // Even on error, we mark as not authenticated but stop loading
            setIsBuyerAuthenticated(false);
        } finally {
            setIsLoadingBuyer(false);
            loadingRef.current = false;
        }
    }, []);

    const refreshBuyerProfile = useCallback(async (storeId) => {
        if (!buyer || !storeId || !isSupabaseConfigured()) return;
        
        try {
            const profile = await buyerService.getBuyerStoreProfile({
                storeId,
                buyerUserId: buyer.id
            });
            setBuyerProfile(profile);
        } catch (err) {
            console.error("[BuyerContext] Error refreshing buyer profile:", err);
        }
    }, [buyer]);

    // Initial load and subscription
    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setBuyer(DEMO_BUYERS[0]);
            setIsBuyerAuthenticated(true);
            setIsLoadingBuyer(false);
            return;
        }

        let mounted = true;

        const checkAuth = async () => {
            try {
                const session = await authService.getCurrentSession();
                if (!mounted) return;

                if (session?.user) {
                    await loadBuyerData(session.user);
                } else {
                    setBuyer(null);
                    setBuyerProfile(null);
                    setIsBuyerAuthenticated(false);
                    setIsLoadingBuyer(false);
                }
            } catch (err) {
                console.error("[BuyerContext] Auth check failed:", err);
                if (mounted) setIsLoadingBuyer(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            
            if (session?.user) {
                await loadBuyerData(session.user);
            } else {
                setBuyer(null);
                setBuyerProfile(null);
                setIsBuyerAuthenticated(false);
                setIsLoadingBuyer(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [loadBuyerData]);

    const signIn = async (email, password) => {
        return await authService.signInBuyer({ email, password });
    };

    const signUp = async (data) => {
        return await authService.signUpBuyer(data);
    };

    const signOut = async () => {
        if (isSupabaseConfigured()) {
            await authService.signOutBuyer();
        } else {
            setBuyer(null);
            setIsBuyerAuthenticated(false);
        }
    };

    return (
        <BuyerContext.Provider value={{ 
            buyer, 
            buyerProfile, 
            isBuyerAuthenticated, 
            isLoadingBuyer, 
            signIn, 
            signUp, 
            signOut,
            refreshBuyerProfile 
        }}>
            {children}
        </BuyerContext.Provider>
    );
}

export function useBuyer() {
    const context = useContext(BuyerContext);
    if (!context) {
        throw new Error('useBuyer must be used within a BuyerProvider');
    }
    return context;
}