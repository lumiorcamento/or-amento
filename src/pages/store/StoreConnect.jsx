import React, { useState } from 'react';
import { ShoppingBag, FileSpreadsheet, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OPTIONS = [
    {
        id: 'nuvemshop', icon: ShoppingBag, title: 'Conectar Nuvemshop',
        description: 'Importe automaticamente seus produtos, preços e estoque diretamente da sua loja.',
        status: 'planned', badge: 'Em breve',
        badgeClass: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'bling', title: 'Conectar Bling', icon: Package,
        description: 'Sincronize produtos do seu ERP Bling para manter o catálogo sempre atualizado.',
        status: 'planned', badge: 'Em breve',
        badgeClass: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'csv', title: 'Importar planilha', icon: FileSpreadsheet,
        description: 'Envie uma planilha CSV ou Excel com seus produtos. Fácil e rápido.',
        status: 'available', badge: 'Disponível',
        badgeClass: 'bg-green-100 text-green-700',
    },
    {
        id: 'demo', title: 'Usar produtos de demonstração', icon: Package,
        description: 'Use os 30 produtos de exemplo para testar o assistente agora mesmo.',
        status: 'active', badge: 'Ativo',
        badgeClass: 'bg-blue-100 text-blue-700',
    },
];

export default function StoreConnect() {
    const { toast } = useToast();
    const [active, setActive] = useState('demo');

    function handleAction(id) {
        if (id === 'demo' || id === 'csv') {
            setActive(id);
            toast({ title: `${id === 'demo' ? 'Produtos de demonstração' : 'Planilha'} selecionada!`, description: "O assistente já está usando esses dados." });
        } else {
            toast({ title: "Em breve!", description: "Esta integração estará disponível em uma próxima versão." });
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Conectar loja</h2>
                <p className="text-sm text-gray-500">Escolha de onde vêm os seus produtos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                {OPTIONS.map(opt => (
                    <div key={opt.id} className={`bg-white border rounded-2xl p-5 transition-all ${active === opt.id ? 'border-green-500 shadow-sm' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <opt.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${opt.badgeClass}`}>{opt.badge}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{opt.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{opt.description}</p>
                        <button onClick={() => handleAction(opt.id)}
                            className={`w-full text-sm font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${active === opt.id ? 'bg-green-100 text-green-700 border border-green-300' :
                                    opt.status === 'planned' ? 'bg-gray-100 text-gray-400 cursor-default' :
                                        'bg-gray-900 hover:bg-gray-800 text-white'
                                }`}>
                            {active === opt.id ? <><CheckCircle className="w-4 h-4" /> Selecionado</> :
                                opt.status === 'planned' ? 'Em breve' :
                                    <>Selecionar <ArrowRight className="w-3.5 h-3.5" /></>}
                        </button>
                    </div>
                ))}
            </div>

            {/* Nuvemshop flow concept */}
            <div className="mt-8 bg-gradient-to-r from-[#1a3a28] to-[#2d6a4a] rounded-2xl p-6 text-white max-w-2xl">
                <h3 className="font-bold text-base mb-1">Como funciona com a Nuvemshop</h3>
                <p className="text-green-200 text-sm mb-4">O cliente da sua loja clica no botão de orçamento e é direcionado para este assistente.</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs items-center">
                    {['Loja Nuvemshop', '→', 'Botão "Criar orçamento com IA"', '→', 'Este assistente', '→', 'Cliente envia', '→', 'Você recebe'].map((s, i) => (
                        <span key={i} className={s === '→' ? 'text-green-400 font-bold' : 'bg-white/10 px-2.5 py-1 rounded-full text-green-100'}>{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}