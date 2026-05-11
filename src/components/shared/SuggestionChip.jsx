import React from 'react';
import { cn } from '@/lib/utils';

export default function SuggestionChip({ label, onClick, active }) {
    return (
        <button
            onClick={() => onClick(label)}
            className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary hover:bg-accent"
            )}
        >
            {label}
        </button>
    );
}