import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const titles = {
    '/': 'Gerar com IA',
    '/propostas': 'Propostas',
    '/catalogo': 'Catálogo de Produtos',
    '/qualidade': 'Qualidade do Catálogo',
    '/clientes': 'Clientes Finais',
    '/integracoes': 'Integrações',
    '/relatorios': 'Relatórios',
    '/configuracoes': 'Configurações',
    '/arquitetura': 'Arquitetura do Sistema',
};

export default function Topbar() {
    const location = useLocation();
    const base = '/' + location.pathname.split('/').filter(Boolean)[0] || '/';
    const title = titles[location.pathname] || titles['/' + location.pathname.split('/')[1]] || 'Lumi Quotes';

    return (
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                    <Store className="w-3 h-3 text-primary" />
                    <span>Loja Demonstração</span>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8">
                    <Bell className="w-4 h-4" />
                </Button>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    L
                </div>
            </div>
        </header>
    );
}