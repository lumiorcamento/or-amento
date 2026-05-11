import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DEMO_FINAL_CUSTOMERS } from '@/lib/demoData';
import { Users, Plus, Search, Phone, Mail, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmptyState from '@/components/shared/EmptyState';
import { useToast } from '@/components/ui/use-toast';

export default function FinalCustomers() {
    const { toast } = useToast();
    const qc = useQueryClient();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

    const { data: dbCustomers = [] } = useQuery({
        queryKey: ['final-customers'],
        queryFn: () => base44.entities.FinalCustomer.list('-created_date', 50),
    });

    const { data: proposals = [] } = useQuery({
        queryKey: ['proposals-for-customers'],
        queryFn: () => base44.entities.Proposal.list('-created_date', 200),
    });

    // Count proposals per final_customer_id or final_customer_name
    const proposalCountById = proposals.reduce((acc, p) => {
        const key = p.final_customer_id || p.final_customer_name;
        if (key) acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    function getProposalCount(c) {
        return proposalCountById[c.id] || proposalCountById[c.name] || 0;
    }

    const createMutation = useMutation({
        mutationFn: data => base44.entities.FinalCustomer.create(data),
        onSuccess: () => {
            qc.invalidateQueries(['final-customers']);
            toast({ title: "Cliente adicionado!" });
            setOpen(false);
            setForm({ name: '', phone: '', email: '', notes: '' });
        }
    });

    const all = [...DEMO_FINAL_CUSTOMERS, ...dbCustomers];
    const filtered = all.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Clientes Finais</h2>
                    <p className="text-sm text-muted-foreground">{all.length} clientes · Informação opcional nas propostas</p>
                </div>
                <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" />Novo cliente</Button>
            </div>

            <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..." className="pl-9 h-9" />
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Users} title="Nenhum cliente encontrado" description="Adicione clientes para organizar melhor suas propostas. Lembre-se: o cliente é opcional." actionLabel="Adicionar cliente" onAction={() => setOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c, i) => (
                        <div key={c.id || i} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                    {c.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                                        {getProposalCount(c) > 1 ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                                                <RefreshCw className="w-2.5 h-2.5" />Recorrente
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0">
                                                <Star className="w-2.5 h-2.5" />Novo
                                            </span>
                                        )}
                                    </div>
                                    {c.notes && <p className="text-xs text-muted-foreground line-clamp-1">{c.notes}</p>}
                                </div>
                            </div>
                            {c.phone && <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Phone className="w-3 h-3" />{c.phone}</div>}
                            {c.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Mail className="w-3 h-3" />{c.email}</div>}
                            {getProposalCount(c) > 0 && (
                                <p className="text-[11px] text-muted-foreground mt-1">{getProposalCount(c)} proposta{getProposalCount(c) !== 1 ? 's' : ''} enviada{getProposalCount(c) !== 1 ? 's' : ''}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Novo cliente final</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div><label className="text-xs font-medium text-muted-foreground block mb-1">Nome *</label>
                            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" className="h-9" /></div>
                        <div><label className="text-xs font-medium text-muted-foreground block mb-1">WhatsApp</label>
                            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-9999" className="h-9" /></div>
                        <div><label className="text-xs font-medium text-muted-foreground block mb-1">E-mail</label>
                            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" className="h-9" /></div>
                        <div><label className="text-xs font-medium text-muted-foreground block mb-1">Observações</label>
                            <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Preferências, contexto..." className="h-9" /></div>
                        <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={!form.name.trim() || createMutation.isPending}>
                            {createMutation.isPending ? 'Salvando...' : 'Salvar cliente'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}