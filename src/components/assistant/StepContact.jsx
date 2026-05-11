import React from 'react';
import { ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function StepContact({ contact, setContact, items, total, onBack, onSubmit, buyer, isSubmitting }) {
    const valid = contact.name.trim() && contact.contact.trim() && contact.consent;

    function set(key, val) {
        setContact(c => ({ ...c, [key]: val }));
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Para onde a loja deve responder?</h2>
            <p className="text-sm text-gray-500 mb-6">Confirme seus dados. A loja irá entrar em contato para confirmar disponibilidade e condições.</p>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">Resumo do orçamento</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{items.length} {items.length === 1 ? 'produto' : 'produtos'} selecionados</span>
                    <span className="font-bold text-green-700">R$ {total.toFixed(2)}</span>
                </div>
            </div>

            {/* Form — pre-filled from buyer */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-5">
                {buyer && (
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: buyer.avatarColor || '#1f4a32' }}>
                            {buyer.avatar || buyer.name[0]}
                        </div>
                        <p className="text-sm font-medium text-gray-700">Dados preenchidos da sua conta</p>
                    </div>
                )}
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Seu nome *</label>
                    <input 
                        disabled={isSubmitting}
                        value={contact.name} 
                        onChange={e => set('name', e.target.value)} 
                        placeholder="Como prefere ser chamado?"
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors disabled:opacity-50" 
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">WhatsApp ou e-mail *</label>
                    <input 
                        disabled={isSubmitting}
                        value={contact.contact} 
                        onChange={e => set('contact', e.target.value)} 
                        placeholder="(11) 99999-9999 ou email@exemplo.com"
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors disabled:opacity-50" 
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Empresa <span className="font-normal text-gray-400">(opcional)</span></label>
                    <input 
                        disabled={isSubmitting}
                        value={contact.company} 
                        onChange={e => set('company', e.target.value)} 
                        placeholder="Nome da empresa ou CNPJ"
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors disabled:opacity-50" 
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Observações <span className="font-normal text-gray-400">(opcional)</span></label>
                    <textarea 
                        disabled={isSubmitting}
                        value={contact.notes} 
                        onChange={e => set('notes', e.target.value)} 
                        placeholder="Prazo desejado, dúvidas, condições..."
                        rows={2} 
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 resize-none transition-colors disabled:opacity-50" 
                    />
                </div>

                {/* Contact consent */}
                <label className="flex items-start gap-2.5 cursor-pointer mt-1" onClick={() => !isSubmitting && set('consent', !contact.consent)}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${contact.consent ? 'bg-green-600 border-green-600' : 'border-gray-300'} ${isSubmitting ? 'opacity-50' : ''}`}>
                        {contact.consent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-xs text-gray-600 leading-relaxed ${isSubmitting ? 'opacity-50' : ''}`}>
                        Autorizo a loja a entrar em contato comigo sobre este orçamento. *
                    </span>
                </label>
            </div>

            <p className="text-xs text-gray-400 text-center mb-5 leading-relaxed">
                Seu orçamento será enviado para a loja confirmar disponibilidade, valores e condições de entrega.
            </p>

            <div className="flex gap-3">
                <button 
                    onClick={onBack} 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-4 py-3 border border-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button 
                    onClick={onSubmit} 
                    disabled={!valid || isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar solicitação de orçamento</>}
                </button>
            </div>
        </div>
    );
}