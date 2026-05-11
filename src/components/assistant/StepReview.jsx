import React from 'react';
import { ArrowLeft, ArrowRight, Plus, Minus, Trash2, Package } from 'lucide-react';

const REFINE_BTNS = ["Quero mais barato", "Quero mais premium", "Quero mais variedade", "Quero menos itens", "Maior quantidade", "Trocar produtos"];

export default function StepReview({ prompt, items, setItems, total, onBack, onNext }) {
    function updateQty(id, delta) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
    }
    function removeItem(id) {
        setItems(prev => prev.filter(i => i.id !== id));
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Revise seu orçamento</h2>
            <p className="text-sm text-gray-500 mb-5">Confira os produtos, ajuste quantidades e depois envie sua solicitação.</p>

            {/* Original request */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 text-sm text-gray-700">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">Seu pedido</span>
                "{prompt}"
            </div>

            {/* Items table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
                {items.map((item, i) => (
                    <div key={item.id} className={`p-4 flex gap-3 ${i < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> :
                                <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.reason}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 transition-colors">
                                        <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 transition-colors">
                                        <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-green-700">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Total row */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">{items.length} {items.length === 1 ? 'produto' : 'produtos'}</span>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">R$ {total.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400">Total estimado</p>
                    </div>
                </div>
            </div>

            {/* Confirmation notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-xs text-amber-800 leading-relaxed">
                ⓘ Este é um orçamento estimado. A loja confirmará disponibilidade, valores finais e condições de entrega.
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <label className="text-xs font-semibold text-gray-500 block mb-2">Observações adicionais (opcional)</label>
                <textarea rows={2} placeholder="Ex: Prefiro produtos em estoque, prazo de entrega até X dias..."
                    className="w-full text-sm bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-green-500 resize-none" />
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-4 py-3 border border-gray-200 rounded-xl transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button onClick={onNext} disabled={items.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
                    Continuar para envio
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}