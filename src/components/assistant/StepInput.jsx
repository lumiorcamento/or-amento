import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const GENERAL_CHIPS = [
    { label: "Montar kit presente", prompt: "Quero montar um kit presente especial." },
    { label: "Produtos para crianças", prompt: "Preciso de produtos para crianças de 6 a 10 anos." },
    { label: "Produtos para revenda", prompt: "Quero produtos com boa margem para revenda." },
    { label: "Orçamento para empresa", prompt: "Preciso de presentes para 20 funcionários da empresa." },
    { label: "Lembrancinhas", prompt: "Quero montar lembrancinhas para 50 pessoas." },
    { label: "Até R$ 500", prompt: "Quero um orçamento variado com limite de R$ 500." },
    { label: "Melhor custo-benefício", prompt: "Quero os melhores produtos com custo-benefício." },
    { label: "Produtos premium", prompt: "Quero produtos premium para um presente especial." },
];

export default function StepInput({ onGenerate, buyer, initialPrompt }) {
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const textRef = useRef(null);

    function handleChip(p) {
        setPrompt(p);
        textRef.current?.focus();
    }

    const firstName = buyer?.name?.split(' ')[0] || '';
    const hasHistory = buyer?.history?.length > 0;

    return (
        <div className="min-h-[calc(100vh-57px)] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-2xl mx-auto w-full">

                {/* Greeting */}
                <div className="text-center mb-7 w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                        Olá, {firstName}! O que você está procurando?
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Descreva sua necessidade e a IA monta uma sugestão com os produtos desta loja{hasHistory ? ', considerando o que você já buscou aqui' : ''}.
                    </p>
                </div>

                {/* History insights — "Personalizado para você" */}
                {hasHistory && buyer.insights?.length > 0 && (
                    <div className="w-full bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-green-600" />
                            <p className="text-xs font-bold text-green-800">Personalizado para você</p>
                        </div>
                        <div className="space-y-1.5">
                            {buyer.insights.slice(0, 4).map(insight => (
                                <p key={insight} className="text-xs text-green-700 flex items-start gap-1.5">
                                    <span className="shrink-0 mt-0.5">•</span>
                                    {insight}
                                </p>
                            ))}
                        </div>
                        {buyer.history?.length > 0 && (
                            <p className="text-[11px] text-green-600 mt-2.5 pt-2 border-t border-green-100">
                                Você já criou {buyer.history.length} orçamento{buyer.history.length !== 1 ? 's' : ''} nesta loja.
                            </p>
                        )}
                    </div>
                )}

                {/* Main input */}
                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
                    <textarea
                        ref={textRef}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && prompt.trim()) onGenerate(prompt); }}
                        placeholder="Ex: Quero montar um kit para meninas de 6 a 10 anos, até R$ 500, com produtos criativos e úteis."
                        className="w-full text-gray-800 bg-transparent border-none outline-none resize-none text-[15px] placeholder:text-gray-400 min-h-[90px]"
                        rows={3}
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1 gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">A IA usa apenas produtos disponíveis no catálogo da loja.</span>
                        <button
                            onClick={() => prompt.trim() && onGenerate(prompt)}
                            disabled={!prompt.trim()}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
                        >
                            <Sparkles className="w-4 h-4" />
                            Gerar meu orçamento
                        </button>
                    </div>
                </div>

                {/* History chips */}
                {hasHistory && buyer.historyChips?.length > 0 && (
                    <div className="w-full mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 px-1">Sugestões personalizadas</p>
                        <div className="flex flex-wrap gap-2">
                            {buyer.historyChips.map(c => (
                                <button key={c.label} onClick={() => handleChip(c.prompt)}
                                    className="text-sm px-3.5 py-1.5 rounded-full border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-500 transition-all font-medium">
                                    ✦ {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* General chips */}
                <div className="w-full">
                    <p className="text-xs font-semibold text-gray-500 mb-2 px-1">Sugestões rápidas</p>
                    <div className="flex flex-wrap gap-2">
                        {GENERAL_CHIPS.map(c => (
                            <button key={c.label} onClick={() => handleChip(c.prompt)}
                                className="text-sm px-3.5 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-700 hover:bg-green-50 transition-all font-medium">
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}