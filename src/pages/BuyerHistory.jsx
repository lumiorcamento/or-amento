import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Sparkles, CopyPlus, Loader2 } from 'lucide-react';
import { useBuyer } from '@/lib/BuyerContext';
import { useStore } from '@/lib/StoreContext';
import { useNavigate } from 'react-router-dom';
import { quoteService } from '@/services';
import { isSupabaseConfigured } from '@/lib/supabase';

const STATUS_LABELS = { sent: 'Enviado', in_review: 'Em análise', answered: 'Respondido', approved: 'Aprovado', canceled: 'Cancelado' };
const STATUS_COLORS = {
    sent: 'bg-blue-100 text-blue-700',
    in_review: 'bg-amber-100 text-amber-700',
    answered: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    canceled: 'bg-gray-100 text-gray-500',
};

const SIMILAR_VARIANTS = [
    (prompt) => `Quero uma sugestão parecida com este orçamento, mas mais econômica. Referência: ${prompt}`,
    (prompt) => `Quero repetir este estilo de orçamento com novos produtos. Referência: ${prompt}`,
    (prompt) => `Quero montar outro kit parecido com este. Referência: ${prompt}`,
];

function createSimilarPrompt(quote) {
    const idx = Math.floor(Math.random() * SIMILAR_VARIANTS.length);
    return SIMILAR_VARIANTS[idx](quote.originalPrompt || quote.original_prompt);
}

export default function BuyerHistory() {
    const { buyer, isBuyerAuthenticated, isLoadingBuyer } = useBuyer();
    const { store, isLoadingStore, storeSlug } = useStore();
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoadingBuyer && !isBuyerAuthenticated) {
            navigate(`/s/${storeSlug}/login`);
        }
    }, [isBuyerAuthenticated, isLoadingBuyer, storeSlug, navigate]);

    useEffect(() => {
        async function loadHistory() {
            if (isBuyerAuthenticated && store && isSupabaseConfigured()) {
                setIsLoadingHistory(true);
                try {
                    const data = await quoteService.getBuyerQuotes({
                        storeId: store.id,
                        buyerUserId: buyer.id
                    });
                    setHistory(data);
                } catch (err) {
                    console.error("Error loading history:", err);
                } finally {
                    setIsLoadingHistory(false);
                }
            } else if (buyer && !isSupabaseConfigured()) {
                // Fallback demo history
                setHistory(buyer.history || []);
                setIsLoadingHistory(false);
            }
        }
        loadHistory();
    }, [buyer, store, isBuyerAuthenticated]);

    if (isLoadingStore || isLoadingBuyer || isLoadingHistory) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
            </div>
        );
    }

    if (!buyer || !store) return null;

    const primaryColor = store?.primary_color || store?.primaryColor || '#1f4a32';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate(`/s/${storeSlug}/orcamento`)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 leading-none">{store.name}</p>
                        <p className="font-semibold text-sm text-gray-800 leading-tight">Meus orçamentos</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Olá, {buyer.name?.split(' ')[0]}!</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{history.length} orçamento{history.length !== 1 ? 's' : ''} nesta loja</p>
                    </div>
                    <button onClick={() => navigate(`/s/${storeSlug}/orcamento`)}
                        className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-xl transition-colors"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Novo orçamento
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="font-semibold text-gray-600">Nenhum orçamento ainda</p>
                        <p className="text-sm text-gray-400 mt-1 mb-4">Crie seu primeiro orçamento personalizado com IA.</p>
                        <button onClick={() => navigate(`/s/${storeSlug}/orcamento`)} className="text-sm font-medium text-green-700 underline">Criar orçamento</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map(quote => (
                            <div key={quote.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-gray-400">{quote.quoteId || quote.id.substring(0, 8)}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[quote.status] || STATUS_COLORS.sent}`}>
                                                {STATUS_LABELS[quote.status] || quote.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">"{quote.original_prompt || quote.originalPrompt}"</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-green-700 text-sm">R$ {(quote.estimated_total || quote.estimatedTotal || 0).toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(quote.created_at || quote.date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelected(quote)}
                                        className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 py-1.5 rounded-lg transition-colors">
                                        Abrir
                                    </button>
                                    <button onClick={() => { sessionStorage.setItem('lumi_initial_prompt', createSimilarPrompt(quote)); navigate(`/s/${storeSlug}/orcamento`); }}
                                        className="flex-1 text-xs font-semibold text-green-700 hover:text-green-800 border border-green-300 hover:border-green-500 bg-green-50 hover:bg-green-100 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <CopyPlus className="w-3 h-3" /> Criar outro parecido
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quote detail modal (Simplified) */}
                {selected && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Orçamento {selected.quoteId || selected.id.substring(0, 8)}</h3>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[selected.status] || STATUS_COLORS.sent}`}>
                                        {STATUS_LABELS[selected.status] || selected.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{new Date(selected.created_at || selected.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="bg-gray-50 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Seu pedido</p>
                                    <p className="text-sm text-gray-700">"{selected.original_prompt || selected.originalPrompt}"</p>
                                </div>
                                <div className="space-y-2">
                                    {(selected.quote_items || selected.items || []).map((item, i) => (
                                        <div key={i} className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800">{item.product_name || item.products?.name}</p>
                                                <p className="text-xs text-gray-400">x{item.quantity} · {item.reason}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-green-700 ml-3 shrink-0">R$ {(item.subtotal || item.unit_price * item.quantity || 0).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between">
                                    <span className="font-semibold text-gray-700">Total estimado</span>
                                    <span className="font-bold text-green-700">R$ {(selected.estimated_total || selected.estimatedTotal || 0).toFixed(2)}</span>
                                </div>
                                <button onClick={() => { sessionStorage.setItem('lumi_initial_prompt', createSimilarPrompt(selected)); setSelected(null); navigate(`/s/${storeSlug}/orcamento`); }}
                                    className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <CopyPlus className="w-4 h-4" /> Criar outro parecido
                                </button>
                                <button onClick={() => setSelected(null)} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}