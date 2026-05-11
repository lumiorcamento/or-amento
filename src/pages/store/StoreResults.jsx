import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { quoteService, productService } from '@/services';
import { 
    BarChart2, ShoppingBag, 
    DollarSign, Loader2, ArrowUpRight,
    PieChart, Activity, Star, Info, Package
} from 'lucide-react';

export default function StoreResults() {
    const { currentStore } = useStoreOwner();
    const [stats, setStats] = useState(null);
    const [catalogStats, setCatalogStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentStore) {
            loadData();
        }
    }, [currentStore]);

    async function loadData() {
        setIsLoading(true);
        try {
            const requests = await quoteService.getStoreQuoteRequests(currentStore.id);
            const products = await productService.getProductsByStore(currentStore.id);
            
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

            const ready = products.filter(p => productService.calculateProductReadiness(p).status === 'ready').length;
            const needsImprovement = products.filter(p => productService.calculateProductReadiness(p).status === 'needs_improvement').length;

            setCatalogStats({
                total: products.length,
                readyCount: ready,
                needsImprovementCount: needsImprovement,
                qualityRate: products.length > 0 ? (ready / products.length) * 100 : 0
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
                    <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho do seu assistente e a qualidade do catálogo.</p>
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

                <div className="bg-[#0a1a12] border border-white/5 rounded-3xl p-6 shadow-xl shadow-green-900/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/20">
                            <Star className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Qualidade Catálogo</p>
                    <p className="text-3xl font-black text-white mt-1">{catalogStats?.qualityRate?.toFixed(1) || 0}%</p>
                    <p className="text-[11px] text-white/30 mt-2">Produtos prontos para a IA recomendar</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Funnel */}
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
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Ticket Médio</p>
                                <p className="text-xl font-black text-gray-900 mt-1">R$ {stats?.averageTicket?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catalog Quality */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-amber-600" /> Saúde do Catálogo
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-bold text-green-900">Produtos Prontos IA</span>
                            </div>
                            <span className="text-lg font-black text-green-900">{catalogStats?.readyCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-amber-600" />
                                <span className="text-sm font-bold text-amber-900">Precisam Melhorar</span>
                            </div>
                            <span className="text-lg font-black text-amber-900">{catalogStats?.needsImprovementCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">Total no Catálogo</span>
                            </div>
                            <span className="text-lg font-black text-gray-900">{catalogStats?.total || 0}</span>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[11px] text-blue-800 leading-relaxed italic">
                                <strong>Dica:</strong> Produtos com descrições longas, tags e público-alvo definido têm 3x mais chances de serem recomendados corretamente pela IA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2({ className }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}