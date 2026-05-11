import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Inbox, Package, Settings, Plug, BarChart2, Sparkles, Menu, ChevronLeft } from 'lucide-react';

const NAV = [
    { label: 'Solicitações', path: '/lojista/solicitacoes', icon: Inbox },
    { label: 'Produtos', path: '/lojista/produtos', icon: Package },
    { label: 'Configurar assistente', path: '/lojista/configurar', icon: Settings },
    { label: 'Conectar loja', path: '/lojista/conectar', icon: Plug },
    { label: 'Resultados', path: '/lojista/resultados', icon: BarChart2 },
];

export default function StoreLayout() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[#1a3a28] flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="px-4 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-white font-bold text-sm">Painel da Loja</span>
                    </div>
                    <p className="text-green-300/60 text-xs">Loja Demonstração</p>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {NAV.map(n => {
                        const active = pathname === n.path || (pathname === '/lojista' && n.path === '/lojista/solicitacoes');
                        return (
                            <Link key={n.path} to={n.path} onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-green-600/30 text-green-300' : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}>
                                <n.icon className="w-4 h-4 shrink-0" />
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-4 py-4 border-t border-white/10">
                    <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
                        <ChevronLeft className="w-3 h-3" />
                        Ver assistente do cliente
                    </Link>
                </div>
            </aside>

            {/* Overlay mobile */}
            {open && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

            {/* Main */}
            <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-sm text-gray-800">
                            {NAV.find(n => n.path === pathname || (pathname === '/lojista' && n.path === '/lojista/solicitacoes'))?.label || 'Painel da Loja'}
                        </span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">Modo demonstração</span>
                </header>

                <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}