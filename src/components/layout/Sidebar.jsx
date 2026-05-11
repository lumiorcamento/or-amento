import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Package, FileText, PlusCircle,
    Sparkles, Plug, RefreshCw, BarChart3, Settings,
    ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Clientes', icon: Users, path: '/clientes' },
    { label: 'Catálogo', icon: Package, path: '/catalogo' },
    { label: 'Orçamentos', icon: FileText, path: '/orcamentos' },
    { label: 'Novo Orçamento', icon: PlusCircle, path: '/novo-orcamento', highlight: true },
    { label: 'IA / Recomendações', icon: Sparkles, path: '/ia' },
    { label: 'Integrações', icon: Plug, path: '/integracoes' },
    { label: 'Sincronização', icon: RefreshCw, path: '/sincronizacao' },
    { label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
    { label: 'Configurações', icon: Settings, path: '/configuracoes' },
    { label: 'Arquitetura', icon: BookOpen, path: '/arquitetura' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const location = useLocation();

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40 transition-all duration-300 border-r border-sidebar-border",
            collapsed ? "w-16" : "w-60"
        )}>
            <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-sidebar-primary-foreground" />
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="text-sm font-bold truncate text-sidebar-foreground">Consult AI</p>
                        <p className="text-[10px] text-sidebar-foreground/60 truncate">Quotes</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                item.highlight && !isActive && "text-sidebar-primary font-medium",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-sidebar-primary")} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
}