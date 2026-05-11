import React from 'react';
import { Plus, Info, Zap, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RecommendationCard({ product, onAdd, added }) {
    const score = product.compatibility_score || 0;
    const scoreColor = score >= 90 ? 'text-green-600 bg-green-50' : score >= 75 ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

    return (
        <div className={cn(
            "bg-card border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md",
            added ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
        )}>
            {/* Image */}
            <div className="h-36 bg-muted overflow-hidden relative">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-10 h-10 opacity-30" />
                    </div>
                )}
                <div className={cn("absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full", scoreColor)}>
                    <Zap className="w-3 h-3 inline mr-0.5" />{score}%
                </div>
                {added && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Adicionado</div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground leading-snug">{product.name}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1 font-mono">{product.sku}</p>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{product.category}</span>
                    <span className="text-xs text-muted-foreground">{product.stock_quantity} em estoque</span>
                </div>
                <p className="text-lg font-bold text-primary mb-2">R$ {product.price?.toFixed(2)}</p>

                {product.reason && (
                    <div className="bg-accent/50 rounded-lg p-2.5 mb-3">
                        <p className="text-[11px] text-accent-foreground leading-relaxed">
                            <Info className="w-3 h-3 inline mr-1 text-primary" />
                            {product.reason}
                        </p>
                    </div>
                )}

                <Button
                    size="sm"
                    className="w-full"
                    variant={added ? "outline" : "default"}
                    onClick={() => onAdd(product)}
                    disabled={added}
                >
                    {added ? '✓ Adicionado' : <><Plus className="w-3 h-3 mr-1" />Adicionar à proposta</>}
                </Button>
            </div>
        </div>
    );
}