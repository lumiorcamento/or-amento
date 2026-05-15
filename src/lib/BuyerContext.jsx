import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';
import { buyerService } from '../services/buyerService';
import { isSupabaseConfigured } from './supabase';
import { DEMO_BUYERS } from './buyerData';

const BuyerContext = createContext(null);

export function BuyerProvider({ children }) {
    const [buyer, setBuyer] = useState(null);
    const [buyerProfile, setBuyerProfile] = useState(null);
    const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);
    const [isBuyerAuthenticated, setIsBuyerAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const loadingRef = useRef(false);

    const loadBuyerData = useCallback(async (authUser) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        
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
            console.error("[BuyerContext] Critical: Profile load failed", err);
            // We set authenticated to false so the public page can still work
            setIsBuyerAuthenticated(false);
        } finally {
            setIsLoadingBuyer(false);
            setIsInitialized(true);
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
            console.error("[BuyerContext] Profile refresh failed", err);
        }
    }, [buyer]);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setBuyer(DEMO_BUYERS[0]);
            setIsBuyerAuthenticated(true);
            setIsLoadingBuyer(false);
            setIsInitialized(true);
            return;
        }

        let mounted = true;

        const checkInitialSession = async () => {
            try {
                // Get session once
                const session = await authService.getCurrentSession();
                if (!mounted) return;

                if (session?.user) {
                    await loadBuyerData(session.user);
                } else {
                    setIsLoadingBuyer(false);
                    setIsInitialized(true);
                }
            } catch (err) {
                console.error("[BuyerContext] Initial session check failed", err);
                if (mounted) {
                    setIsLoadingBuyer(false);
                    setIsInitialized(true);
                }
            }
        };

        checkInitialSession();

        // Subscription for subsequent changes
        const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            
            if (event === 'SIGNED_IN' && session?.user) {
                await loadBuyerData(session.user);
            } else if (event === 'SIGNED_OUT') {
                setBuyer(null);
                setBuyerProfile(null);
                setIsBuyerAuthenticated(false);
                setIsLoadingBuyer(false);
                setIsInitialized(true);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [loadBuyerData]);

    return (
        <BuyerContext.Provider value={{ 
            buyer, 
            buyerProfile, 
            isBuyerAuthenticated, 
            isLoadingBuyer, 
            isInitialized,
            signIn: async (email, password) => {
                console.log("[BuyerContext] signIn attempt for:", email);
                return await authService.signInBuyer({ email, password });
            }, 
            signUp: async (data) => {
                console.log("[BuyerContext] signUp attempt for:", data?.email);
                return await authService.signUpBuyer(data);
            }, 
            signOut: async () => {
                await authService.signOutBuyer();
                setBuyer(null);
                setIsBuyerAuthenticated(false);
            },
            refreshBuyerProfile 
        }}>
            {children}
        </BuyerContext.Provider>
    );
}

export function useBuyer() {
    const context = useContext(BuyerContext);
    if (!context) throw new Error('useBuyer must be used within a BuyerProvider');
    return context;
}