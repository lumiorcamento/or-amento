import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const config = {
    draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-600' },
    ready: { label: 'Pronta', className: 'bg-blue-100 text-blue-700' },
    sent: { label: 'Enviada', className: 'bg-purple-100 text-purple-700' },
    approved: { label: 'Aprovada', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Recusada', className: 'bg-red-100 text-red-700' },
    expired: { label: 'Expirada', className: 'bg-amber-100 text-amber-700' },
    not_connected: { label: 'Não conectado', className: 'bg-gray-100 text-gray-500' },
    connected: { label: 'Conectado', className: 'bg-green-100 text-green-700' },
    simulated: { label: 'Simulação ativa', className: 'bg-blue-100 text-blue-700' },
    planned: { label: 'Planejado', className: 'bg-amber-100 text-amber-700' },
    syncing: { label: 'Sincronizando', className: 'bg-purple-100 text-purple-700' },
    error: { label: 'Erro', className: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }) {
    const c = config[status] || { label: status, className: 'bg-secondary text-secondary-foreground' };
    return (
        <Badge variant="secondary" className={cn("text-xs font-medium", c.className)}>
            {c.label}
        </Badge>
    );
}