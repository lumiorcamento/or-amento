import React, { useState } from 'react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function StoreLogin() {
    const { signIn } = useStoreOwner();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn({ email, password });
            navigate('/lojista/solicitacoes');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Erro ao entrar no painel.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setEmail('demo@lumi.com');
        setPassword('demo123');
        // Small delay for visual feedback
        setTimeout(() => {
            const form = document.querySelector('form');
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-700/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Acessar painel da loja</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Entre para visualizar solicitações de orçamento e responder seus clientes.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="text-sm text-red-800 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1.5 ml-1">E-mail</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seu@email.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-600 transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1.5 ml-1">Senha</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-600 transition-colors text-sm"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-700/20 flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no painel'}
                        </button>
                    </form>

                    {(!isSupabaseConfigured() || import.meta.env.DEV) && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold">Acesso rápido</p>
                            <button 
                                onClick={handleDemoLogin}
                                className="w-full border border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 font-semibold py-3 rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
                            >
                                Entrar como lojista demo
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    &copy; {new Date().getFullYear()} Lumi Orçamentos — IA para Lojistas
                </p>
            </div>
        </div>
    );
}
