import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DEMO_PROPOSALS } from '@/lib/demoData';
import { FileText, Plus, Copy, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import LoadingState from '@/components/shared/LoadingState';
import ProposalPreview from '@/components/proposal/ProposalPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function Proposals() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [preview, setPreview] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: dbProposals = [], isLoading } = useQuery({
        queryKey: ['proposals'],
        queryFn: () => base44.entities.Proposal.list('-created_date', 50),
    });

    const allProposals = [...DEMO_PROPOSALS, ...dbProposals];
    const statusOptions = ['all', 'draft', 'ready', 'sent', 'approved', 'rejected', 'expired'];

    const filtered = allProposals.filter(p => {
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.original_prompt?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    function handleCopyWhatsapp(p) {
        const text = `Olá! Preparei uma proposta especial para você.\n\n*${p.title}*\n${p.commercial_text || ''}\n\n${(p.items || []).map(i => `• ${i.product_name} — R$ ${i.unit_price?.toFixed(2)}`).join('\n')}\n\n*Total: R$ ${p.total?.toFixed(2)}*\n\nPropostal válida por ${p.validity_days || 15} dias!`;
        navigator.clipboard.writeText(text);
        toast({ title: "Mensagem copiada para área de transferência!" });
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Propostas</h2>
                    <p className="text-sm text-muted-foreground">{allProposals.length} propostas no total</p>
                </div>
                <Link to="/"><Button className="gap-2"><Plus className="w-4 h-4" />Nova proposta com IA</Button></Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar proposta..." className="pl-9 h-9" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {statusOptions.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                            {s === 'all' ? 'Todas' : { draft: 'Rascunho', ready: 'Pronta', sent: 'Enviada', approved: 'Aprovada', rejected: 'Recusada', expired: 'Expirada' }[s]}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? <LoadingState /> : filtered.length === 0 ? (
                <EmptyState icon={FileText} title="Nenhuma proposta encontrada" description="Gere sua primeira proposta usando a IA." actionLabel="Gerar com IA" onAction={() => window.location.href = '/'} />
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/30">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground">Proposta</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground hidden md:table-cell">Cliente</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground hidden lg:table-cell">Pedido original</th>
                                    <th className="text-right px-4 py-3 font-semibold text-xs text-muted-foreground">Valor</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={p.id || i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-foreground">{p.title}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{p.created_date ? new Date(p.created_date).toLocaleDateString('pt-BR') : '—'}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-sm">{p.final_customer_name || <span className="italic text-xs">Sem cliente</span>}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-xs text-muted-foreground line-clamp-1">{p.original_prompt || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-primary">R$ {p.total?.toFixed(2)}</td>
                                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 justify-end">
                                                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setPreview(p)} title="Visualizar">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleCopyWhatsapp(p)} title="Copiar WhatsApp">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Preview Dialog */}
            <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Pré-visualização da Proposta</DialogTitle></DialogHeader>
                    {preview && <ProposalPreview proposal={preview} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}