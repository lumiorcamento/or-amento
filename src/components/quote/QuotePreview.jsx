import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function QuotePreview({ customer, briefing, items, subtotal, discount, total, aiSummary, commercialText }) {
    return (
        <Card className="border-2">
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Consult AI Quotes</h3>
                            <p className="text-xs text-muted-foreground">Orçamento Consultivo</p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>{new Date().toLocaleDateString('pt-BR')}</p>
                        <p>Validade: 15 dias</p>
                    </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cliente</p>
                        <p className="font-medium">{customer?.name || '—'}</p>
                        {customer?.email && <p className="text-muted-foreground">{customer.email}</p>}
                        {customer?.phone && <p className="text-muted-foreground">{customer.phone}</p>}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Proposta</p>
                        <p className="font-medium">{briefing?.title || 'Orçamento Consultivo'}</p>
                        {briefing?.objective && <p className="text-muted-foreground">{briefing.objective}</p>}
                    </div>
                </div>

                {commercialText && (
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Texto Consultivo</p>
                        <p className="text-sm whitespace-pre-line">{commercialText}</p>
                    </div>
                )}

                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Itens da Proposta</p>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-3 font-medium">Produto</th>
                                    <th className="text-center p-3 font-medium">Qtd</th>
                                    <th className="text-right p-3 font-medium">Valor Unit.</th>
                                    <th className="text-right p-3 font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-3">
                                            <p className="font-medium">{item.product_name}</p>
                                            {item.ai_reason && <p className="text-xs text-muted-foreground mt-0.5">{item.ai_reason}</p>}
                                        </td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">R$ {(item.unit_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-right font-medium">R$ {(item.unit_price * item.quantity || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="w-64 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span>R$ {(subtotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                        {discount > 0 && <div className="flex justify-between text-destructive"><span>Desconto:</span><span>- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>}
                        <Separator />
                        <div className="flex justify-between font-bold text-base"><span>Total:</span><span>R$ {(total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                    </div>
                </div>

                {aiSummary && (
                    <div className="p-4 bg-accent rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Resumo da Recomendação IA</p>
                        <p className="text-sm">{aiSummary}</p>
                    </div>
                )}

                <Separator />

                <div className="text-center text-xs text-muted-foreground space-y-1">
                    <p>Proposta gerada por Consult AI Quotes — Orçamentos Consultivos com IA</p>
                    <p>Este documento é uma proposta comercial e não configura compromisso de venda.</p>
                </div>
            </CardContent>
        </Card>
    );
}