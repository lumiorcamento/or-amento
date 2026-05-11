import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { quoteService } from '@/services';
import { 
    MessageSquare, 
    Loader2, Search, ChevronRight, ShoppingBag,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '@/lib/supabase';
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

export default function StoreRequests() {
    const { currentStore } = useStoreOwner();
    const navigate = useNavigate();
    
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (currentStore) {
            loadRequests();
        }
    }, [currentStore]);

    async function loadRequests() {
        setIsLoading(true);
        try {
            const data = await quoteService.getStoreQuoteRequests(currentStore.id);
            setRequests(data);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar solicitações.");
        } finally {
            setIsLoading(false);
        }
    }

    const filteredRequests = requests.filter(r => {
        const matchesSearch = 
            r.customer_contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    function openWhatsApp(req) {
        if (!req.customer_contact_phone) {
            toast.info("Este cliente não forneceu número de WhatsApp.");
            return;
        }
        
        const phone = req.customer_contact_phone.replace(/\D/g, '');
        const text = encodeURIComponent(
            `Olá, ${req.customer_contact_name}! 👋 Recebemos sua solicitação de orçamento #${req.id.substring(0, 5).toUpperCase()} na ${currentStore.name}.\n\nPodemos conversar sobre os produtos que você precisa?`
        );
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-medium">Carregando solicitações...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Solicitações recebidas</h2>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os orçamentos criados pelo assistente de IA.</p>
                </div>
                {!isSupabaseConfigured() && (
                    <span className="self-start text-[10px] bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full border border-amber-200">MODO DEMO ATIVO</span>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
                >
                    <option value="all">Todos os status</option>
                    <option value="sent">Novos</option>
                    <option value="in_review">Em análise</option>
                    <option value="answered">Respondidos</option>
                    <option value="approved">Aprovados</option>
                    <option value="lost">Perdidos</option>
                </select>
            </div>

            {filteredRequests.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhuma solicitação encontrada</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                        {searchTerm || statusFilter !== 'all' 
                            ? 'Tente ajustar seus filtros para encontrar o que procura.' 
                            : 'As solicitações criadas pelos seus clientes no assistente aparecerão aqui.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Pedido</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredRequests.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/lojista/solicitacoes/${r.id}`)}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{r.customer_contact_name}</span>
                                                <span className="text-[10px] text-gray-400 font-mono mt-0.5">#{r.id.substring(0, 8).toUpperCase()}</span>
                                                <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-xs text-gray-600 line-clamp-2 max-w-xs italic">"{r.original_prompt}"</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-green-700">R$ {r.estimated_total.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_COLORS[r.status]}`}>
                                                {STATUS_LABELS[r.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => openWhatsApp(r)}
                                                    className="p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl transition-colors"
                                                    title="Responder no WhatsApp"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/lojista/solicitacoes/${r.id}`)}
                                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}