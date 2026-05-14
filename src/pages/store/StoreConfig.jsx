import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { storeService } from '@/services';
import { Save, Loader2, Sparkles, AlertCircle,
    MessageSquare, Target
} from 'lucide-react';
import { toast } from 'sonner';

export default function StoreConfig() {
    const { currentStore } = useStoreOwner();
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currentStore) {
            loadConfig();
        }
    }, [currentStore]);

    async function loadConfig() {
        setIsLoading(true);
        try {
            const data = await storeService.getStoreConfig(currentStore.id);
            setConfig(data);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar configurações.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        setIsSaving(true);
        try {
            await storeService.updateStoreConfig(currentStore.id, config);
            toast.success("Configurações salvas!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar configurações.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Carregando configurações...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Configurar Assistente</h2>
                    <p className="text-sm text-gray-500 mt-1">Ajuste como a IA deve se comportar com seus clientes.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-green-700/20 flex items-center gap-2 disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar alterações</>}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Personality */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-700">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Personalidade e Tom</h3>
                            <p className="text-xs text-gray-500">Defina o estilo de comunicação da IA.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider ml-1">Tom de voz</label>
                            <select 
                                value={config?.tone_voice || 'consultative'}
                                onChange={e => setConfig(prev => ({ ...prev, tone_voice: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                            >
                                <option value="professional">Profissional e Direto</option>
                                <option value="friendly">Amigável e Casual</option>
                                <option value="consultative">Consultivo e Especialista</option>
                                <option value="enthusiastic">Entusiasta e Vendedor</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider ml-1">Objetivo principal</label>
                            <textarea 
                                value={config?.ai_goal || ''}
                                onChange={e => setConfig(prev => ({ ...prev, ai_goal: e.target.value }))}
                                placeholder="Ex: Ajudar clientes a escolherem os melhores kits para presente, focando em sofisticação."
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Business Rules */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Regras de Recomendação</h3>
                            <p className="text-xs text-gray-500">Como a IA deve priorizar os produtos.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={config?.prioritize_stock || false}
                                onChange={e => setConfig(prev => ({ ...prev, prioritize_stock: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Priorizar Estoque</p>
                                <p className="text-[10px] text-gray-500">Sugere produtos com mais itens.</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={config?.prioritize_margin || false}
                                onChange={e => setConfig(prev => ({ ...prev, prioritize_margin: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Focar em Margem</p>
                                <p className="text-[10px] text-gray-500">Sugere produtos mais rentáveis.</p>
                            </div>
                        </label>
                    </div>

                    <div className="mt-6">
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider ml-1">Valor mínimo de orçamento</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                            <input 
                                type="number"
                                value={config?.min_order_value || 0}
                                onChange={e => setConfig(prev => ({ ...prev, min_order_value: parseFloat(e.target.value) }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Final Message */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Finalização</h3>
                            <p className="text-xs text-gray-500">O que o cliente vê ao concluir.</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider ml-1">Mensagem de encerramento</label>
                        <textarea 
                            value={config?.final_message || ''}
                            onChange={e => setConfig(prev => ({ ...prev, final_message: e.target.value }))}
                            placeholder="Ex: Obrigado por escolher a nossa loja! Entraremos em contato em breve."
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors resize-none"
                        />
                    </div>
                </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-amber-800">Personalização Ativa</p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Estas configurações são aplicadas imediatamente ao assistente da sua loja. Lembre-se que a IA também usa o histórico individual de cada comprador para refinar as sugestões.
                    </p>
                </div>
            </div>
        </div>
    );
}