import React from 'react';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { AlertTriangle, AlertCircle, Tag, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIReadinessBadge from '@/components/shared/AIReadinessBadge';

const problems = {
    missing_description: { label: 'Sem descrição', icon: AlertCircle, impact: 'A IA pode ter dificuldade para justificar este produto.', color: 'amber', action: 'Adicionar descrição' },
    missing_category: { label: 'Sem categoria', icon: Package, impact: 'O produto pode aparecer em recomendações menos precisas.', color: 'orange', action: 'Definir categoria' },
    missing_tags: { label: 'Sem tags', icon: Tag, impact: 'Adicione público-alvo, ocasião e benefícios para melhor recomendação.', color: 'yellow', action: 'Adicionar tags' },
    out_of_stock: { label: 'Sem estoque', icon: AlertTriangle, impact: 'Produto não será recomendado automaticamente.', color: 'red', action: 'Atualizar estoque' },
};

export default function CatalogQuality() {
    const ready = DEMO_PRODUCTS.filter(p => p.ai_readiness_status === 'ready');
    const issues = DEMO_PRODUCTS.filter(p => p.ai_readiness_status !== 'ready');
    const score = Math.round((ready.length / DEMO_PRODUCTS.length) * 100);

    const counts = {};
    Object.keys(problems).forEach(k => { counts[k] = DEMO_PRODUCTS.filter(p => p.ai_readiness_status === k).length; });

    const cards = [
        { label: 'Prontos para IA', value: ready.length, icon: Zap, color: 'text-green-600 bg-green-50', border: 'border-green-200' },
        { label: 'Sem descrição', value: counts.missing_description, icon: AlertCircle, color: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
        { label: 'Sem categoria', value: counts.missing_category, icon: Package, color: 'text-orange-600 bg-orange-50', border: 'border-orange-200' },
        { label: 'Sem tags', value: counts.missing_tags, icon: Tag, color: 'text-yellow-600 bg-yellow-50', border: 'border-yellow-200' },
        { label: 'Sem estoque', value: counts.out_of_stock, icon: AlertTriangle, color: 'text-red-600 bg-red-50', border: 'border-red-200' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Qualidade do Catálogo</h2>
                <p className="text-sm text-muted-foreground">Analise quais produtos estão prontos para recomendação pela IA.</p>
            </div>

            {/* Score */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6 flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{score}%</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Pontuação de qualidade</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{ready.length} de {DEMO_PRODUCTS.length} produtos prontos para recomendação.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {score >= 80 ? "Excelente! Seu catálogo está bem preparado para a IA." :
                            score >= 60 ? "Bom, mas há oportunidades de melhoria." :
                                "Atenção: muitos produtos precisam de informações para a IA funcionar bem."}
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {cards.map(c => (
                    <div key={c.label} className={`bg-card border ${c.border} rounded-xl p-4 flex flex-col gap-2`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}>
                            <c.icon className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{c.value}</div>
                        <div className="text-xs text-muted-foreground leading-tight">{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Issues table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Produtos com problemas ({issues.length})</h3>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                        <Zap className="w-3 h-3" /> Melhorar com IA
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/30">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Produto</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Problema</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Impacto</th>
                                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map(p => {
                                const prob = problems[p.ai_readiness_status];
                                return (
                                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" /> :
                                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-muted-foreground/40" /></div>}
                                                <div>
                                                    <div className="font-medium text-foreground text-sm">{p.name}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><AIReadinessBadge status={p.ai_readiness_status} /></td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-xs text-muted-foreground max-w-xs">{prob?.impact}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5 justify-end flex-wrap">
                                                <Button size="sm" variant="outline" className="text-xs h-7">{prob?.action}</Button>
                                                <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground">Ignorar</Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}