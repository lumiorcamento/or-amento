import React, { useState } from 'react';
import { Store, Zap, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const tabs = [
    { id: 'loja', label: 'Loja', icon: Store },
    { id: 'ia', label: 'IA', icon: Zap },
    { id: 'proposta', label: 'Proposta', icon: FileText },
    { id: 'usuarios', label: 'Usuários', icon: Users },
];

function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm text-foreground">{label}</span>
            <button onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
            </button>
        </label>
    );
}

export default function Settings() {
    const { toast } = useToast();
    const [tab, setTab] = useState('loja');
    const [loja, setLoja] = useState({ name: 'Loja Demonstração', segment: 'Presentes e Brinquedos', whatsapp: '(11) 99999-9999', email: 'contato@loja.com', primaryColor: '#1f4a32' });
    const [ia, setIa] = useState({ tone: 'consultivo', detail_level: 'medio', prioritize_price: false, prioritize_margin: false, prioritize_stock: true, prioritize_premium: false });
    const [proposta, setProposta] = useState({ validity_days: 15, default_text: 'Esta é uma proposta personalizada gerada com base nas suas necessidades.', footer: 'Proposta válida por 15 dias. Sujeita à disponibilidade de estoque.', sales_name: 'Consultor Lumi Quotes' });

    const save = () => toast({ title: "Configurações salvas!", description: "Suas preferências foram atualizadas." });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Configurações</h2>
                <p className="text-sm text-muted-foreground">Personalize o comportamento da plataforma para a sua loja.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg mb-6 w-fit">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-md transition-all ${tab === t.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                        <t.icon className="w-3.5 h-3.5" />{t.label}
                    </button>
                ))}
            </div>

            <div className="max-w-xl">
                {tab === 'loja' && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm">Dados da Loja</h3>
                        {[['Nome da loja', 'name', 'Minha Loja'], ['Segmento', 'segment', 'Ex: Presentes, Moda, Eletrônicos'], ['WhatsApp', 'whatsapp', '(11) 99999-9999'], ['E-mail', 'email', 'contato@loja.com']].map(([label, key, placeholder]) => (
                            <div key={key}>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
                                <Input value={loja[key] || ''} onChange={e => setLoja(l => ({ ...l, [key]: e.target.value }))} placeholder={placeholder} className="h-9" />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Cor principal</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={loja.primaryColor} onChange={e => setLoja(l => ({ ...l, primaryColor: e.target.value }))} className="w-9 h-9 rounded-lg border border-border cursor-pointer" />
                                <span className="text-sm text-muted-foreground font-mono">{loja.primaryColor}</span>
                            </div>
                        </div>
                        <Button onClick={save} size="sm">Salvar alterações</Button>
                    </div>
                )}

                {tab === 'ia' && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm">Configurações da IA</h3>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">Tom da recomendação</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['direto', 'consultivo', 'elegante', 'tecnico', 'descontraido'].map(t => (
                                    <button key={t} onClick={() => setIa(a => ({ ...a, tone: t }))}
                                        className={`text-xs py-1.5 px-2 rounded-lg border font-medium capitalize transition-all ${ia.tone === t ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                                        {t === 'tecnico' ? 'Técnico' : t === 'descontraido' ? 'Descontraído' : t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Toggle checked={ia.prioritize_stock} onChange={v => setIa(a => ({ ...a, prioritize_stock: v }))} label="Priorizar produtos com estoque" />
                            <Toggle checked={ia.prioritize_premium} onChange={v => setIa(a => ({ ...a, prioritize_premium: v }))} label="Priorizar produtos premium" />
                            <Toggle checked={ia.prioritize_margin} onChange={v => setIa(a => ({ ...a, prioritize_margin: v }))} label="Priorizar maior margem" />
                            <Toggle checked={ia.prioritize_price} onChange={v => setIa(a => ({ ...a, prioritize_price: v }))} label="Priorizar menor preço" />
                        </div>
                        <Button onClick={save} size="sm">Salvar alterações</Button>
                    </div>
                )}

                {tab === 'proposta' && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <h3 className="font-semibold text-sm">Configurações da Proposta</h3>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Validade padrão (dias)</label>
                            <Input type="number" value={proposta.validity_days} onChange={e => setProposta(p => ({ ...p, validity_days: e.target.value }))} className="h-9" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Texto padrão</label>
                            <Textarea value={proposta.default_text} onChange={e => setProposta(p => ({ ...p, default_text: e.target.value }))} rows={3} className="resize-none text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Rodapé</label>
                            <Textarea value={proposta.footer} onChange={e => setProposta(p => ({ ...p, footer: e.target.value }))} rows={2} className="resize-none text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Nome do responsável</label>
                            <Input value={proposta.sales_name} onChange={e => setProposta(p => ({ ...p, sales_name: e.target.value }))} className="h-9" />
                        </div>
                        <Button onClick={save} size="sm">Salvar alterações</Button>
                    </div>
                )}

                {tab === 'usuarios' && (
                    <div className="bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-sm mb-4">Usuários da plataforma</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Admin Master', email: 'admin@loja.com', role: 'Proprietário' },
                                { name: 'João Silva', email: 'joao@loja.com', role: 'Consultor' },
                            ].map(u => (
                                <div key={u.email} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </div>
                                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">{u.role}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="mt-4 w-full gap-2" size="sm"><Users className="w-3.5 h-3.5" />Convidar usuário</Button>
                    </div>
                )}
            </div>
        </div>
    );
}