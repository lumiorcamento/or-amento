import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Trash2, Edit2, Save, Loader2 } from 'lucide-react';
import { useBuyer } from '@/lib/BuyerContext';
import { useStore } from '@/lib/StoreContext';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '@/services';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BuyerPreferences() {
    const { buyer, buyerProfile, isBuyerAuthenticated, isLoadingBuyer, refreshBuyerProfile } = useBuyer();
    const { store, isLoadingStore, storeSlug } = useStore();
    const navigate = useNavigate();
    
    const [editing, setEditing] = useState(false);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isLoadingBuyer && !isBuyerAuthenticated) {
            navigate(`/s/${storeSlug}/login`);
        }
    }, [isBuyerAuthenticated, isLoadingBuyer, storeSlug, navigate]);

    useEffect(() => {
        if (buyerProfile) {
            setNotes(buyerProfile.notes_for_ai || buyerProfile.notesForAI || '');
        }
    }, [buyerProfile]);

    async function handleSave() {
        if (!isSupabaseConfigured()) {
            toast.info('Modo demonstração: preferências não salvas permanentemente.');
            setEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await buyerService.updateBuyerPreferences({
                storeId: store.id,
                buyerUserId: buyer.id,
                preferences: { notes_for_ai: notes }
            });
            await refreshBuyerProfile(store.id);
            setEditing(false);
            toast.success('Preferências atualizadas!');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao salvar preferências.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleClear() {
        if (!isSupabaseConfigured()) {
            toast.success('Histórico limpo (Modo Demo)');
            return;
        }

        const confirm = window.confirm("Isso irá limpar seu perfil de personalização nesta loja (faixa de preço, categorias preferidas, etc). Seus orçamentos enviados continuarão salvos. Deseja continuar?");
        if (!confirm) return;

        setIsLoading(true);
        try {
            await buyerService.clearBuyerPersonalization({
                storeId: store.id,
                buyerUserId: buyer.id
            });
            await refreshBuyerProfile(store.id);
            setNotes('');
            toast.success('Suas preferências de personalização foram limpas.');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao limpar preferências.');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoadingStore || isLoadingBuyer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
            </div>
        );
    }

    if (!buyer || !store) return null;

    const profile = buyerProfile || buyer.profile || {};
    const primaryColor = store?.primary_color || store?.primaryColor || '#1f4a32';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate(`/s/${storeSlug}/orcamento`)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 leading-none">{store.name}</p>
                        <p className="font-semibold text-sm text-gray-800 leading-tight">Minhas preferências</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Minhas preferências</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Veja e ajuste o que usamos para personalizar suas sugestões nesta loja.</p>
                </div>

                {/* Profile data */}
                <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
                    <div className="px-4 py-3">
                        <p className="text-xs font-semibold text-gray-400 mb-0.5">Nome</p>
                        <p className="text-sm font-medium text-gray-800">{buyer.name}</p>
                    </div>
                    {buyer.email && (
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">E-mail</p>
                            <p className="text-sm text-gray-800">{buyer.email}</p>
                        </div>
                    )}
                    {buyer.phone && (
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">WhatsApp</p>
                            <p className="text-sm text-gray-800">{buyer.phone}</p>
                        </div>
                    )}
                    {(profile.preferred_budget_range || profile.preferredBudgetRange) && (
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">Faixa de orçamento comum</p>
                            <p className="text-sm text-gray-800">{profile.preferred_budget_range || profile.preferredBudgetRange}</p>
                        </div>
                    )}
                    {(profile.preferred_categories || profile.preferredCategories)?.length > 0 && (
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-400 mb-1.5">Categorias preferidas</p>
                            <div className="flex flex-wrap gap-1.5">
                                {(profile.preferred_categories || profile.preferredCategories).map(c => (
                                    <span key={c} className="text-xs bg-green-100 text-green-700 font-medium px-2.5 py-0.5 rounded-full">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {(profile.average_order_value > 0) && (
                        <div className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">Ticket médio nesta loja</p>
                            <p className="text-sm text-gray-800">R$ {parseFloat(profile.average_order_value).toFixed(2)}</p>
                        </div>
                    )}
                </div>

                {/* Notes for AI */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">O que usamos para personalizar suas sugestões</p>
                        <button onClick={() => setEditing(e => !e)} className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1 font-medium">
                            <Edit2 className="w-3 h-3" /> {editing ? 'Cancelar' : 'Editar'}
                        </button>
                    </div>
                    {editing ? (
                        <div>
                            <textarea 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                rows={3}
                                disabled={isLoading}
                                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 resize-none" 
                            />
                            <button 
                                onClick={handleSave} 
                                disabled={isLoading}
                                className="mt-2 flex items-center gap-1.5 text-sm font-medium bg-green-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Salvar</>}
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {notes || <span className="text-gray-400 italic">Nenhuma preferência registrada ainda. Quanto mais você usar o assistente, mais personalizado fica.</span>}
                        </p>
                    )}
                </div>

                {/* How it's used */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-800 leading-relaxed">
                    ℹ️ Essas informações são específicas desta loja. Usamos apenas para deixar suas sugestões mais úteis. Você pode editar ou limpar quando quiser.
                </div>

                {/* Consent status */}
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-800">Personalização ativada nesta loja</p>
                        <p className="text-xs text-gray-400 mt-0.5">Suas buscas anteriores ajudam a refinar as sugestões</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors ${profile.consent_to_personalization || profile.consentToPersonalization ? 'bg-green-600' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-all ${profile.consent_to_personalization || profile.consentToPersonalization ? 'ml-5' : 'ml-0.5'}`} />
                    </div>
                </div>

                {/* Clear preferences */}
                <button 
                    onClick={handleClear}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Limpar perfil de personalização</>}
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed pb-4">
                    Ao limpar, seu histórico de comportamento nesta loja será reiniciado para a IA. Seus orçamentos anteriores continuarão salvos no histórico.
                </p>
            </main>
        </div>
    );
}