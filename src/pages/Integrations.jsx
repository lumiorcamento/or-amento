import React, { useState } from 'react';
import { ShoppingBag, Zap, FileText, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const integrations = [
    {
        id: 'nuvemshop', icon: ShoppingBag, name: 'Nuvemshop',
        description: 'Entrada futura para o lojista acessar a ferramenta pelo painel da loja e sincronizar dados da loja (produtos, preços, estoque).',
        status: 'not_connected', color: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600', actions: [
            { label: 'Conectar Nuvemshop', variant: 'default' },
            { label: 'Simular conexão', variant: 'outline' },
        ]
    },
    {
        id: 'bling', icon: ({ className }) => <span className={`font-bold text-purple-600 text-sm ${className}`}>B</span>, name: 'Bling ERP',
        description: 'Fonte futura de produtos, preços e estoque para recomendações confiáveis. Sincronização automática de catálogo.',
        status: 'not_connected', color: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600', actions: [
            { label: 'Conectar Bling', variant: 'default' },
            { label: 'Simular sincronização', variant: 'outline' },
        ]
    },
    {
        id: 'ai', icon: Zap, name: 'Motor de IA',
        description: 'Motor que interpreta pedidos em linguagem natural e recomenda apenas produtos reais do catálogo com justificativas.',
        status: 'simulated', color: 'bg-green-50 border-green-200',
        iconColor: 'text-green-600', actions: [
            { label: 'Testar IA', variant: 'outline' },
        ]
    },
    {
        id: 'pdf', icon: FileText, name: 'Geração de PDF',
        description: 'Geração de propostas comerciais profissionais com logo, produtos, preços e identidade da loja.',
        status: 'simulated', color: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600', actions: [
            { label: 'Pré-visualizar modelo', variant: 'outline' },
        ]
    },
    {
        id: 'whatsapp', icon: MessageSquare, name: 'WhatsApp',
        description: 'Futuro envio direto de proposta ou cópia de mensagem formatada para atendimento pelo WhatsApp Business.',
        status: 'planned', color: 'bg-gray-50 border-gray-200',
        iconColor: 'text-gray-500', actions: [
            { label: 'Copiar mensagem simulada', variant: 'outline' },
        ]
    },
];

const statusConfig = {
    not_connected: { icon: XCircle, label: 'Não conectado', className: 'text-gray-400' },
    connected: { icon: CheckCircle, label: 'Conectado', className: 'text-green-600' },
    simulated: { icon: CheckCircle, label: 'Simulação ativa', className: 'text-blue-600' },
    planned: { icon: Clock, label: 'Planejado', className: 'text-amber-500' },
};

export default function Integrations() {
    const { toast } = useToast();
    const [states, setStates] = useState({});

    function handleAction(id, label) {
        if (label.startsWith('Simular') || label.startsWith('Conectar')) {
            setStates(s => ({ ...s, [id]: 'simulated' }));
            toast({ title: `${label} simulado com sucesso!`, description: "Esta é uma demonstração. A integração real será implementada em breve." });
        } else if (label === 'Testar IA') {
            window.location.href = '/';
        } else {
            toast({ title: label, description: "Funcionalidade de demonstração." });
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Integrações</h2>
                <p className="text-sm text-muted-foreground">Conecte sua loja e ferramentas para potencializar as recomendações de IA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map(int => {
                    const currentStatus = states[int.id] || int.status;
                    const sc = statusConfig[currentStatus] || statusConfig.not_connected;
                    return (
                        <div key={int.id} className={`bg-card border rounded-xl p-5 ${int.color}`}>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shrink-0">
                                    <int.icon className={`w-5 h-5 ${int.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <h3 className="font-semibold text-foreground">{int.name}</h3>
                                        <span className={`flex items-center gap-1 text-xs font-medium ${sc.className}`}>
                                            <sc.icon className="w-3 h-3" />{sc.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{int.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {int.actions.map(a => (
                                    <Button key={a.label} size="sm" variant={a.variant} className="text-xs h-7" onClick={() => handleAction(int.id, a.label)}>
                                        {a.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nuvemshop entry concept */}
            <div className="mt-8 bg-gradient-to-r from-[#1f4a32] to-[#2d6a4a] rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                    <ShoppingBag className="w-8 h-8 text-green-300 shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Entrada pela Nuvemshop</h3>
                        <p className="text-green-200 text-sm mb-4">No futuro, lojistas poderão acessar o Lumi Quotes diretamente pelo painel da Nuvemshop com um único clique.</p>
                        <div className="flex flex-wrap gap-2 text-xs text-green-200">
                            {['Nuvemshop', '→', 'Link/App integrado', '→', 'Login automático', '→', 'Workspace da loja', '→', 'Gerar orçamento com IA'].map((s, i) => (
                                <span key={i} className={s === '→' ? 'text-green-400' : 'bg-white/10 px-2 py-1 rounded-full'}>{s}</span>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 text-white border-white/30 hover:bg-white/10">
                            Simular entrada pela Nuvemshop
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}