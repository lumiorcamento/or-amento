import React, { useState } from 'react';
import { ShoppingBag, FileSpreadsheet, Package, ArrowRight, Plug, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const OPTIONS = [
    {
        id: 'nuvemshop', icon: ShoppingBag, title: 'Conectar Nuvemshop',
        description: 'Importe automaticamente seus produtos, preços e estoque diretamente da sua loja Nuvemshop.',
        status: 'planned', badge: 'Em breve',
        badgeClass: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'bling', title: 'Conectar Bling', icon: Package,
        description: 'Sincronize produtos do seu ERP Bling para manter o catálogo sempre atualizado e com estoque real.',
        status: 'planned', badge: 'Em breve',
        badgeClass: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'csv', title: 'Importar planilha (CSV)', icon: FileSpreadsheet,
        description: 'Envie uma planilha Excel com seus produtos. É a forma mais rápida de começar hoje.',
        status: 'available', badge: 'Disponível',
        badgeClass: 'bg-green-100 text-green-700',
    },
    {
        id: 'manual', title: 'Cadastro manual', icon: Package,
        description: 'Cadastre seus produtos um a um diretamente no painel. Ideal para catálogos pequenos.',
        status: 'available', badge: 'Disponível',
        badgeClass: 'bg-green-100 text-green-700',
    },
];

export default function StoreConnect() {
    const [active, setActive] = useState('demo');

    function handleAction(id) {
        if (id === 'manual' || id === 'csv') {
            toast.info("Funcionalidade de importação manual sendo finalizada.");
        } else {
            toast.info("Esta integração será liberada na próxima fase.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Conectar Loja</h2>
                    <p className="text-sm text-gray-500 mt-1">Escolha de onde vêm os seus produtos e integre o assistente ao seu fluxo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                {OPTIONS.map(opt => (
                    <div key={opt.id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                                <opt.icon className="w-6 h-6 text-gray-400 group-hover:text-green-700 transition-colors" />
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${opt.badgeClass}`}>{opt.badge}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{opt.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-6">{opt.description}</p>
                        <button 
                            onClick={() => handleAction(opt.id)}
                            disabled={opt.status === 'planned'}
                            className={`w-full text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${opt.status === 'planned' 
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100' 
                                : 'bg-gray-900 hover:bg-black text-white'
                            }`}
                        >
                            {opt.status === 'planned' ? 'Em breve' : <>Configurar conexão <ArrowRight className="w-3.5 h-3.5" /></>}
                        </button>
                    </div>
                ))}
            </div>

            {/* How it works banner */}
            <div className="mt-8 bg-gradient-to-br from-[#0a1a12] to-[#1a3a28] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-green-900/10">
                <div className="relative z-10 max-w-xl">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Plug className="w-5 h-5 text-green-400" /> Fluxo de Integração
                    </h3>
                    <p className="text-green-100/70 text-sm mb-6 leading-relaxed">
                        O Lumi se integra à sua loja existente para que você não precise mudar nada no seu dia a dia. Seus clientes ganham uma experiência de compra personalizada e você recebe orçamentos prontos.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-3 text-[10px] font-bold uppercase tracking-widest items-center">
                        <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">Sua Loja</span>
                        <ArrowRight className="w-3 h-3 text-green-500" />
                        <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">Botão de Orçamento</span>
                        <ArrowRight className="w-3 h-3 text-green-500" />
                        <span className="bg-green-600 px-3 py-1.5 rounded-lg shadow-lg">Lumi Assistente</span>
                        <ArrowRight className="w-3 h-3 text-green-500" />
                        <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">Venda Pronta</span>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Integração Customizada:</strong> Se você usa um sistema próprio ou precisa de uma integração específica, entre em contato com nosso suporte técnico para uma solução personalizada.
                </p>
            </div>
        </div>
    );
}