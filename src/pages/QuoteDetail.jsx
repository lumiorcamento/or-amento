import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileDown, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingState from '@/components/shared/LoadingState';
import { toast } from 'sonner';

export default function QuoteDetail() {
    const { id } = useParams();
    const qc = useQueryClient();

    const { data: quote, isLoading } = useQuery({
        queryKey: ['quote', id],
        queryFn: async () => { const list = await base44.entities.Quote.filter({ id }); return list[0]; },
    });
    const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: () => base44.entities.Customer.list() });
    const customer = customers.find(c => c.id === quote?.customer_id);

    const updateStatus = useMutation({
        mutationFn: (status) => base44.entities.Quote.update(id, { status }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['quote', id] }); toast.success('Status atualizado!'); },
    });

    if (isLoading) return <LoadingState />;
    if (!quote) return <p className="text-center py-8 text-muted-foreground">Orçamento não encontrado.</p>;

    const items = quote.items || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/orcamentos"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{quote.title}</h2>
                    <p className="text-sm text-muted-foreground">Cliente: {customer?.name || '—'}</p>
                </div>
                <StatusBadge status={quote.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle className="text-sm">Itens do Orçamento</CardTitle></CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Qtd</TableHead>
                                        <TableHead>Preço Unit.</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Prioridade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{item.product_name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>R$ {(item.unit_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="font-semibold">R$ {(item.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-sm capitalize">{item.priority || '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item no orçamento.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Resumo</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span>R$ {(quote.subtotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Desconto:</span><span>R$ {(quote.discount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total:</span><span>R$ {(quote.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between text-muted-foreground"><span>Validade:</span><span>{quote.validity_days || 15} dias</span></div>
                        </CardContent>
                    </Card>

                    {quote.ai_summary && (
                        <Card>
                            <CardHeader><CardTitle className="text-sm">Resumo IA</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">{quote.ai_summary}</p></CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle className="text-sm">Ações</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full gap-1.5" onClick={() => updateStatus.mutate('approved')}><CheckCircle className="w-4 h-4" /> Aprovar</Button>
                            <Button variant="outline" className="w-full gap-1.5" onClick={() => updateStatus.mutate('sent')}><Send className="w-4 h-4" /> Marcar como Enviado</Button>
                            <Button variant="outline" className="w-full gap-1.5" onClick={() => toast.success('PDF gerado com sucesso! (simulado)')}><FileDown className="w-4 h-4" /> Gerar PDF</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}