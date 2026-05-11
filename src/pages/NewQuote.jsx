import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronLeft, ChevronRight, Sparkles, Trash2, FileDown, Save } from 'lucide-react';
import { toast } from 'sonner';
import LoadingState from '@/components/shared/LoadingState';
import QuotePreview from '@/components/quote/QuotePreview';

const STEPS = [
    { label: 'Cliente', key: 'client' },
    { label: 'Briefing', key: 'briefing' },
    { label: 'Produtos', key: 'products' },
    { label: 'Recomendação IA', key: 'ai' },
    { label: 'Revisão', key: 'review' },
    { label: 'Prévia / PDF', key: 'preview' },
];

export default function NewQuote() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [briefing, setBriefing] = useState({ title: '', objective: '', customer_profile: '', budget_range: '', preferences: '', restrictions: '', urgency: 'media', notes: '' });
    const [selectedItems, setSelectedItems] = useState([]);
    const [aiGenerated, setAiGenerated] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [commercialText, setCommercialText] = useState('');
    const [discount, setDiscount] = useState(0);
    const [productSearch, setProductSearch] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const preselectedClient = urlParams.get('cliente');

    useEffect(() => { if (preselectedClient) setSelectedCustomerId(preselectedClient); }, [preselectedClient]);

    const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: () => base44.entities.Customer.list() });
    const { data: products = [], isLoading: loadingProducts } = useQuery({ queryKey: ['products'], queryFn: () => base44.entities.Product.list() });

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const activeProducts = products.filter(p => p.active !== false);
    const filteredProducts = activeProducts.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase()));

    const subtotal = selectedItems.reduce((s, item) => s + (item.unit_price * item.quantity), 0);
    const total = subtotal - discount;

    const addProduct = (product) => {
        if (selectedItems.find(i => i.product_id === product.id)) return;
        setSelectedItems([...selectedItems, {
            product_id: product.id, product_name: product.name, quantity: 1,
            unit_price: product.price, total: product.price, ai_reason: '', priority: 'media', notes: ''
        }]);
    };

    const removeItem = (productId) => setSelectedItems(selectedItems.filter(i => i.product_id !== productId));
    const updateItemQty = (productId, qty) => {
        setSelectedItems(selectedItems.map(i => i.product_id === productId ? { ...i, quantity: qty, total: i.unit_price * qty } : i));
    };

    const generateAI = () => {
        const items = selectedItems.length > 0 ? selectedItems : activeProducts.slice(0, 5).map(p => ({
            product_id: p.id, product_name: p.name, quantity: 1, unit_price: p.price, total: p.price, ai_reason: '', priority: 'media', notes: ''
        }));
        const reasons = [
            'Produto ideal para o perfil e necessidades identificadas no briefing.',
            'Excelente custo-benefício para o orçamento disponível.',
            'Alta demanda e ótima avaliação de clientes anteriores.',
            'Complementa os demais itens selecionados de forma estratégica.',
            'Recomendação técnica baseada nas especificações do briefing.',
        ];
        const priorities = ['alta', 'alta', 'media', 'media', 'baixa'];
        const enriched = items.map((item, i) => ({
            ...item,
            ai_reason: reasons[i % reasons.length],
            priority: priorities[i % priorities.length],
        }));
        setSelectedItems(enriched);
        setAiSummary('Com base no briefing e no perfil do cliente, selecionamos os produtos que melhor atendem às necessidades identificadas, priorizando qualidade e custo-benefício dentro da faixa de orçamento indicada.');
        setCommercialText(`Prezado(a) ${selectedCustomer?.name || 'Cliente'},\n\nApresentamos nossa proposta consultiva personalizada, elaborada com base nas suas necessidades e preferências. Cada item foi cuidadosamente selecionado para oferecer a melhor solução possível.\n\nEstamos à disposição para esclarecer qualquer dúvida.`);
        setAiGenerated(true);
        toast.success('Recomendação IA gerada com sucesso! (simulação)');
    };

    const saveMutation = useMutation({
        mutationFn: async (status) => {
            const quoteData = {
                customer_id: selectedCustomerId,
                title: briefing.title || `Orçamento - ${selectedCustomer?.name || 'Cliente'}`,
                status,
                subtotal,
                discount,
                total,
                ai_summary: aiSummary,
                commercial_text: commercialText,
                validity_days: 15,
                notes: briefing.notes,
                items: selectedItems,
            };
            const created = await base44.entities.Quote.create(quoteData);
            if (briefing.title) {
                await base44.entities.Briefing.create({
                    customer_id: selectedCustomerId, title: briefing.title, objective: briefing.objective,
                    customer_profile: briefing.customer_profile, budget_range: briefing.budget_range,
                    preferences: briefing.preferences, restrictions: briefing.restrictions,
                    urgency: briefing.urgency, notes: briefing.notes,
                });
            }
            return created;
        },
        onSuccess: () => { toast.success('Orçamento salvo!'); navigate('/orcamentos'); },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {STEPS.map((s, i) => (
                    <button key={s.key} onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${i === step ? 'bg-primary text-primary-foreground font-medium' : i < step ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center border">{i < step ? <Check className="w-3 h-3" /> : i + 1}</span>
                        {s.label}
                    </button>
                ))}
            </div>

            {step === 0 && (
                <Card>
                    <CardHeader><CardTitle>Selecione o Cliente</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                            <SelectTrigger><SelectValue placeholder="Escolha um cliente..." /></SelectTrigger>
                            <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.company_name ? `- ${c.company_name}` : ''}</SelectItem>)}</SelectContent>
                        </Select>
                        {selectedCustomer && (
                            <div className="p-4 bg-muted rounded-lg text-sm space-y-1">
                                <p className="font-medium">{selectedCustomer.name}</p>
                                {selectedCustomer.email && <p className="text-muted-foreground">{selectedCustomer.email}</p>}
                                {selectedCustomer.phone && <p className="text-muted-foreground">{selectedCustomer.phone}</p>}
                                {selectedCustomer.company_name && <p className="text-muted-foreground">{selectedCustomer.company_name}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 1 && (
                <Card>
                    <CardHeader><CardTitle>Briefing Consultivo</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label>Título do Orçamento *</Label><Input value={briefing.title} onChange={e => setBriefing({ ...briefing, title: e.target.value })} placeholder="Ex: Proposta para Kit Premium" /></div>
                        <div><Label>Objetivo da Compra</Label><Textarea value={briefing.objective} onChange={e => setBriefing({ ...briefing, objective: e.target.value })} placeholder="O que o cliente busca?" /></div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><Label>Perfil do Cliente</Label><Input value={briefing.customer_profile} onChange={e => setBriefing({ ...briefing, customer_profile: e.target.value })} /></div>
                            <div><Label>Faixa de Orçamento</Label><Input value={briefing.budget_range} onChange={e => setBriefing({ ...briefing, budget_range: e.target.value })} placeholder="Ex: R$ 5.000 - R$ 10.000" /></div>
                        </div>
                        <div><Label>Preferências</Label><Textarea value={briefing.preferences} onChange={e => setBriefing({ ...briefing, preferences: e.target.value })} /></div>
                        <div><Label>Restrições</Label><Textarea value={briefing.restrictions} onChange={e => setBriefing({ ...briefing, restrictions: e.target.value })} /></div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label>Urgência</Label>
                                <Select value={briefing.urgency} onValueChange={v => setBriefing({ ...briefing, urgency: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baixa">Baixa</SelectItem>
                                        <SelectItem value="media">Média</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                        <SelectItem value="urgente">Urgente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div><Label>Observações</Label><Textarea value={briefing.notes} onChange={e => setBriefing({ ...briefing, notes: e.target.value })} /></div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <div className="grid lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Catálogo de Produtos</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <Input placeholder="Buscar produto..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                            {loadingProducts ? <LoadingState /> : (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div>
                                                <p className="text-sm font-medium">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.sku} • R$ {(p.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <Button size="sm" variant={selectedItems.find(i => i.product_id === p.id) ? 'secondary' : 'default'} onClick={() => addProduct(p)} disabled={!!selectedItems.find(i => i.product_id === p.id)}>
                                                {selectedItems.find(i => i.product_id === p.id) ? 'Adicionado' : 'Adicionar'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Itens Selecionados ({selectedItems.length})</CardTitle></CardHeader>
                        <CardContent>
                            {selectedItems.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Nenhum produto selecionado.</p> : (
                                <div className="space-y-2">
                                    {selectedItems.map(item => (
                                        <div key={item.product_id} className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product_name}</p>
                                                <p className="text-xs text-muted-foreground">R$ {item.unit_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <Input type="number" min={1} value={item.quantity} onChange={e => updateItemQty(item.product_id, Number(e.target.value))} className="w-16 h-8 text-center" />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.product_id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t text-right text-sm font-semibold">Subtotal: R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {step === 3 && (
                <Card>
                    <CardHeader><CardTitle>Recomendação com IA</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-accent rounded-lg text-sm space-y-2">
                            <p className="font-medium text-accent-foreground">Fluxo seguro da IA</p>
                            <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
                                <li>Backend filtra produtos reais do catálogo</li>
                                <li>IA recebe lista curta de produtos válidos</li>
                                <li>IA responde JSON estruturado</li>
                                <li>Sistema valida o retorno</li>
                                <li>Você revisa antes de salvar</li>
                            </ol>
                            <Badge variant="secondary" className="mt-2">Modo: Simulação</Badge>
                        </div>
                        {!aiGenerated ? (
                            <Button onClick={generateAI} className="gap-1.5 w-full"><Sparkles className="w-4 h-4" /> Gerar Recomendação com IA</Button>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg"><p className="text-sm font-medium mb-1">Resumo da IA:</p><p className="text-sm text-muted-foreground">{aiSummary}</p></div>
                                <div className="space-y-2">
                                    {selectedItems.map(item => (
                                        <div key={item.product_id} className="p-3 border rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium">{item.product_name}</p>
                                                <Badge variant="secondary" className="text-xs capitalize">{item.priority}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.ai_reason}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" onClick={generateAI} className="gap-1.5"><Sparkles className="w-4 h-4" /> Regenerar Recomendação</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 4 && (
                <Card>
                    <CardHeader><CardTitle>Revisão do Orçamento</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Cliente:</span><p className="font-medium">{selectedCustomer?.name || '—'}</p></div>
                            <div><span className="text-muted-foreground">Título:</span><p className="font-medium">{briefing.title || '—'}</p></div>
                            {briefing.objective && <div className="sm:col-span-2"><span className="text-muted-foreground">Objetivo:</span><p>{briefing.objective}</p></div>}
                        </div>
                        <div className="space-y-2">
                            {selectedItems.map(item => (
                                <div key={item.product_id} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="flex-1"><p className="text-sm font-medium">{item.product_name}</p><p className="text-xs text-muted-foreground">{item.ai_reason}</p></div>
                                    <Input type="number" min={1} value={item.quantity} onChange={e => updateItemQty(item.product_id, Number(e.target.value))} className="w-16 h-8" />
                                    <span className="text-sm font-semibold w-28 text-right">R$ {(item.unit_price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.product_id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t">
                            <Label className="shrink-0">Desconto (R$):</Label>
                            <Input type="number" min={0} step={0.01} value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-32" />
                            <div className="ml-auto text-right"><p className="text-sm text-muted-foreground">Subtotal: R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p><p className="text-lg font-bold">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 5 && (
                <div className="space-y-4">
                    <QuotePreview customer={selectedCustomer} briefing={briefing} items={selectedItems} subtotal={subtotal} discount={discount} total={total} aiSummary={aiSummary} commercialText={commercialText} />
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => saveMutation.mutate('draft')} variant="outline" className="gap-1.5" disabled={saveMutation.isPending}><Save className="w-4 h-4" /> Salvar Rascunho</Button>
                        <Button onClick={() => saveMutation.mutate('approved')} className="gap-1.5" disabled={saveMutation.isPending}><Check className="w-4 h-4" /> Marcar como Aprovado</Button>
                        <Button variant="outline" className="gap-1.5" onClick={() => toast.success('PDF gerado com sucesso! (simulação)')}><FileDown className="w-4 h-4" /> Gerar PDF</Button>
                        <Button variant="outline" className="gap-1.5" onClick={() => toast.success('Proposta enviada com sucesso! (simulação)')}><ChevronRight className="w-4 h-4" /> Enviar Proposta</Button>
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)} className="gap-1"><ChevronLeft className="w-4 h-4" /> Anterior</Button>
                <Button disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)} className="gap-1">Próximo <ChevronRight className="w-4 h-4" /></Button>
            </div>
        </div>
    );
}