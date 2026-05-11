import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
    "Interpretando pedido...",
    "Consultando catálogo...",
    "Verificando estoque...",
    "Ranqueando produtos...",
    "Gerando justificativas...",
];

export default function AILoadingSteps({ onDone }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (current >= STEPS.length) {
            setTimeout(onDone, 400);
            return;
        }
        const t = setTimeout(() => setCurrent(c => c + 1), 650);
        return () => clearTimeout(t);
    }, [current, onDone]);

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <div className="space-y-2 w-full max-w-xs">
                {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${i < current ? 'bg-primary' : i === current ? 'bg-primary/30 animate-pulse' : 'bg-muted'
                            }`}>
                            {i < current && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm transition-colors ${i < current ? 'text-primary font-medium' : i === current ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}