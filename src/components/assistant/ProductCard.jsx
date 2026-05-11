import React from 'react';
import { Plus, Minus, Trash2, Package } from 'lucide-react';

export default function ProductCard({ item, onUpdateQty, onRemove }) {
    const subtotal = item.price * item.quantity;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
            {/* Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Reason */}
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{item.reason}</p>

                {/* Price + Qty */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <button onClick={() => onUpdateQty(item.id, -1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-700 transition-colors">
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-700 transition-colors">
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">R$ {item.price.toFixed(2)} / un.</p>
                        <p className="text-sm font-bold text-green-700">R$ {subtotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}