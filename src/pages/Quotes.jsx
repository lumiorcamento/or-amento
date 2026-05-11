import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import LoadingState from '@/components/shared/LoadingState';

export default function Quotes() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: quotes = [], isLoading } = useQuery({
        queryKey: ['quotes'],
        queryFn: () => base44.entities.Quote.list('-created_date'),
    });
    const { data: customers = [] } = useQuery({
        queryKey: ['customers'],
        queryFn: () => base44.entities.Customer.list(),
    });

    const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]));

    const filtered = quotes.filter(q => {
        const matchSearch = q.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || q.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (isLoading) return <LoadingState />;

    return (
        <div className="space-y-6">
            <PageHeader title="Orçamentos" subtitle="Acompanhe e gerencie todos os orçamentos consultivos.">
                <Link to="/novo-orcamento"><Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Novo Orçamento</Button></Link>
            </PageHeader>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por título..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos Status</SelectItem>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="awaiting_review">Aguardando Revisão</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="sent">Enviado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={FileText} title="Nenhum orçamento encontrado" description="Comece criando um novo orçamento consultivo." actionLabel="Novo Orçamento" />
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(q => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium">{q.title}</TableCell>
                                    <TableCell>{customerMap[q.customer_id] || '—'}</TableCell>
                                    <TableCell><StatusBadge status={q.status} /></TableCell>
                                    <TableCell className="font-semibold">R$ {(q.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{new Date(q.created_date).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/orcamentos/${q.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button></Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}