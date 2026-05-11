import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { quoteService, buyerService } from '@/services';
import { 
    ArrowLeft, MessageSquare, Check, 
    Mail, Calendar, ShoppingBag, Loader2, AlertCircle, 
    Copy, RefreshCw, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS = { 
    sent: 'Novo', 
    in_review: 'Em análise', 
    answered: 'Respondido', 
    approved: 'Aprovado', 
    canceled: 'Cancelado', 
    lost: 'Perdido' 
};

const STATUS_COLORS = {
    sent: 'bg-blue-100 text-blue-700',
    in_review: 'bg-amber-100 text-amber-700',
    answered: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700',
    lost: 'bg-gray-100 text-gray-500',
};

export default function StoreRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentStore } = useStoreOwner();
    
    const [request, setRequest] = useState(null);
    const [buyerSummary, setBuyerSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (currentStore && id) {
            loadData();
        }
    }, [currentStore, id]);

    async function loadData() {
        setIsLoading(true);
        try {
            const data = await quoteService.getStoreQuoteRequestById({ 
                storeId: currentStore.id, 
                quoteId: id 
            });
            setRequest(data);
            
            if (data && data.buyer_user_id) {
                const summary = await buyerService.getBuyerStoreSummary({
                    storeId: currentStore.id,
                    buyerUserId: data.buyer_user_id
                });
                setBuyerSummary(summary);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar detalhes da solicitação.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateStatus(newStatus) {
        setIsUpdating(true);
        try {
            await quoteService.updateQuoteStatus({
                storeId: currentStore.id,
                quoteId: id,
                status: newStatus
            });
            setRequest(prev => ({ ...prev, status: newStatus }));
            toast.success(`Status atualizado para: ${STATUS_LABELS[newStatus]}`);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar status.");
        } finally {
            setIsUpdating(false);
        }
    }

    function generateWhatsAppLink(req, buyer) {
        if (!req || !req.customer_contact_phone) return null;
        
        const phone = req.customer_contact_phone.replace(/\D/g, '');
        const items = req.quote_items.map(i => `• ${i.products?.name || 'Produto'} x${i.quantity} — R$ ${(i.unit_price * i.quantity).toFixed(2)}`).join('\n');
        
        const text = encodeURIComponent(
            `Olá, ${req.customer_contact_name}! 👋 Aqui é da ${currentStore.name}.\n\nRecebemos sua solicitação de orçamento e separamos os produtos sugeridos:\n\n${items}\n\n*Total estimado: R$ ${req.estimated_total.toFixed(2)}*\n\nEste é um orçamento estimado. Podemos confirmar os valores e o prazo de entrega para você?\n\nDeseja prosseguir com o pedido?`
        );
        
        return `https://wa.me/${phone}?text=${text}`;
    }

    function handleCopyResponse() {
        const items = request.quote_items.map(i => `• ${i.products?.name || 'Produto'} x${i.quantity} — R$ ${(i.unit_price * i.quantity).toFixed(2)}`).join('\n');
        const text = `Olá, ${request.customer_contact_name}! 👋 Aqui é da ${currentStore.name}.\n\nRecebemos sua solicitação de orçamento:\n\n${items}\n\nTotal estimado: R$ ${request.estimated_total.toFixed(2)}\n\nConfirmaremos disponibilidade e valores finais.`;
        
        navigator.clipboard.writeText(text);
        toast.success("Resposta copiada para a área de transferência!");
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Carregando detalhes...</p>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Solicitação não encontrada</h2>
                <p className="text-gray-500 mt-2 mb-6 text-sm">Verifique o ID ou se você tem permissão para acessá-la.</p>
                <button onClick={() => navigate('/lojista/solicitacoes')} className="text-green-700 font-semibold hover:underline flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-4 h-4" /> Voltar para a lista
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/lojista/solicitacoes')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-gray-900">Solicitação #{request.id.substring(0, 8).toUpperCase()}</h1>
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[request.status]}`}>
                                {STATUS_LABELS[request.status]}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(request.created_at).toLocaleDateString('pt-BR')} às {new Date(request.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {request.quote_items.length} itens</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {request.customer_contact_phone && (
                        <a 
                            href={generateWhatsAppLink(request, buyerSummary)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                            <MessageSquare className="w-4 h-4" /> Responder no WhatsApp
                        </a>
                    )}
                    <button onClick={handleCopyResponse} className="p-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors text-gray-600" title="Copiar resposta">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-green-600" /> Produtos sugeridos
                            </h3>
                            <span className="text-sm font-bold text-green-700">Total: R$ {request.estimated_total.toFixed(2)}</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {request.quote_items.map((item, idx) => (
                                <div key={idx} className="p-6 flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0 overflow-hidden border border-gray-100">
                                        {item.products?.image_url ? (
                                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-gray-300" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.products?.name || 'Produto'}</h4>
                                            <span className="text-sm font-bold text-gray-900 ml-2 whitespace-nowrap">R$ {(item.unit_price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">Qtd: {item.quantity} · Preço unitário: R$ {item.unit_price.toFixed(2)}</p>
                                        <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                                            <p className="text-[11px] text-blue-700 italic leading-relaxed">
                                                "{item.reason || item.personalized_reason || 'Sugestão baseada no pedido.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" /> Valores sujeitos a disponibilidade.
                            </p>
                            <p className="text-lg font-black text-green-700">Total: R$ {request.estimated_total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Original Prompt Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pedido original</h3>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed italic">"{request.original_prompt}"</p>
                        </div>
                        {request.interpreted_need && (
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-2">Interpretação da IA</h4>
                                <p className="text-sm text-blue-800">{typeof request.interpreted_need === 'string' ? request.interpreted_need : JSON.stringify(request.interpreted_need)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Buyer Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Comprador</h3>
                            {buyerSummary?.isRecurringCustomer && (
                                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <RefreshCw className="w-2.5 h-2.5" /> RECORRENTE
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg">
                                {request.customer_contact_name?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{request.customer_contact_name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {request.customer_contact_email || 'Não informado'}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Contato</span>
                                <span className="text-xs font-medium text-gray-900">{request.customer_contact_phone || 'Não informado'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Pedidos nesta loja</span>
                                <span className="text-xs font-bold text-gray-900">{buyerSummary?.totalQuotes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Ticket Médio</span>
                                <span className="text-xs font-bold text-green-700">R$ {buyerSummary?.averageOrderValue?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>

                        {buyerSummary?.profile?.notes_for_ai && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Notas do Assistente</p>
                                <p className="text-xs text-gray-600 leading-relaxed italic">{buyerSummary.profile.notes_for_ai}</p>
                            </div>
                        )}
                        
                        {buyerSummary?.isRecurringCustomer && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-purple-800 leading-tight">
                                    Cliente fiel com interesse frequente em <strong>{buyerSummary.preferredCategories.slice(0, 2).join(', ') || 'categorias variadas'}</strong>.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Status Actions */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Gerenciar Status</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <button 
                                disabled={isUpdating || request.status === 'in_review'}
                                onClick={() => handleUpdateStatus('in_review')}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${request.status === 'in_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                            >
                                Em análise {request.status === 'in_review' && <Check className="w-4 h-4" />}
                            </button>
                            <button 
                                disabled={isUpdating || request.status === 'answered'}
                                onClick={() => handleUpdateStatus('answered')}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${request.status === 'answered' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                            >
                                Respondido {request.status === 'answered' && <Check className="w-4 h-4" />}
                            </button>
                            <button 
                                disabled={isUpdating || request.status === 'approved'}
                                onClick={() => handleUpdateStatus('approved')}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${request.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                            >
                                Aprovado {request.status === 'approved' && <Check className="w-4 h-4" />}
                            </button>
                            <button 
                                disabled={isUpdating || request.status === 'lost'}
                                onClick={() => handleUpdateStatus('lost')}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${request.status === 'lost' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'hover:bg-gray-50 text-gray-400 border border-transparent'}`}
                            >
                                Perdido {request.status === 'lost' && <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
