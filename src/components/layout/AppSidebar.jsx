import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Sparkles, FileText, Package, ShieldCheck, Users,
    Plug, BarChart3, Settings, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Gerar com IA', icon: Sparkles, path: '/', highlight: true },
    { label: 'Propostas', icon: FileText, path: '/propostas' },
    { label: 'Catálogo', icon: Package, path: '/catalogo' },
    { label: 'Qualidade do Catálogo', icon: ShieldCheck, path: '/qualidade' },
    { label: 'Clientes Finais', icon: Users, path: '/clientes' },
    { label: 'Integrações', icon: Plug, path: '/integracoes' },
    { label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
    { label: 'Configurações', icon: Settings, path: '/configuracoes' },
    { label: 'Arquitetura', icon: BookOpen, path: '/arquitetura' },
];

export default function AppSidebar({ collapsed, setCollapsed }) {
    const location = useLocation();

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40 transition-all duration-300 border-r border-sidebar-border",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border shrink-0">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="text-base font-bold text-white tracking-tight leading-none">Lumi Quotes</p>
                        <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">IA Comercial</p>
                    </div>
                )}
            </div>

            {/* Nav */}
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
                                "flex items-center gap-3 rounded-lg text-sm transition-all duration-150",
                                collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                                item.highlight && !isActive && "text-sidebar-primary/80 font-medium"
                            )}
                        >
                            <item.icon className={cn(
                                "shrink-0 transition-all",
                                collapsed ? "w-5 h-5" : "w-4 h-4",
                                item.highlight && "drop-shadow-[0_0_6px_rgba(100,200,140,0.6)]"
                            )} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {!collapsed && item.highlight && (
                                <span className="ml-auto text-[9px] font-bold bg-sidebar-primary/20 text-sidebar-primary px-1.5 py-0.5 rounded-full">IA</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Nuvemshop badge */}
            {!collapsed && (
                <div className="px-3 pb-2">
                    <div className="bg-sidebar-accent/50 rounded-lg px-3 py-2 text-[10px] text-sidebar-foreground/50 border border-sidebar-border/50">
                        <span className="text-sidebar-primary font-medium">● Nuvemshop</span> · Simulado
                    </div>
                </div>
            )}

            {/* Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
}