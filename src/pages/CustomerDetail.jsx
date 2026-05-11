import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingState from '@/components/shared/LoadingState';

export default function CustomerDetail() {
    const { id } = useParams();
    const { data: customer, isLoading } = useQuery({
        queryKey: ['customer', id],
        queryFn: async () => {
            const list = await base44.entities.Customer.filter({ id });
            return list[0];
        },
    });
    const { data: quotes = [] } = useQuery({
        queryKey: ['quotes-customer', id],
        queryFn: () => base44.entities.Quote.filter({ customer_id: id }),
    });

    if (isLoading) return <LoadingState />;
    if (!customer) return <p className="text-center py-8 text-muted-foreground">Cliente não encontrado.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/clientes"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
                <div>
                    <h2 className="text-2xl font-bold">{customer.name}</h2>
                    <p className="text-sm text-muted-foreground">{customer.company_name || 'Sem empresa'}</p>
                </div>
                <div className="ml-auto">
                    <Link to={`/novo-orcamento?cliente=${id}`}><Button size="sm" className="gap-1.5"><FileText className="w-4 h-4" /> Novo Orçamento</Button></Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="text-sm">Dados do Cliente</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {customer.email && <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" />{customer.email}</div>}
                        {customer.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" />{customer.phone}</div>}
                        {customer.company_name && <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-muted-foreground" />{customer.company_name}</div>}
                        {customer.notes && <div className="text-sm text-muted-foreground mt-3 pt-3 border-t">{customer.notes}</div>}
                        {customer.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">{customer.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle className="text-sm">Histórico de Orçamentos ({quotes.length})</CardTitle></CardHeader>
                    <CardContent>
                        {quotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">Nenhum orçamento para este cliente.</p>
                        ) : (
                            <div className="space-y-2">
                                {quotes.map(q => (
                                    <Link key={q.id} to={`/orcamentos/${q.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                                        <div>
                                            <p className="text-sm font-medium">{q.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(q.created_date).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold">R$ {(q.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            <StatusBadge status={q.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}