import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Package, FileText, Send, CheckCircle, DollarSign, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '@/components/shared/StatCard';
import LoadingState from '@/components/shared/LoadingState';

const statusLabels = {
    draft: 'Rascunho', awaiting_review: 'Em revisão', approved: 'Aprovado',
    sent: 'Enviado', rejected: 'Rejeitado', expired: 'Expirado'
};
const PIE_COLORS = ['hsl(150,30%,30%)', 'hsl(200,50%,50%)', 'hsl(40,60%,55%)', 'hsl(0,72%,51%)', 'hsl(150,40%,50%)', 'hsl(280,40%,55%)'];

export default function Dashboard() {
    const { data: customers = [], isLoading: loadingC } = useQuery({ queryKey: ['customers'], queryFn: () => base44.entities.Customer.list() });
    const { data: products = [], isLoading: loadingP } = useQuery({ queryKey: ['products'], queryFn: () => base44.entities.Product.list() });
    const { data: quotes = [], isLoading: loadingQ } = useQuery({ queryKey: ['quotes'], queryFn: () => base44.entities.Quote.list() });
    const { data: activities = [] } = useQuery({ queryKey: ['activities'], queryFn: () => base44.entities.ActivityLog.list('-created_date', 10) });

    if (loadingC || loadingP || loadingQ) return <LoadingState />;

    const activeProducts = products.filter(p => p.active !== false).length;
    const sentQuotes = quotes.filter(q => q.status === 'sent').length;
    const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
    const approvalRate = quotes.length > 0 ? Math.round((approvedQuotes / quotes.length) * 100) : 0;
    const totalValue = quotes.reduce((s, q) => s + (q.total || 0), 0);

    const statusData = Object.entries(
        quotes.reduce((acc, q) => { acc[q.status] = (acc[q.status] || 0) + 1; return acc; }, {})
    ).map(([name, value]) => ({ name: statusLabels[name] || name, value }));

    const monthData = [
        { month: 'Jan', value: 3 }, { month: 'Fev', value: 5 }, { month: 'Mar', value: 4 },
        { month: 'Abr', value: 7 }, { month: 'Mai', value: 6 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-sm text-muted-foreground mt-1">Visão geral do sistema de orçamentos consultivos</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Clientes" value={customers.length} icon={Users} trend="+3 este mês" />
                <StatCard title="Produtos Ativos" value={activeProducts} icon={Package} />
                <StatCard title="Orçamentos" value={quotes.length} icon={FileText} />
                <StatCard title="Enviados" value={sentQuotes} icon={Send} />
                <StatCard title="Taxa de Aprovação" value={`${approvalRate}%`} icon={CheckCircle} />
                <StatCard title="Valor Total" value={`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={DollarSign} />
                <StatCard title="Última Sincronização" value="Simulada" icon={RefreshCw} />
                <StatCard title="Status IA" value="Pronta" icon={Sparkles} trend="Modo simulação" />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Orçamentos por Mês</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={monthData}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="hsl(150,30%,30%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Status dos Orçamentos</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                                        {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum orçamento ainda</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Atividades Recentes</CardTitle></CardHeader>
                <CardContent>
                    {activities.length > 0 ? (
                        <div className="space-y-3">
                            {activities.map(a => (
                                <div key={a.id} className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    <span className="text-foreground">{a.description}</span>
                                    <span className="text-muted-foreground text-xs ml-auto shrink-0">
                                        {new Date(a.created_date).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma atividade registrada ainda.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}