import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingState from '@/components/shared/LoadingState';

const SOURCES = { manual: 'Manual', bling: 'Bling', nuvemshop: 'Nuvemshop' };

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => { const list = await base44.entities.Product.filter({ id }); return list[0]; },
    });

    if (isLoading) return <LoadingState />;
    if (!product) return <p className="text-center py-8 text-muted-foreground">Produto não encontrado.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/catalogo"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
                <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-center">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="max-w-full h-48 object-contain rounded" />
                        ) : (
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="w-12 h-12 text-muted-foreground" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle className="text-sm">Informações do Produto</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-muted-foreground">Preço:</span><p className="font-semibold text-lg">R$ {(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
                        <div><span className="text-muted-foreground">Custo:</span><p className="font-semibold">R$ {(product.cost_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
                        <div><span className="text-muted-foreground">Estoque:</span><p className="font-semibold">{product.stock_quantity ?? 'N/A'}</p></div>
                        <div><span className="text-muted-foreground">Categoria:</span><p><Badge variant="secondary">{product.category || 'N/A'}</Badge></p></div>
                        <div><span className="text-muted-foreground">Origem:</span><p>{SOURCES[product.source] || 'Manual'}</p></div>
                        <div><span className="text-muted-foreground">Status:</span><p><Badge variant={product.active !== false ? 'default' : 'secondary'}>{product.active !== false ? 'Ativo' : 'Inativo'}</Badge></p></div>
                        {product.description && <div className="col-span-2"><span className="text-muted-foreground">Descrição:</span><p className="mt-1">{product.description}</p></div>}
                        {product.technical_specs && <div className="col-span-2"><span className="text-muted-foreground">Especificações Técnicas:</span><pre className="mt-1 text-xs bg-muted p-3 rounded">{product.technical_specs}</pre></div>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}