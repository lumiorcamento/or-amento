import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { Loader2 } from 'lucide-react';

export const StoreOwnerProtectedRoute = () => {
    const { isStoreOwnerAuthenticated, isLoadingStoreOwner } = useStoreOwner();

    if (isLoadingStoreOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
            </div>
        );
    }

    if (!isStoreOwnerAuthenticated) {
        return <Navigate to="/lojista/login" replace />;
    }

    return <Outlet />;
};
