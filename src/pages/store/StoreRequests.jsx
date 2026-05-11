import React, { useState } from 'react';
import { DEMO_QUOTE_REQUESTS } from '@/lib/demoData';
import { DEMO_BUYERS } from '@/lib/buyerData';
import { MessageSquare, Check, User, RefreshCw, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Map demo requests to buyers for history display
const BUYER_MAP = { qr1: 'buyer1', qr3: 'buyer2', qr4: 'buyer1', qr5: 'buyer2' };

const STATUS_LABELS = { new: 'Novo', in_review: 'Em análise', answered: 'Respondido', approved: 'Aprovado', lost: 'Perdido' };
const STATUS_COLORS = {
    new: 'bg-blue-100 text-blue-700',
    in_review: 'bg-amber-100 text-amber-700',
    answered: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    lost: 'bg-gray-100 text-gray-500',
};

function getBuyerSummary(requestId) {
    const buyerId = BUYER_MAP[requestId];
    return buyerId ? DEMO_BUYERS.find(b => b.id === buyerId) : null;
}

export default function StoreRequests() {
    const [selected, setSelected] = useState(null);
    const [statuses, setStatuses] = useState({});

    const requests = DEMO_QUOTE_REQUESTS.map(r => ({ ...r, status: statuses[r.id] || r.status }));

    function openWhatsApp(req) {
        const buyer = getBuyerSummary(req.id);
        const phone = req.customerContact?.replace(/\D/g, '') || '';
        const items = req.items.map(i => `• ${i.product_name} x${i.quantity} — R$ ${i.subtotal.toFixed(2)}`).join('\n');
        const text = encodeURIComponent(
            `Olá, ${req.customerName}! 👋 Recebemos sua solicitação de orçamento na nossa loja.\n\n*Produtos sugeridos:*\n${items}\n\n*Total estimado: R$ ${req.estimatedTotal.toFixed(2)}*\n\n_Este é um orçamento estimado. Confirmaremos disponibilidade, valores finais e condições de entrega._\n\nDeseja prosseguir?`
        );
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Solicitações recebidas</h2>
                <p className="text-sm text-gray-500 mt-0.5">{requests.length} solicitações de orçamento</p>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {requests.map(r => {
                    const buyer = getBuyerSummary(r.id);
                    const isRecurring = buyer && buyer.history.length > 0;
                    return (
                        <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <p className="font-semibold text-gray-900 text-sm">{r.customerName}</p>
                                        {isRecurring
                                            ? <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><RefreshCw className="w-2.5 h-2.5" /> Recorrente</span>
                                            : <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> Novo</span>
                                        }
                                    </div>
                                    <p className="text-xs text-gray-400">{r.customerContact}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-green-700">R$ {r.estimatedTotal.toFixed(2)}</p>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">"{r.originalPrompt}"</p>
                            <div className="flex gap-2">
                                <button onClick={() => setSelected(r)}
                                    className="flex-1 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 py-2 rounded-xl transition-colors">
                                    Ver detalhes
                                </button>
                                <button onClick={() => openWhatsApp(r)}
                                    className="flex-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Cliente</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Pedido</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => {
                                const buyer = getBuyerSummary(r.id);
                                const isRecurring = buyer && buyer.history.length > 0;
                                return (
                                    <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <p className="font-semibold text-gray-900">{r.customerName}</p>
                                                {isRecurring
                                                    ? <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><RefreshCw className="w-2.5 h-2.5" /> Recorrente</span>
                                                    : <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> Novo</span>
                                                }
                                            </div>
                                            <p className="text-xs text-gray-400">{r.customerContact}</p>
                                            {isRecurring && <p className="text-[10px] text-purple-500 mt-0.5">{buyer.history.length} orçamento{buyer.history.length !== 1 ? 's' : ''} anteriores</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">{r.originalPrompt}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-green-700">R$ {r.estimatedTotal.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openWhatsApp(r)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                                                </button>
                                                <button onClick={() => setSelected(r)}
                                                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                    Ver
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail dialog */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Solicitação — {selected?.customerName}</DialogTitle>
                    </DialogHeader>
                    {selected && (() => {
                        const buyer = getBuyerSummary(selected.id);
                        const isRecurring = buyer && buyer.history.length > 0;
                        return (
                            <div className="space-y-4">

                                {/* Customer summary */}
                                <div className={`rounded-xl px-4 py-3 border ${isRecurring ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        {isRecurring
                                            ? <><RefreshCw className="w-3.5 h-3.5 text-purple-600" /><p className="text-xs font-bold text-purple-700">Resumo do cliente — Cliente recorrente</p></>
                                            : <><User className="w-3.5 h-3.5 text-blue-600" /><p className="text-xs font-bold text-blue-700">Resumo do cliente — Novo cliente</p></>
                                        }
                                    </div>
                                    {isRecurring && buyer ? (
                                        <div className="space-y-1">
                                            <p className="text-xs text-purple-800">• {buyer.history.length} orçamento{buyer.history.length !== 1 ? 's' : ''} anteriores nesta loja</p>
                                            <p className="text-xs text-purple-800">• Valor médio dos pedidos: R$ {buyer.profile.averageOrderValue}</p>
                                            {buyer.insights.slice(0, 2).map(i => <p key={i} className="text-xs text-purple-800">• {i}</p>)}
                                            {buyer.history[0] && <p className="text-xs text-purple-600 mt-1">Última solicitação: "{buyer.history[0].originalPrompt}"</p>}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-blue-700">Primeira solicitação deste cliente. Boa oportunidade de fidelização.</p>
                                    )}
                                </div>

                                {/* Original request */}
                                <div className="bg-gray-50 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Pedido do cliente</p>
                                    <p className="text-sm text-gray-800">"{selected.originalPrompt}"</p>
                                </div>

                                {/* AI interpretation */}
                                <div className="bg-blue-50 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">O que o assistente entendeu</p>
                                    <p className="text-sm text-blue-800">{selected.interpretedNeed}</p>
                                </div>

                                {/* Items table */}
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="text-left px-4 py-2 text-xs text-gray-500">Produto</th>
                                                <th className="text-center px-3 py-2 text-xs text-gray-500">Qtd</th>
                                                <th className="text-right px-4 py-2 text-xs text-gray-500">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selected.items.map((item, i) => (
                                                <tr key={i} className="border-b border-gray-50 last:border-0">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">{item.product_name}</p>
                                                        <p className="text-xs text-gray-400">{item.reason}</p>
                                                    </td>
                                                    <td className="px-3 py-3 text-center text-gray-700">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-green-700">R$ {item.subtotal.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50">
                                                <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-gray-700">Total estimado</td>
                                                <td className="px-4 py-3 text-right font-bold text-green-700 text-base">R$ {selected.estimatedTotal.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Contact */}
                                <div className="flex items-center gap-2 px-1">
                                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="text-sm text-gray-600">{selected.customerContact}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => openWhatsApp(selected)}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                                        <MessageSquare className="w-4 h-4" /> Responder no WhatsApp
                                    </button>
                                    <button onClick={() => { setStatuses(s => ({ ...s, [selected.id]: 'approved' })); setSelected(null); }}
                                        className="flex items-center gap-2 border border-gray-300 hover:border-green-400 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                                        <Check className="w-4 h-4" /> Marcar como aprovado
                                    </button>
                                    <button onClick={() => { setStatuses(s => ({ ...s, [selected.id]: 'answered' })); setSelected(null); }}
                                        className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 transition-colors">
                                        Marcar como respondido
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 italic">
                                    Este é um orçamento estimado. A loja confirmará disponibilidade, valores finais e condições de entrega.
                                </p>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}