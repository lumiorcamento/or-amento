import React, { useState } from 'react';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { Search, Package } from 'lucide-react';

const STATUS_CONFIG = {
    ready: { label: 'Pronto para IA', className: 'bg-green-100 text-green-700' },
    missing_description: { label: 'Precisa melhorar', className: 'bg-amber-100 text-amber-700' },
    missing_category: { label: 'Precisa melhorar', className: 'bg-amber-100 text-amber-700' },
    missing_tags: { label: 'Precisa melhorar', className: 'bg-amber-100 text-amber-700' },
    out_of_stock: { label: 'Sem estoque', className: 'bg-red-100 text-red-600' },
};

export default function StoreProducts() {
    const [search, setSearch] = useState('');
    const filtered = DEMO_PRODUCTS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || '').toLowerCase().includes(search.toLowerCase()));
    const readyCount = DEMO_PRODUCTS.filter(p => p.ai_readiness_status === 'ready' && p.stock_quantity > 0).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
                    <p className="text-sm text-gray-500">{DEMO_PRODUCTS.length} produtos · {readyCount} prontos para a IA sugerir</p>
                </div>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500" />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Produto</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Categoria</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Preço</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Estoque</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => {
                                const sc = STATUS_CONFIG[p.ai_readiness_status] || STATUS_CONFIG.ready;
                                return (
                                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> :
                                                        <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                                                </div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{p.category || '—'}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-green-700">R$ {p.price.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                                            <span className={`text-xs font-medium ${p.stock_quantity > 0 ? 'text-gray-700' : 'text-red-500'}`}>{p.stock_quantity}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sc.className}`}>{sc.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}