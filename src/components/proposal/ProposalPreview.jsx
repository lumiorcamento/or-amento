import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProposalPreview({ proposal }) {
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + (proposal.validity_days || 15));
    const expiryStr = format(expiry, "dd/MM/yyyy");

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl mx-auto text-sm font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1f4a32] to-[#2d6a4a] text-white p-6 rounded-t-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-lg font-bold tracking-tight">Lumi Quotes</div>
                        <div className="text-green-200 text-xs mt-0.5">Proposta Comercial</div>
                    </div>
                    <div className="text-right text-xs text-green-200">
                        <div>Data: {today}</div>
                        <div>Válida até: {expiryStr}</div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                    <h2 className="text-xl font-bold">{proposal.title}</h2>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
                {/* Customer */}
                {proposal.final_customer_name && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Para</div>
                        <div className="font-semibold text-gray-800">{proposal.final_customer_name}</div>
                        {proposal.final_customer_phone && <div className="text-gray-500 text-xs">{proposal.final_customer_phone}</div>}
                        {proposal.final_customer_email && <div className="text-gray-500 text-xs">{proposal.final_customer_email}</div>}
                    </div>
                )}

                {/* Summary */}
                {proposal.summary && (
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Resumo</div>
                        <p className="text-gray-700 text-sm leading-relaxed">{proposal.summary}</p>
                    </div>
                )}

                {/* Products */}
                <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Produtos Selecionados</div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500">
                                <th className="text-left pb-2 font-medium">Produto</th>
                                <th className="text-right pb-2 font-medium">Qtd</th>
                                <th className="text-right pb-2 font-medium">Unit.</th>
                                <th className="text-right pb-2 font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(proposal.items || []).map((item, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    <td className="py-2.5">
                                        <div className="font-medium text-gray-800">{item.product_name}</div>
                                        {item.reason && <div className="text-[11px] text-gray-400 mt-0.5">{item.reason}</div>}
                                    </td>
                                    <td className="py-2.5 text-right text-gray-600">{item.quantity}</td>
                                    <td className="py-2.5 text-right text-gray-600">R$ {item.unit_price?.toFixed(2)}</td>
                                    <td className="py-2.5 text-right font-semibold text-gray-800">R$ {item.total?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span><span>R$ {proposal.subtotal?.toFixed(2)}</span>
                    </div>
                    {proposal.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Desconto</span><span>- R$ {proposal.discount?.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                        <span>Total</span><span>R$ {proposal.total?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Commercial text */}
                {proposal.commercial_text && (
                    <div className="border-l-4 border-[#1f4a32] pl-4">
                        <p className="text-gray-600 italic text-sm leading-relaxed">{proposal.commercial_text}</p>
                    </div>
                )}

                {/* Notes */}
                {proposal.notes && (
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Observações</div>
                        <p className="text-gray-600 text-sm">{proposal.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                    Proposta gerada pelo Lumi Quotes · Válida por {proposal.validity_days || 15} dias<br />
                    Este documento não tem valor fiscal.
                </div>
            </div>
        </div>
    );
}