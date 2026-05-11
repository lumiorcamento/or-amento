import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

function Toggle({ checked, onChange, label, description }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            <button onClick={() => onChange(!checked)}
                className={`relative w-10 h-5 rounded-full shrink-0 transition-colors mt-0.5 ${checked ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
            </button>
        </div>
    );
}

export default function StoreConfig() {
    const { toast } = useToast();
    const [config, setConfig] = useState({
        tone: 'consultivo',
        min_value: 0,
        stock_priority: true,
        margin_priority: false,
        allow_no_login: true,
        final_message: 'Obrigado pelo seu orçamento! Entraremos em contato em breve para confirmar disponibilidade e condições.',
    });

    function set(key, val) { setConfig(c => ({ ...c, [key]: val })); }
    function save() { toast({ title: "Configurações salvas!", description: "O assistente foi atualizado." }); }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Configurar assistente</h2>
                <p className="text-sm text-gray-500">Personalize como a IA responde aos seus clientes.</p>
            </div>

            <div className="max-w-xl space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <h3 className="font-semibold text-sm text-gray-700">Tom das respostas</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {['direto', 'consultivo', 'elegante', 'técnico', 'descontraído'].map(t => (
                            <button key={t} onClick={() => set('tone', t)}
                                className={`text-xs py-2 px-3 rounded-xl border font-medium capitalize transition-all ${config.tone === t ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:border-green-400'}`}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <h3 className="font-semibold text-sm text-gray-700">Regras de recomendação</h3>
                    <Toggle checked={config.stock_priority} onChange={v => set('stock_priority', v)} label="Priorizar produtos em estoque" description="Não mostrar produtos sem estoque" />
                    <Toggle checked={config.margin_priority} onChange={v => set('margin_priority', v)} label="Priorizar maior margem" description="Preferir produtos com maior lucratividade" />
                    <Toggle checked={config.allow_no_login} onChange={v => set('allow_no_login', v)} label="Permitir orçamento sem cadastro" description="Clientes podem usar o assistente sem criar conta" />
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Valor mínimo do orçamento (R$)</label>
                        <input type="number" value={config.min_value} onChange={e => set('min_value', e.target.value)} placeholder="0 = sem mínimo"
                            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">Mensagem final para o cliente</h3>
                    <textarea value={config.final_message} onChange={e => set('final_message', e.target.value)} rows={3}
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 resize-none" />
                    <p className="text-xs text-gray-400 mt-1.5">Esta mensagem é exibida para o cliente após enviar o orçamento.</p>
                </div>

                <button onClick={save} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
                    Salvar configurações
                </button>
            </div>
        </div>
    );
}