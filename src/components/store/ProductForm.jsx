import React, { useState, useEffect } from 'react';
import { 
    X, Save, Loader2, Package, Image as ImageIcon, 
    Tag, Target, User, Info, AlertCircle 
} from 'lucide-react';

export default function ProductForm({ product, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: 0,
        stock_quantity: 0,
        image_url: '',
        category: '',
        description: '',
        tags: '',
        target_audience: '',
        age_range: '',
        use_case: '',
        active: true
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || '')
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <p className="text-xs text-gray-500">Preencha os dados para alimentar o assistente de IA.</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-4 h-4" /> Dados principais
                            </h3>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Nome do produto *</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Kit Criativo Escolar"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">SKU / Código</label>
                                    <input 
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="Ex: KIT-001"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Categoria</label>
                                    <input 
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Ex: Papelaria"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Preço (R$)</label>
                                    <input 
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Estoque</label>
                                    <input 
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" /> URL da Imagem
                                </label>
                                <input 
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                />
                            </div>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Produto Ativo</p>
                                    <p className="text-[10px] text-gray-500">Se desmarcado, a IA não recomendará este item.</p>
                                </div>
                            </label>
                        </div>

                        {/* AI & Context Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-4 h-4" /> Inteligência e Contexto
                            </h3>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Descrição detalhada (Fundamental para a IA)</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descreva o produto, benefícios e diferenciais..."
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Tags (separadas por vírgula)
                                </label>
                                <input 
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="presente, escolar, criativo, infantil"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1 flex items-center gap-1">
                                        <User className="w-3 h-3" /> Público-alvo
                                    </label>
                                    <input 
                                        name="target_audience"
                                        value={formData.target_audience}
                                        onChange={handleChange}
                                        placeholder="Ex: Crianças"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Faixa etária</label>
                                    <input 
                                        name="age_range"
                                        value={formData.age_range}
                                        onChange={handleChange}
                                        placeholder="Ex: 6-10 anos"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">Melhor caso de uso</label>
                                <input 
                                    name="use_case"
                                    value={formData.use_case}
                                    onChange={handleChange}
                                    placeholder="Ex: Presente de aniversário"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-600 transition-colors"
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                <p className="text-[11px] text-blue-800 leading-relaxed">
                                    <strong>Dica:</strong> Quanto mais preenchidos estes campos, mais precisas serão as sugestões do assistente. A IA utiliza a descrição e as tags para entender se o produto atende ao desejo do cliente.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-green-900/20 flex items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Produto</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
