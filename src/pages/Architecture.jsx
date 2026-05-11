import React from 'react';
import { ShoppingBag, LogIn, Store, Package, MessageSquare, Zap, Eye, FileText, ArrowDown, Check, AlertCircle } from 'lucide-react';

const flowSteps = [
    { icon: ShoppingBag, label: 'Nuvemshop / Link externo', color: 'bg-blue-100 text-blue-600 border-blue-200', desc: 'Ponto de entrada do lojista' },
    { icon: LogIn, label: 'Cadastro / Login', color: 'bg-purple-100 text-purple-600 border-purple-200', desc: 'Autenticação segura' },
    { icon: Store, label: 'Workspace da loja', color: 'bg-indigo-100 text-indigo-600 border-indigo-200', desc: 'Ambiente personalizado do lojista' },
    { icon: Package, label: 'Catálogo sincronizado', color: 'bg-cyan-100 text-cyan-600 border-cyan-200', desc: 'Produtos reais da loja' },
    { icon: MessageSquare, label: 'Pedido em linguagem natural', color: 'bg-amber-100 text-amber-600 border-amber-200', desc: 'Lojista descreve o que precisa' },
    { icon: Zap, label: 'Filtro + IA recomenda', color: 'bg-green-100 text-green-600 border-green-200', desc: 'Apenas produtos existentes, com justificativas' },
    { icon: Eye, label: 'Lojista revisa', color: 'bg-orange-100 text-orange-600 border-orange-200', desc: 'Controle humano sempre presente' },
    { icon: FileText, label: 'Proposta / PDF', color: 'bg-rose-100 text-rose-600 border-rose-200', desc: 'Documento profissional gerado' },
];

const principles = [
    { icon: Check, label: 'IA não inventa produtos', desc: 'Todas as recomendações usam apenas produtos reais do catálogo cadastrado.', ok: true },
    { icon: Check, label: 'Lojista sempre revisa', desc: 'A IA sugere, mas o lojista tem controle total para aceitar, remover ou editar.', ok: true },
    { icon: Check, label: 'Cliente final é opcional', desc: 'Propostas podem ser geradas sem cadastro de cliente. Ele é apenas informação extra.', ok: true },
    { icon: Check, label: 'Catálogo precisa estar bem preenchido', desc: 'Quanto mais informações nos produtos (tags, descrição, categoria), melhores as recomendações.', ok: true },
    { icon: AlertCircle, label: 'Integração real será implementada', desc: 'Bling e Nuvemshop estão em modo simulado. A implementação real virá na próxima fase.', ok: false },
];

const components = [
    { label: 'Organização', desc: 'Dados da loja, configurações e identidade visual' },
    { label: 'Produto', desc: 'Catálogo com origem, estoque, tags e status de prontidão IA' },
    { label: 'Pedido IA', desc: 'Prompt original + intenções detectadas + status' },
    { label: 'Proposta', desc: 'Itens selecionados, textos comerciais, cliente final e totais' },
    { label: 'Cliente Final', desc: 'Destinatário da proposta — campo opcional' },
    { label: 'Integração', desc: 'Status de conexão com Nuvemshop, Bling, PDF e WhatsApp' },
];

export default function Architecture() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Arquitetura do Sistema</h2>
                <p className="text-sm text-muted-foreground">Como o Lumi Quotes funciona por dentro.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Flow */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-4">Fluxo principal</h3>
                    <div className="space-y-0">
                        {flowSteps.map((step, i) => (
                            <div key={step.label}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${step.color} shrink-0`}>
                                        <step.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                                {i < flowSteps.length - 1 && (
                                    <div className="ml-4 my-1"><ArrowDown className="w-3 h-3 text-muted-foreground/40" /></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Principles */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-sm mb-4">Princípios do sistema</h3>
                        <div className="space-y-3">
                            {principles.map(p => (
                                <div key={p.label} className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${p.ok ? 'bg-green-100' : 'bg-amber-100'}`}>
                                        <p.icon className={`w-3 h-3 ${p.ok ? 'text-green-600' : 'text-amber-600'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{p.label}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entities */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-sm mb-4">Entidades de dados</h3>
                        <div className="space-y-2">
                            {components.map(c => (
                                <div key={c.label} className="flex items-start gap-2">
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono shrink-0">{c.label}</span>
                                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-r from-[#1f4a32] to-[#2d6a4a] rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Status atual do MVP</h3>
                <p className="text-green-200 text-sm mb-4">Versão base funcional com dados simulados — pronta para demonstração.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Interface', status: '✓ Completo' },
                        { label: 'IA Simulada', status: '✓ Ativo' },
                        { label: 'Bling', status: '⧖ Planejado' },
                        { label: 'Nuvemshop', status: '⧖ Planejado' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-xs text-green-200">{s.label}</p>
                            <p className="text-sm font-semibold mt-0.5">{s.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}