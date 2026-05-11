import React, { useState } from 'react';
import { CheckCircle2, Copy, RotateCcw, Clock, ExternalLink } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function StepSuccess({ quoteId, items, total, contact, onReset, storeName }) {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const { storeSlug } = useParams();

    function handleCopy() {
        const text = `Orçamento ${quoteId} — ${storeName}\n\nProdutos:\n${items.map(i => `• ${i.name} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\nTotal estimado: R$ ${total.toFixed(2)}\n\nValores sujeitos à confirmação da loja.`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-10 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu orçamento foi enviado!</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                A loja recebeu sua solicitação e entrará em contato para confirmar disponibilidade, valores finais e condições de entrega.
            </p>

            {/* Summary card */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 mb-5 text-left">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resumo do Pedido</span>
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md truncate max-w-[120px]">{quoteId}</span>
                </div>
                <div className="space-y-1.5 mb-4">
                    {items.slice(0, 5).map((i, index) => (
                        <div key={i.productId || index} className="flex justify-between text-sm">
                            <span className="text-gray-700 truncate mr-2">{i.name || 'Produto'} x{i.quantity}</span>
                            <span className="text-gray-900 font-medium shrink-0">R$ {(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    {items.length > 5 && (
                        <p className="text-[10px] text-gray-400">... e mais {items.length - 5} itens</p>
                    )}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total estimado</span>
                    <span className="text-lg font-bold text-green-700">R$ {total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">Este é um orçamento estimado. A loja confirmará disponibilidade e valores finais.</p>
                <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className="text-xs text-gray-500">Resposta será enviada para:</p>
                    <p className="text-sm font-medium text-gray-800">{contact.name} — {contact.contact}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
                <button onClick={() => navigate(`/s/${storeSlug}/historico`)}
                    className="flex items-center justify-center gap-2 text-sm font-medium bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-xl transition-colors shadow-sm">
                    <Clock className="w-4 h-4" /> Ver meu histórico
                </button>
                <button onClick={handleCopy}
                    className="flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 hover:border-gray-300 bg-white text-gray-600 px-4 py-3 rounded-xl transition-colors">
                    <Copy className="w-4 h-4" />
                    {copied ? 'Resumo copiado!' : 'Copiar resumo'}
                </button>
                <button onClick={onReset}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-green-700 px-4 py-2 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Criar novo orçamento
                </button>
                <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mt-2">
                    <ExternalLink className="w-3 h-3" /> Voltar para a loja
                </Link>
            </div>
        </div>
    );
}