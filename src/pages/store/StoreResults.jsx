import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DEMO_QUOTE_REQUESTS } from '@/lib/demoData';

const monthData = [
    { mes: 'Fev', solicitacoes: 3, valor: 1200 },
    { mes: 'Mar', solicitacoes: 5, valor: 2400 },
    { mes: 'Abr', solicitacoes: 4, valor: 1800 },
    { mes: 'Mai', solicitacoes: DEMO_QUOTE_REQUESTS.length, valor: DEMO_QUOTE_REQUESTS.reduce((s, r) => s + r.estimatedTotal, 0) },
];

const topProducts = [
    { name: 'Kit Criativo Infantil', vezes: 8 },
    { name: 'Kit Revenda Utilidades', vezes: 6 },
    { name: 'Caneca Personalizada', vezes: 5 },
    { name: 'Vela Aromática Luxo', vezes: 4 },
    { name: 'Pelúcia Urso Premium', vezes: 3 },
];

export default function StoreResults() {
    const total = DEMO_QUOTE_REQUESTS.reduce((s, r) => s + r.estimatedTotal, 0);
    const approved = DEMO_QUOTE_REQUESTS.filter(r => r.status === 'approved').length;

    const stats = [
        { label: 'Solicitações recebidas', value: DEMO_QUOTE_REQUESTS.length },
        { label: 'Aprovadas', value: approved },
        { label: 'Valor estimado', value: `R$ ${total.toFixed(0)}` },
        { label: 'Taxa de aprovação', value: `${Math.round((approved / DEMO_QUOTE_REQUESTS.length) * 100)}%` },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Resultados</h2>
                <p className="text-sm text-gray-500">Acompanhe o desempenho do assistente de orçamentos.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {stats.map(s => (
                    <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4">
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-sm text-gray-800 mb-4">Solicitações por mês</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={monthData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="solicitacoes" fill="#15803d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-sm text-gray-800 mb-4">Produtos mais sugeridos</h3>
                    <div className="space-y-3">
                        {topProducts.map((p, i) => (
                            <div key={p.name} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-3">{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-700">{p.name}</span>
                                        <span className="text-xs text-gray-400">{p.vezes}x</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full">
                                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${(p.vezes / 8) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-gray-800 mb-4">Pedidos mais comuns</h3>
                <div className="space-y-2">
                    {DEMO_QUOTE_REQUESTS.map(r => (
                        <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{r.createdAt}</span>
                            <p className="text-xs text-gray-700 leading-relaxed">"{r.originalPrompt}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}