import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, buyerService } from '@/services';
import { isSupabaseConfigured } from './supabase';
import { DEMO_BUYERS } from './buyerData';

const BuyerContext = createContext(null);

export function BuyerProvider({ children }) {
    const [buyer, setBuyer] = useState(null);
    const [buyerProfile, setBuyerProfile] = useState(null);
    const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);
    const [isBuyerAuthenticated, setIsBuyerAuthenticated] = useState(false);

    // Initial load
    useEffect(() => {
        if (!isSupabaseConfigured()) {
            // Demo mode
            setBuyer(DEMO_BUYERS[0]);
            setIsBuyerAuthenticated(true);
            setIsLoadingBuyer(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const session = await authService.getCurrentSession();
                if (session?.user) {
                    await loadBuyerData(session.user);
                } else {
                    setBuyer(null);
                    setBuyerProfile(null);
                    setIsBuyerAuthenticated(false);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setIsLoadingBuyer(false);
            }
        };

        checkAuth();

        // Listen for changes
        const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await loadBuyerData(session.user);
            } else {
                setBuyer(null);
                setBuyerProfile(null);
                setIsBuyerAuthenticated(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function loadBuyerData(authUser) {
        setIsLoadingBuyer(true);
        try {
            const bUser = await buyerService.getOrCreateBuyerProfile({
                userId: authUser.id,
                name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
                email: authUser.email,
                phone: authUser.user_metadata?.phone || ''
            });
            setBuyer(bUser);
            setIsBuyerAuthenticated(true);
        } catch (err) {
            console.error("Error loading buyer data:", err);
        } finally {
            setIsLoadingBuyer(false);
        }
    }

    async function refreshBuyerProfile(storeId) {
        if (!buyer || !storeId || !isSupabaseConfigured()) return;
        
        try {
            const profile = await buyerService.getBuyerStoreProfile({
                storeId,
                buyerUserId: buyer.id
            });
            setBuyerProfile(profile);
        } catch (err) {
            console.error("Error refreshing buyer profile:", err);
        }
    }

    async function signIn(email, password) {
        return await authService.signInBuyer({ email, password });
    }

    async function signUp(data) {
        return await authService.signUpBuyer(data);
    }

    async function signOut() {
        if (isSupabaseConfigured()) {
            await authService.signOutBuyer();
        } else {
            setBuyer(null);
            setIsBuyerAuthenticated(false);
        }
    }

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