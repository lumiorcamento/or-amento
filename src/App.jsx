import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { BuyerProvider } from '@/lib/BuyerContext';
import { StoreProvider } from '@/lib/StoreContext';

// Public customer-facing pages (NO sidebar)
import QuoteAssistant from '@/pages/QuoteAssistant';
import BuyerHistory from '@/pages/BuyerHistory';
import BuyerPreferences from '@/pages/BuyerPreferences';
import BuyerLogin from '@/pages/BuyerLogin';

// Store admin layout + pages (WITH sidebar)
import StoreLayout from '@/components/layout/StoreLayout';
import StoreRequests from '@/pages/store/StoreRequests';
import StoreProducts from '@/pages/store/StoreProducts';
import StoreConfig from '@/pages/store/StoreConfig';
import StoreConnect from '@/pages/store/StoreConnect';
import StoreResults from '@/pages/store/StoreResults';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-700 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (authError) {
        if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
        if (authError.type === 'auth_required') { navigateToLogin(); return null; }
    }

    return (
        <Routes>
            {/* Redirect root to demo store */}
            <Route path="/" element={<Navigate to="/s/loja-demonstracao/orcamento" replace />} />
            
            {/* Legacy redirects */}
            <Route path="/historico" element={<Navigate to="/s/loja-demonstracao/historico" replace />} />
            <Route path="/preferencias" element={<Navigate to="/s/loja-demonstracao/preferencias" replace />} />

            {/* CUSTOMER ROUTES with Store Context */}
            <Route path="/s/:storeSlug" element={<StoreProvider><Outlet /></StoreProvider>}>
                <Route path="orcamento" element={<QuoteAssistant />} />
                <Route path="login" element={<BuyerLogin />} />
                <Route path="historico" element={<BuyerHistory />} />
                <Route path="preferencias" element={<BuyerPreferences />} />
                <Route index element={<Navigate to="orcamento" replace />} />
            </Route>

            {/* PRIVATE: Store admin panel - with sidebar (Still using Base44 Auth for now) */}
            <Route element={<StoreLayout />}>
                <Route path="/lojista" element={<StoreRequests />} />
                <Route path="/lojista/solicitacoes" element={<StoreRequests />} />
                <Route path="/lojista/produtos" element={<StoreProducts />} />
                <Route path="/lojista/configurar" element={<StoreConfig />} />
                <Route path="/lojista/conectar" element={<StoreConnect />} />
                <Route path="/lojista/resultados" element={<StoreResults />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <BuyerProvider>
                    <Router>
                        <AuthenticatedApp />
                    </Router>
                    <Toaster />
                </BuyerProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}

export default App;