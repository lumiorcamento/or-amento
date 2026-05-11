import React, { useState } from 'react';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { Search, Package, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AIReadinessBadge from '@/components/shared/AIReadinessBadge';
import EmptyState from '@/components/shared/EmptyState';

const CATEGORIES = ['Todas', ...Array.from(new Set(DEMO_PRODUCTS.map(p => p.category).filter(Boolean)))];
const SOURCES = ['Todas', 'demo', 'manual', 'bling', 'nuvemshop', 'csv'];
const sourceLabels = { demo: 'Demo', manual: 'Manual', bling: 'Bling', nuvemshop: 'Nuvemshop', csv: 'CSV' };
const sourceColors = { demo: 'bg-blue-100 text-blue-700', manual: 'bg-gray-100 text-gray-600', bling: 'bg-purple-100 text-purple-700', nuvemshop: 'bg-green-100 text-green-700', csv: 'bg-amber-100 text-amber-700' };

export default function Catalog() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');
    const [source, setSource] = useState('Todas');
    const [readiness, setReadiness] = useState('all');

    const filtered = DEMO_PRODUCTS.filter(p => {
        const s = search.toLowerCase();
        const matchSearch = !s || p.name.toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s);
        const matchCat = category === 'Todas' || p.category === category;
        const matchSrc = source === 'Todas' || p.source === source;
        const matchReady = readiness === 'all' || p.ai_readiness_status === readiness;
        return matchSearch && matchCat && matchSrc && matchReady;
    });

    const readyCount = DEMO_PRODUCTS.filter(p => p.ai_readiness_status === 'ready').length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Catálogo</h2>
                    <p className="text-sm text-muted-foreground">{DEMO_PRODUCTS.length} produtos · {readyCount} prontos para IA</p>
                </div>
                <Button className="gap-2" variant="outline"><Plus className="w-4 h-4" />Adicionar produto</Button>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, SKU ou categoria..." className="pl-9 h-9" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {['all', 'ready', 'missing_description', 'missing_category', 'missing_tags', 'out_of_stock'].map(r => (
                        <button key={r} onClick={() => setReadiness(r)}
                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${readiness === r ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                            {r === 'all' ? 'Todos status' : { ready: 'Pronto IA', missing_description: 'Sem descrição', missing_category: 'Sem categoria', missing_tags: 'Sem tags', out_of_stock: 'Sem estoque' }[r]}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Package} title="Nenhum produto encontrado" description="Tente ajustar os filtros de busca." />
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/30">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Produto</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Categoria</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Preço</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Estoque</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Origem</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status IA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? (
                                                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                        <Package className="w-4 h-4 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-foreground">{p.name}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{p.category || '—'}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-primary">R$ {p.price?.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                                            <span className={`text-xs font-medium ${p.stock_quantity > 0 ? 'text-foreground' : 'text-red-500'}`}>{p.stock_quantity}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sourceColors[p.source] || 'bg-gray-100 text-gray-600'}`}>
                                                {sourceLabels[p.source] || p.source}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><AIReadinessBadge status={p.ai_readiness_status} /></td>
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