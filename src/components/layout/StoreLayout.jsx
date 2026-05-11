import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { 
    Inbox, Package, Settings, Plug, BarChart2, 
    Sparkles, Menu, ChevronLeft, LogOut, Store,
    User, ChevronDown
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

const NAV = [
    { label: 'Solicitações', path: '/lojista/solicitacoes', icon: Inbox },
    { label: 'Produtos', path: '/lojista/produtos', icon: Package },
    { label: 'Configurar assistente', path: '/lojista/configurar', icon: Settings },
    { label: 'Conectar loja', path: '/lojista/conectar', icon: Plug },
    { label: 'Resultados', path: '/lojista/resultados', icon: BarChart2 },
];

export default function StoreLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { currentStore, storeOwner, signOut, availableStores, selectStore } = useStoreOwner();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [storeMenuOpen, setStoreMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/lojista/login');
    };

    const activeNav = NAV.find(n => pathname.startsWith(n.path)) || NAV[0];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a1a12] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-white/5`}>
                {/* Store Selector / Header */}
                <div className="px-4 py-6 border-b border-white/5 relative">
                    <button 
                        onClick={() => availableStores.length > 1 && setStoreMenuOpen(!storeMenuOpen)}
                        className="w-full flex items-center gap-3 text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 group-hover:border-green-500/40 transition-colors">
                            {currentStore?.logo_url ? (
                                <img src={currentStore.logo_url} alt={currentStore.name} className="w-full h-full object-contain p-1.5" />
                            ) : (
                                <Store className="w-5 h-5 text-green-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate">{currentStore?.name || 'Carregando...'}</p>
                            <p className="text-green-500/60 text-[10px] font-bold uppercase tracking-wider">Painel da Loja</p>
                        </div>
                        {availableStores.length > 1 && <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${storeMenuOpen ? 'rotate-180' : ''}`} />}
                    </button>

                    {/* Simple Store Switcher Dropdown */}
                    {storeMenuOpen && availableStores.length > 1 && (
                        <div className="absolute top-full left-4 right-4 mt-2 bg-[#1a2f24] border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden">
                            {availableStores.map(s => (
                                <button 
                                    key={s.id}
                                    onClick={() => { selectStore(s.id); setStoreMenuOpen(false); }}
                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${s.id === currentStore?.id ? 'text-green-400 font-bold' : 'text-white/70'}`}
                                >
                                    <Store className="w-3.5 h-3.5" /> {s.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {NAV.map(n => {
                        const active = pathname.startsWith(n.path) || (pathname === '/lojista' && n.path === '/lojista/solicitacoes');
                        return (
                            <Link key={n.path} to={n.path} onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active 
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}>
                                <n.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-white/40'}`} />
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Info */}
                <div className="px-4 py-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white/80 text-xs font-bold truncate">{storeOwner?.email?.split('@')[0] || 'Lojista'}</p>
                            <button onClick={handleSignOut} className="text-red-400/60 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 mt-0.5">
                                <LogOut className="w-3 h-3" /> Sair
                            </button>
                        </div>
                    </div>
                    
                    <Link to={`/s/${currentStore?.slug || 'demo'}/orcamento`} target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest px-2">
                        <ChevronLeft className="w-3 h-3" /> Ver assistente →
                    </Link>
                </div>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="font-bold text-gray-800 text-sm md:text-base">
                            {activeNav.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isSupabaseConfigured() && (
                            <span className="hidden sm:block text-[10px] bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full border border-amber-200">MODO DEMONSTRAÇÃO</span>
                        )}
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-green-700" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}