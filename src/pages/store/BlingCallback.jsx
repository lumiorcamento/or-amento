import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { productService } from '@/services/productService';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BlingCallback() {
  const [searchParams] = useSearchParams();
  const { currentStore } = useStoreOwner();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setStatus('error');
        setError('Parâmetros de autenticação ausentes.');
        return;
      }

      if (!currentStore) {
        // Wait for store to load
        return;
      }

      try {
        await productService.connectBlingCallback(currentStore.id, code, state);
        setStatus('success');
        toast.success('Bling conectado com sucesso!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/lojista/conectar');
        }, 2000);
      } catch (err) {
        console.error('Bling callback error:', err);
        setStatus('error');
        setError(err.message || 'Erro ao processar conexão com Bling.');
        toast.error('Erro ao conectar Bling.');
      }
    }

    handleCallback();
  }, [searchParams, currentStore, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Conectando sua conta Bling...</h1>
            <p className="text-sm text-gray-500">Estamos finalizando a autenticação segura com o Bling. Isso levará apenas alguns segundos.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Conectado com Sucesso!</h1>
            <p className="text-sm text-gray-500">Sua conta Bling foi vinculada à Lumi. Você será redirecionado para o painel de integrações.</p>
            <div className="pt-4">
              <Loader2 className="w-4 h-4 text-green-700 animate-spin mx-auto" />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Erro na Conexão</h1>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => navigate('/lojista/conectar')}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Voltar para Integrações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
