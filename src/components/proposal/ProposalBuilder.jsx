import React, { useState } from 'react';
import { ArrowLeft, Save, FileText, MessageSquare, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProposalPreview from './ProposalPreview';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function ProposalBuilder({ items, prompt, recommendation, onReset, onBack }) {
    const { toast } = useToast();
    const [tab, setTab] = useState('form'); // form | preview
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        title: `Proposta — ${new Date().toLocaleDateString('pt-BR')}`,
        final_customer_name: '',
        final_customer_phone: '',
        final_customer_email: '',
        discount: 0,
        validity_days: 15,
        notes: '',
    });

    const subtotal = items.reduce((s, i) => s + (i.total || 0), 0);
    const total = subtotal - (parseFloat(form.discount) || 0);

    const proposal = {
        ...form,
        items,
        subtotal,
        total,
        summary: recommendation?.summary || '',
        commercial_text: recommendation?.commercialText || '',
        original_prompt: prompt,
    };

    async function handleSave() {
        await base44.entities.Proposal.create({
            title: form.title,
            original_prompt: prompt,
            summary: proposal.summary,
            commercial_text: proposal.commercial_text,
            status: 'ready',
            subtotal,
            discount: parseFloat(form.discount) || 0,
            total,
            validity_days: form.validity_days,
            notes: form.notes,
            items: items,
            final_customer_name: form.final_customer_name || null,
            final_customer_phone: form.final_customer_phone || null,
            final_customer_email: form.final_customer_email || null,
        });
        setSaved(true);
        toast({ title: "Proposta salva com sucesso!", description: "Acesse em Propostas para ver o histórico." });
    }

    function handleCopyWhatsapp() {
        const text = `Olá! Separei algumas opções que combinam com o que você procura.\n\n*${form.title}*\n\n${recommendation?.commercialText || 'Aqui estão os produtos selecionados para você:'}\n\n${items.map(i => `• ${i.product_name} — R$ ${i.unit_price?.toFixed(2)}`).join('\n')}\n\n*Total: R$ ${total.toFixed(2)}*\n\nProposta válida por ${form.validity_days} dias. Entre em contato para mais informações!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Mensagem copiada!" });
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Step bar */}
            <div className="flex items-center gap-0 mb-6 max-w-sm mx-auto">
                {['Pedido', 'Recomendações', 'Proposta'].map((label, i) => (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                            <span className={`text-[10px] font-medium ${i === 2 ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                        </div>
                        {i < 2 && <div className="h-[2px] flex-1 mb-4 bg-primary" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setTab(tab === 'form' ? 'preview' : 'form')}>
                        <FileText className="w-3.5 h-3.5" />{tab === 'form' ? 'Pré-visualizar' : 'Editar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyWhatsapp} className="gap-1">
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado!' : 'WhatsApp'}
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saved} className="gap-1">
                        <Save className="w-3.5 h-3.5" />{saved ? 'Salvo!' : 'Salvar proposta'}
                    </Button>
                </div>
            </div>

            {tab === 'preview' ? (
                <ProposalPreview proposal={proposal} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-sm mb-3">Detalhes da Proposta</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground font-medium block mb-1">Título</label>
                                    <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="text-sm h-8" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-muted-foreground font-medium block mb-1">Desconto (R$)</label>
                                        <Input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} className="text-sm h-8" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-medium block mb-1">Validade (dias)</label>
                                        <Input type="number" value={form.validity_days} onChange={e => setForm(f => ({ ...f, validity_days: parseInt(e.target.value) }))} className="text-sm h-8" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground font-medium block mb-1">Observações</label>
                                    <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="text-sm resize-none" placeholder="Observações adicionais..." />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-sm mb-1">Cliente Final <span className="text-xs font-normal text-muted-foreground ml-1">— opcional</span></h3>
                            <p className="text-xs text-muted-foreground mb-3">A proposta pode ser gerada sem cliente cadastrado.</p>
                            <div className="space-y-2">
                                <Input value={form.final_customer_name} onChange={e => setForm(f => ({ ...f, final_customer_name: e.target.value }))} placeholder="Nome" className="text-sm h-8" />
                                <Input value={form.final_customer_phone} onChange={e => setForm(f => ({ ...f, final_customer_phone: e.target.value }))} placeholder="WhatsApp" className="text-sm h-8" />
                                <Input value={form.final_customer_email} onChange={e => setForm(f => ({ ...f, final_customer_email: e.target.value }))} placeholder="E-mail" className="text-sm h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Products + Summary */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-sm mb-3">Produtos Selecionados ({items.length})</h3>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                        {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded object-cover shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product_name}</p>
                                            {item.reason && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.reason}</p>}
                                        </div>
                                        <div className="text-sm font-semibold text-primary shrink-0">R$ {item.unit_price?.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border mt-3 pt-3 space-y-1">
                                <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                                {form.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Desconto</span><span>- R$ {parseFloat(form.discount).toFixed(2)}</span></div>}
                                <div className="flex justify-between font-bold text-foreground"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
                            </div>
                        </div>

                        {recommendation?.commercialText && (
                            <div className="bg-accent/40 border border-primary/20 rounded-xl p-4">
                                <h3 className="font-semibold text-sm mb-2">Texto Comercial (gerado pela IA)</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{recommendation.commercialText}</p>
                            </div>
                        )}

                        <Button variant="outline" className="w-full gap-2" onClick={onReset}>
                            <RotateCcw className="w-4 h-4" /> Nova recomendação
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}