import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { productService } from '@/services';
import { 
    Package, Search, Plus, Loader2, AlertCircle, 
    MoreVertical, Tag
} from 'lucide-react';
import { toast } from 'sonner';

export default function StoreProducts() {
    const { currentStore } = useStoreOwner();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (currentStore) {
            loadProducts();
        }
    }, [currentStore]);

    async function loadProducts() {
        setIsLoading(true);
        try {
            const data = await productService.getProductsByStore(currentStore.id);
            setProducts(data);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar catálogo.");
        } finally {
            setIsLoading(false);
        }
    }

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-700 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Carregando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Catálogo de Produtos</h2>
                    <p className="text-sm text-gray-500 mt-1">Produtos que o assistente usa para gerar recomendações.</p>
                </div>
                <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Adicionar produto
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                        Seu catálogo está vazio ou nenhum produto corresponde à sua busca.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group relative">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden border border-gray-50">
                                {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 truncate pr-6" title={p.name}>{p.name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Tag className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{p.category || 'Geral'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-black text-green-700">R$ {p.price.toFixed(2)}</span>
                                    {!p.is_active ? (
                                        <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">Inativo</span>
                                    ) : (
                                        <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded uppercase">Ativo</span>
                                    )}
                                </div>
                            </div>
                            <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Dica:</strong> Em breve você poderá conectar sua loja (Nuvemshop, Bling, etc) para sincronizar o catálogo automaticamente. Por enquanto, os produtos acima são os que o assistente usa para atender seus clientes.
                </p>
            </div>
        </div>
    );
}