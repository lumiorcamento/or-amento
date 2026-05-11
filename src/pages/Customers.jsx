import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import LoadingState from '@/components/shared/LoadingState';
import { toast } from 'sonner';

export default function Customers() {
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', company_name: '', notes: '' });
    const qc = useQueryClient();

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: () => base44.entities.Customer.list('-created_date'),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => editing
            ? base44.entities.Customer.update(editing.id, data)
            : base44.entities.Customer.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customers'] });
            setShowDialog(false);
            setEditing(null);
            setForm({ name: '', email: '', phone: '', company_name: '', notes: '' });
            toast.success(editing ? 'Cliente atualizado!' : 'Cliente cadastrado!');
        },
    });

    const filtered = customers.filter(c =>
        [c.name, c.email, c.phone].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    );

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, email: c.email || '', phone: c.phone || '', company_name: c.company_name || '', notes: c.notes || '' });
        setShowDialog(true);
    };

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', email: '', phone: '', company_name: '', notes: '' });
        setShowDialog(true);
    };

    if (isLoading) return <LoadingState />;

    return (
        <div className="space-y-6">
            <PageHeader title="Clientes" subtitle="Gerencie seus clientes e seus orçamentos consultivos.">
                <Button onClick={openNew} size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Novo Cliente</Button>
            </PageHeader>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome, e-mail ou telefone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="Nenhum cliente encontrado" description="Cadastre seu primeiro cliente para criar orçamentos consultivos." actionLabel="Novo Cliente" onAction={openNew} icon={Plus} />
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell>{c.phone || '—'}</TableCell>
                                    <TableCell>{c.email || '—'}</TableCell>
                                    <TableCell>{c.company_name || '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link to={`/clientes/${c.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button></Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                                            <Link to={`/novo-orcamento?cliente=${c.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><FileText className="w-4 h-4" /></Button></Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle></DialogHeader>
                    <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
                        <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>E-mail</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        </div>
                        <div><Label>Empresa</Label><Input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} /></div>
                        <div><Label>Observações</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                        <Button type="submit" className="w-full" disabled={saveMutation.isPending}>{editing ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}