import React, { useState, useEffect } from 'react';

export default function StepLoading({ onDone, hasHistory }) {
    const STEPS = [
        "Entendendo seu pedido...",
        "Consultando produtos da loja...",
        hasHistory ? "Considerando seu histórico..." : "Analisando o catálogo...",
        "Separando as melhores opções...",
        "Montando seu orçamento...",
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (current < STEPS.length - 1) {
            const t = setTimeout(() => setCurrent(c => c + 1), 850);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(onDone, 800);
            return () => clearTimeout(t);
        }
    }, [current, onDone]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-2xl bg-green-600 animate-ping opacity-30" />
                <svg className="w-7 h-7 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>

            <div className="space-y-3 max-w-xs w-full">
                {STEPS.map((label, i) => (
                    <div key={label} className={`flex items-center gap-3 transition-all ${i <= current ? 'opacity-100' : 'opacity-25'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${i < current ? 'bg-green-600' : i === current ? 'bg-green-700 animate-pulse' : 'bg-gray-200'
                            }`}>
                            {i < current ? (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${i === current ? 'bg-white' : 'bg-gray-400'}`} />
                            )}
                        </div>
                        <span className={`text-sm font-medium ${i === current ? 'text-green-700' : i < current ? 'text-gray-600' : 'text-gray-400'}`}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}