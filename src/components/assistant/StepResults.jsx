import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Send, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

const REFINE_CHIPS = [
    "Quero mais barato",
    "Quero mais premium",
    "Quero mais variedade",
    "Quero menos itens",
    "Focar em presente",
    "Focar em revenda",
];

// Chips for vague requests
const VAGUE_CHIPS = [
    { label: "Até R$ 100", prompt: "até R$ 100" },
    { label: "Até R$ 500", prompt: "até R$ 500" },
    { label: "Para criança", prompt: "para criança" },
    { label: "Para empresa", prompt: "para empresa" },
    { label: "Para revenda", prompt: "para revenda" },
];

function isVaguePrompt(prompt) {
    if (!prompt) return false;
    const lower = prompt.toLowerCase().trim();
    // Short prompt with no specific context signals
    const wordCount = lower.split(/\s+/).length;
    const hasContext = /r\$|\d+|criança|empresa|revend|festas|aniversário|funcionário|kit|presente\s+para|até|faixa/.test(lower);
    return wordCount <= 4 && !hasContext;
}

export default function StepResults({ prompt, recommendation, items, setItems, onReset, onRefine, onNext }) {
    const [refineText, setRefineText] = useState('');
    const vague = isVaguePrompt(prompt);

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    function updateQty(id, delta) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
    }

    function removeItem(id) {
        setItems(prev => prev.filter(i => i.id !== id));
    }

    function handleRefine() {
        if (!refineText.trim()) return;
        onRefine(prompt + '. ' + refineText);
        setRefineText('');
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">

            {/* Vague prompt banner */}
            {vague && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <p className="text-xs font-bold text-amber-800">Posso montar uma sugestão com base no seu histórico.</p>
                    </div>
                    <p className="text-xs text-amber-700 mb-3">Se quiser melhorar o resultado, escolha uma opção abaixo:</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {VAGUE_CHIPS.map(c => (
                            <button key={c.label} onClick={() => onRefine(prompt + ' ' + c.prompt)}
                                className="text-xs px-3 py-1.5 rounded-full border border-amber-300 text-amber-800 bg-amber-100 hover:bg-amber-200 transition-all font-medium">
                                {c.label}
                            </button>
                        ))}
                        <button onClick={onNext}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-all font-medium">
                            Continuar assim mesmo
                        </button>
                    </div>
                </div>
            )}

            {/* AI Summary */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
                <p className="text-sm font-medium text-green-900 mb-3">{recommendation?.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                    {(recommendation?.intentTags || []).map(tag => (
                        <span key={tag} className="text-xs bg-white border border-green-300 text-green-700 font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Encontramos estas opções para você</h2>
                <button onClick={onReset} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Recomeçar
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">Selecionamos produtos que combinam com o seu pedido. Você pode ajustar antes de enviar.</p>

            {/* Products */}
            <div className="space-y-3 mb-6">
                {items.map(item => (
                    <ProductCard key={item.id} item={item} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Todos os produtos foram removidos.</p>
                    <button onClick={onReset} className="mt-2 text-green-600 text-sm font-medium underline">Fazer nova busca</button>
                </div>
            )}

            {/* Refine */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">Quer ajustar a sugestão?</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {REFINE_CHIPS.map(c => (
                        <button key={c} onClick={() => setRefineText(c)}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all">
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={refineText}
                        onChange={e => setRefineText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRefine()}
                        placeholder="Ex: Mostre opções mais baratas..."
                        className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500"
                    />
                    <button onClick={handleRefine} disabled={!refineText.trim()}
                        className="bg-gray-800 hover:bg-gray-900 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Total + Next */}
            {items.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Total estimado</p>
                        <p className="text-xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Sujeito à confirmação da loja</p>
                    </div>
                    <button onClick={onNext}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
                        Revisar orçamento
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}