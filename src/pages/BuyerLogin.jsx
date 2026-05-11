import React, { useState } from 'react';
import { Sparkles, ArrowRight, User, Mail, Phone, CheckCircle2, Store, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { DEMO_BUYERS } from '@/lib/buyerData';
import { useBuyer } from '@/lib/BuyerContext';
import { useStore } from '@/lib/StoreContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BuyerLogin() {
    const { signIn, signUp, signOut } = useBuyer();
    const { store, storeSlug } = useStore();
    
    const [mode, setMode] = useState('login'); // login | register
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [consent, setConsent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error('Preencha e-mail e senha.');
            return;
        }

        setIsLoading(true);
        try {
            await signIn(form.email, form.password);
            toast.success('Bem-vindo de volta!');
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Erro ao entrar. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error('Preencha os campos obrigatórios.');
            return;
        }
        if (!consent) {
            toast.error('É necessário autorizar o uso do histórico.');
            return;
        }

        setIsLoading(true);
        try {
            await signUp({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                storeId: store.id,
                consentToPersonalization: consent
            });
            toast.success('Conta criada com sucesso!');
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Erro ao criar conta.');
        } finally {
            setIsLoading(false);
        }
    }

    const primaryColor = store?.primary_color || store?.primaryColor || '#1f4a32';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Store header — context pill */}
            <header className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-sm mx-auto flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <Store className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 leading-none">Orçamento personalizado para</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate">{store?.name}</p>
                    </div>
                    {!isSupabaseConfigured() && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full shrink-0 hidden sm:block">Demo</span>
                    )}
                </div>
            </header>

            {/* Flow indicator */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
                <div className="max-w-sm mx-auto flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <span className="text-gray-500">{store?.name}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-green-700 font-semibold">Identificação</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Assistente da loja</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
                <div className="w-full max-w-sm">
                    {/* Icon + title */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ backgroundColor: primaryColor }}>
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            {mode === 'login' ? 'Entre para salvar seu' : 'Crie sua conta para salvar seu'}<br />orçamento personalizado
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Assim conseguimos manter seu histórico, recuperar suas propostas e sugerir produtos cada vez mais alinhados ao que você procura.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Tabs */}
                        <div className="flex bg-gray-200/50 p-1 rounded-xl">
                            <button 
                                onClick={() => setMode('login')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                Entrar
                            </button>
                            <button 
                                onClick={() => setMode('register')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                Criar conta
                            </button>
                        </div>

                        {mode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-3">
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                required
                                                type="email"
                                                value={form.email} 
                                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                                                placeholder="seu@email.com"
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Senha</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                required
                                                type="password"
                                                value={form.password} 
                                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                                                placeholder="••••••••"
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-50"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> Entrar e continuar</>}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-3">
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Seu nome *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                required
                                                value={form.name} 
                                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                                                placeholder="Como quer ser chamado?"
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">E-mail *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                required
                                                type="email"
                                                value={form.email} 
                                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                                                placeholder="seu@email.com"
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">WhatsApp <span className="font-normal text-gray-400">(opcional)</span></label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                value={form.phone} 
                                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                                                placeholder="(11) 99999-9999"
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Senha *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                                required
                                                type="password"
                                                value={form.password} 
                                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
                                                placeholder="Mínimo 6 caracteres"
                                                minLength={6}
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition-colors" 
                                            />
                                        </div>
                                    </div>

                                    {/* Consent */}
                                    <label className="flex items-start gap-2.5 cursor-pointer mt-1 p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:border-green-200 transition-colors">
                                        <div onClick={() => setConsent(c => !c)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${consent ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                                            {consent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-xs text-gray-700 leading-relaxed font-medium">
                                            Autorizo o uso do meu histórico nesta loja para personalizar minhas recomendações.
                                            <span className="text-gray-400 font-normal"> Você pode limpar suas preferências quando quiser.</span>
                                        </span>
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-50"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><User className="w-4 h-4" /> Continuar para meu orçamento</>}
                                </button>
                            </form>
                        )}

                        {/* Demo Mode Button */}
                        {!isSupabaseConfigured() && (
                            <div className="space-y-3 mt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Modo Demo</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-2">
                                    {DEMO_BUYERS.map(demoBuyer => (
                                        <button 
                                            key={demoBuyer.id} 
                                            onClick={() => {
                                                // In demo mode, we just set the buyer directly in context
                                                // BuyerContext handles this via signOut/signIn logic if configured
                                                toast.success(`Entrando como ${demoBuyer.name}`);
                                                window.location.reload(); // Simple way to reset state in demo mode
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-200 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                                style={{ backgroundColor: demoBuyer.avatarColor }}>
                                                {demoBuyer.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-[11px]">{demoBuyer.name}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{demoBuyer.history.length} orçamentos anteriores</p>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-600 transition-colors shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}