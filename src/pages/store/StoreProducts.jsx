import React, { useState, useEffect } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { productService } from '@/services';
import { 
    Package, Search, Plus, Loader2, Eye, EyeOff,
    Upload, ShoppingBag, CheckCircle2, Info, RefreshCw, Star
} from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/store/ProductForm';
import ProductCsvImport from '@/components/store/ProductCsvImport';

export default function StoreProducts() {
    const { currentStore } = useStoreOwner();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // UI States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

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

    const handleSaveProduct = async (payload) => {
        setIsActionLoading(true);
        try {
            if (editingProduct) {
                await productService.updateProduct({
                    storeId: currentStore.id,
                    productId: editingProduct.id,
                    updates: payload
                });
                toast.success("Produto atualizado!");
            } else {
                await productService.createProduct({
                    storeId: currentStore.id,
                    product: payload
                });
                toast.success("Produto criado!");
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar produto.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleImportCsv = async (csvProducts) => {
        setIsActionLoading(true);
        try {
            await productService.bulkImportProducts({
                storeId: currentStore.id,
                products: csvProducts
            });
            toast.success(`${csvProducts.length} produtos importados com sucesso!`);
            setIsImportOpen(false);
            loadProducts();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao importar CSV.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            if (product.active) {
                await productService.archiveProduct({ storeId: currentStore.id, productId: product.id });
                toast.success("Produto desativado.");
            } else {
                await productService.restoreProduct({ storeId: currentStore.id, productId: product.id });
                toast.success("Produto reativado!");
            }
            loadProducts();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao alterar status.");
        }
    };

    const stats = {
        total: products.length,
        active: products.filter(p => p.active).length,
        ready: products.filter(p => productService.calculateProductReadiness(p).status === 'ready').length,
        needsImprovement: products.filter(p => productService.calculateProductReadiness(p).status === 'needs_improvement').length,
        outOfStock: products.filter(p => p.active && p.stock_quantity <= 0).length,
        inactive: products.filter(p => !p.active).length
    };

    const filteredProducts = products.filter(p => {
        const readiness = productService.calculateProductReadiness(p);
        const matchesSearch = 
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'active') return p.active;
        if (statusFilter === 'ready') return readiness.status === 'ready';
        if (statusFilter === 'needs_improvement') return readiness.status === 'needs_improvement';
        if (statusFilter === 'out_of_stock') return p.stock_quantity <= 0 && p.active;
        if (statusFilter === 'inactive') return !p.active;
        
        return true;
    });

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
                    <h2 className="text-2xl font-bold text-gray-900">Catálogo da Loja</h2>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os produtos que a IA usará para montar orçamentos personalizados.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsImportOpen(true)}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> Importar CSV
                    </button>
                    <button 
                        onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20"
                    >
                        <Plus className="w-4 h-4" /> Novo produto
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: 'Total', value: stats.total, icon: Package, color: 'text-gray-500', bg: 'bg-gray-50' },
                    { label: 'Ativos', value: stats.active, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Prontos IA', value: stats.ready, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Melhorar', value: stats.needsImprovement, icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Sem estoque', value: stats.outOfStock, icon: ShoppingBag, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Inativos', value: stats.inactive, icon: EyeOff, color: 'text-gray-400', bg: 'bg-gray-100' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4 border border-black/5`}>
                        <div className="flex items-center gap-2 mb-1">
                            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
                        </div>
                        <p className="text-xl font-black text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome, SKU ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-600 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-600 transition-colors flex-1 lg:flex-none"
                    >
                        <option value="all">Filtrar por Status</option>
                        <option value="active">Ativos</option>
                        <option value="ready">Prontos para IA</option>
                        <option value="needs_improvement">Precisa Melhorar</option>
                        <option value="out_of_stock">Sem Estoque</option>
                        <option value="inactive">Inativos</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                        Tente ajustar seus filtros ou adicione um novo produto ao seu catálogo.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((p) => {
                        const readiness = productService.calculateProductReadiness(p);
                        return (
                            <div key={p.id} className={`bg-white border border-gray-200 rounded-3xl p-4 flex gap-4 hover:shadow-lg hover:border-gray-300 transition-all group relative ${!p.active ? 'opacity-60 grayscale' : ''}`}>
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl shrink-0 overflow-hidden border border-gray-50 group-hover:scale-105 transition-transform">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-8 h-8" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${readiness.color}`}>
                                                {readiness.label}
                                            </span>
                                            {p.source === 'demo' && <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">Demo</span>}
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 truncate pr-6" title={p.name}>{p.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.sku || 'Sem SKU'} · {p.category || 'Sem Categoria'}</p>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-black text-green-700">R$ {p.price?.toFixed(2)}</p>
                                            <p className={`text-[10px] font-bold ${p.stock_quantity > 5 ? 'text-gray-400' : 'text-red-500'}`}>Estoque: {p.stock_quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleToggleStatus(p)}
                                                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                                                title={p.active ? "Arquivar" : "Reativar"}
                                            >
                                                {p.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                                                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                                                title="Editar"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {isFormOpen && (
                <ProductForm 
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
                    isLoading={isActionLoading}
                />
            )}

            {isImportOpen && (
                <ProductCsvImport 
                    onImport={handleImportCsv}
                    onCancel={() => setIsImportOpen(false)}
                    isLoading={isActionLoading}
                />
            )}
        </div>
    );
}

function ImageIcon({ className }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}