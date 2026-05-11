import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, className }) {
    return (
        <Card className={cn("p-5 relative overflow-hidden", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                    <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
                    {trend && (
                        <p className={cn("text-xs mt-1 font-medium", trend.startsWith('+') ? "text-green-600" : "text-muted-foreground")}>
                            {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-2.5 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
            </div>
        </Card>
    );
}