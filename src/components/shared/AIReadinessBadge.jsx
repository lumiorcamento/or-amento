import React from 'react';
import { cn } from '@/lib/utils';

const config = {
    ready: { label: 'Pronto para IA', className: 'bg-green-100 text-green-700 border-green-200' },
    missing_description: { label: 'Sem descrição', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    missing_category: { label: 'Sem categoria', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    missing_tags: { label: 'Sem tags', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    out_of_stock: { label: 'Sem estoque', className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AIReadinessBadge({ status }) {
    const c = config[status] || config.ready;
    return (
        <span className={cn("inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border", c.className)}>
            {c.label}
        </span>
    );
}