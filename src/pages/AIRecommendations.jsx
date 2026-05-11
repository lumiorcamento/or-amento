import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, CheckCircle, XCircle, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import PageHeader from '@/components/shared/PageHeader';

export default function AIRecommendations() {
    const { data: recommendations = [] } = useQuery({
        queryKey: ['ai-recommendations'],
        queryFn: () => base44.entities.AIRecommendation.list('-created_date'),
    });

    const accepted = recommendations.filter(r => r.status === 'accepted').length;
    const rejected = recommendations.filter(r => r.status === 'rejected').length;
    const rate = recommendations.length > 0 ? Math.round((accepted / recommendations.length) * 100) : 0;

    const flowSteps = [
        { label: 'Backend filtra produtos reais', desc: 'Apenas produtos ativos e com estoque' },
        { label: 'IA recebe lista curta', desc: 'Produtos pré-filtrados pelo sistema' },
        { label: 'IA responde JSON estruturado', desc: 'Formato validado automaticamente' },
        { label: 'Sistema valida retorno', desc: 'Verifica IDs e preços reais' },
        { label: 'Usuário revisa', desc: 'Revisão humana obrigatória' },
        { label: 'Orçamento é salvo', desc: 'Dados finais confirmados' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="IA / Recomendações" subtitle="Acompanhe as recomendações geradas pela inteligência artificial simulada." />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Geradas" value={recommendations.length} icon={Sparkles} />
                <StatCard title="Aceitas" value={accepted} icon={CheckCircle} />
                <StatCard title="Rejeitadas" value={rejected} icon={XCircle} />
                <StatCard title="Taxa de Aceitação" value={`${rate}%`} icon={BarChart3} />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Fluxo Seguro da IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0">
                            {flowSteps.map((step, i) => (
                                <div key={i} className="flex items-start gap-3 pb-4 last:pb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{i + 1}</div>
                                        {i < flowSteps.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Badge variant="secondary" className="mt-4">Modo: Simulação — IA real será integrada futuramente</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-sm">Recomendações Recentes</CardTitle></CardHeader>
                    <CardContent>
                        {recommendations.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma recomendação gerada ainda. Crie um orçamento para gerar recomendações.</p>
                        ) : (
                            <div className="space-y-3">
                                {recommendations.slice(0, 10).map(r => (
                                    <div key={r.id} className="flex items-start justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">{r.summary?.substring(0, 80)}...</p>
                                            <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_date).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}