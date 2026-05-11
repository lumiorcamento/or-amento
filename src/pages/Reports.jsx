import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DEMO_PROPOSALS, DEMO_PRODUCTS, DEMO_AI_REQUESTS } from '@/lib/demoData';

const monthlyData = [
    { mes: 'Jan', propostas: 3, valor: 890 },
    { mes: 'Fev', propostas: 5, valor: 1450 },
    { mes: 'Mar', propostas: 4, valor: 1200 },
    { mes: 'Abr', propostas: 7, valor: 2100 },
    { mes: 'Mai', propostas: 8, valor: 2750 },
];

const topProducts = [
    { name: 'Kit Criativo Infantil', usos: 12 },
    { name: 'Boneca Fada Mágica', usos: 9 },
    { name: 'Cesta Premium', usos: 7 },
    { name: 'Vela Aromática', usos: 6 },
    { name: 'Quebra-Cabeça 200 Pcs', usos: 5 },
];

const statusData = [
    { name: 'Aprovadas', value: 1, color: '#22c55e' },
    { name: 'Enviadas', value: 1, color: '#8b5cf6' },
    { name: 'Rascunho', value: 1, color: '#94a3b8' },
    { name: 'Prontas', value: 1, color: '#3b82f6' },
    { name: 'Expiradas', value: 1, color: '#f59e0b' },
];

export default function Reports() {
    const totalValue = DEMO_PROPOSALS.reduce((s, p) => s + (p.total || 0), 0);
    const avgTicket = totalValue / DEMO_PROPOSALS.length;

    const stats = [
        { label: 'Propostas geradas', value: DEMO_PROPOSALS.length, sub: 'total histórico' },
        { label: 'Valor total', value: `R$ ${totalValue.toFixed(2)}`, sub: 'em propostas' },
        { label: 'Ticket médio', value: `R$ ${avgTicket.toFixed(2)}`, sub: 'por proposta' },
        { label: 'Taxa de aprovação', value: '20%', sub: '1 de 5 aprovadas' },
        { label: 'Pedidos de IA', value: DEMO_AI_REQUESTS.length, sub: 'solicitações' },
        { label: 'Produtos no catálogo', value: DEMO_PRODUCTS.length, sub: `${DEMO_PRODUCTS.filter(p => p.ai_readiness_status === 'ready').length} prontos para IA` },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Relatórios</h2>
                <p className="text-sm text-muted-foreground">Acompanhe o desempenho das recomendações e propostas geradas.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {stats.map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                        <div className="text-xl font-bold text-foreground">{s.value}</div>
                        <div className="text-xs font-medium text-foreground mt-0.5">{s.label}</div>
                        <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly chart */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-4">Propostas por mês</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="propostas" fill="hsl(152, 35%, 28%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status pie */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-4">Status das propostas</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                        {statusData.map(s => (
                            <span key={s.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top products */}
            <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Produtos mais recomendados</h3>
                <div className="space-y-2">
                    {topProducts.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                                    <span className="text-xs text-muted-foreground">{p.usos}x</span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${(p.usos / 12) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}