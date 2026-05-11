import React from 'react';
import { Button } from '@/components/ui/button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-muted-foreground" /></div>}
            <p className="font-semibold text-foreground mb-1">{title}</p>
            {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
            {actionLabel && onAction && <Button onClick={onAction} size="sm">{actionLabel}</Button>}
        </div>
    );
}