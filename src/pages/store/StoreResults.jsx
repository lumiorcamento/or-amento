import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { quoteService } from '@/services';
import { 
    BarChart2, TrendingUp, ShoppingBag, DollarSign, Loader2, ArrowUpRight,
    PieChart, Activity
} from 'lucide-react';

export default function StoreResults() {
    const { currentStore } = useStoreOwner();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentStore) {
            loadStats();
        }
    }, [currentStore]);

    async function loadStats() {
        setIsLoading(true);
        try {
            const requests = await quoteService.getStoreQuoteRequests(currentStore.id);
            
            const totalValue = requests.reduce((sum, r) => sum + r.estimated_total, 0);
            const approved = requests.filter(r => r.status === 'approved');
            const approvedValue = approved.reduce((sum, r) => sum + r.estimated_total, 0);
            
            setStats({
                totalRequests: requests.length,
                totalEstimatedValue: totalValue,
                averageTicket: requests.length > 0 ? totalValue / requests.length : 0,
                approvedCount: approved.length,
                conversionRate: requests.length > 0 ? (approved.length / requests.length) * 100 : 0,
                approvedValue
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Calculando resultados...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Resultados e Métricas</h2>
                    <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho do seu assistente de vendas.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-green-600" /> Atualizado agora
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <ArrowUpRight className="w-2.5 h-2.5" /> 12%
                        </span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Solicitações</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{stats?.totalRequests || 0}</p>
                    <p className="text-[11px] text-gray-400 mt-2">Total de orçamentos gerados</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <ArrowUpRight className="w-2.5 h-2.5" /> 8%
                        </span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor Estimado</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">R$ {stats?.totalEstimatedValue?.toFixed(2) || '0.00'}</p>
                    <p className="text-[11px] text-gray-400 mt-2">Volume total em negociação</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ticket Médio</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">R$ {stats?.averageTicket?.toFixed(2) || '0.00'}</p>
                    <p className="text-[11px] text-gray-400 mt-2">Valor médio por solicitação</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-green-600" /> Funil de Conversão
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                                <span>Solicitações Aprovadas</span>
                                <span>{stats?.approvedCount || 0} de {stats?.totalRequests || 0}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-600 transition-all duration-1000" 
                                    style={{ width: `${stats?.conversionRate || 0}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 italic">Taxa de conversão: {stats?.conversionRate?.toFixed(1) || 0}%</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Faturamento Aprovado</p>
                                <p className="text-xl font-black text-green-700 mt-1">R$ {stats?.approvedValue?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Aguardando Resposta</p>
                                <p className="text-xl font-black text-amber-600 mt-1">R$ {(stats?.totalEstimatedValue - stats?.approvedValue || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BarChart2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Mais métricas em breve</h4>
                    <p className="text-xs text-gray-500 mt-2 max-w-[240px]">
                        Estamos preparando relatórios detalhados sobre categorias mais buscadas e horários de maior pico.
                    </p>
                    <button disabled className="mt-6 text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-xl opacity-50">
                        Exportar Relatório (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}