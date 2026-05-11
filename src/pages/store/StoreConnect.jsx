import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Trash2, 
  Clock, 
  Box, 
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { productService } from '@/services/productService';
import { toast } from 'sonner';

export default function StoreConnect() {
  const { currentStore } = useStoreOwner();
  const [blingStatus, setBlingStatus] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (currentStore) {
      loadIntegrationData();
    }
  }, [currentStore]);

  async function loadIntegrationData() {
    setIsLoading(true);
    try {
      const [status, logs] = await Promise.all([
        productService.getIntegrationStatus(currentStore.id, 'bling'),
        productService.getSyncLogs(currentStore.id, 'bling')
      ]);
      setBlingStatus(status);
      setSyncLogs(logs);
    } catch (err) {
      console.error('Error loading integration data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConnectBling() {
    try {
      const authUrl = await productService.initiateBlingConnection(currentStore.id);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating Bling connection:', err);
      toast.error('Não foi possível iniciar a conexão com o Bling.');
    }
  }

  async function handleSyncNow() {
    if (isSyncing) return;
    
    setIsSyncing(true);
    const toastId = toast.loading('Sincronizando produtos com o Bling...');
    
    try {
      const result = await productService.syncBlingProducts(currentStore.id);
      toast.success(`Sincronização concluída! ${result.summary.created} novos, ${result.summary.updated} atualizados.`, { id: toastId });
      loadIntegrationData();
    } catch (err) {
      console.error('Error syncing products:', err);
      toast.error('Erro ao sincronizar produtos.', { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Tem certeza que deseja desconectar o Bling? Isso removerá os tokens de acesso, mas manterá os produtos já importados.')) return;

    try {
      await productService.disconnectBling(currentStore.id);
      setBlingStatus(null);
      toast.success('Bling desconectado com sucesso.');
    } catch (err) {
      console.error('Error disconnecting Bling:', err);
      toast.error('Erro ao desconectar Bling.');
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrações</h1>
        <p className="text-gray-500">Conecte sua loja às plataformas externas para automatizar seu catálogo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BLING CARD */}
        <div className={`bg-white rounded-2xl border ${blingStatus?.status === 'connected' ? 'border-green-100 shadow-sm' : 'border-gray-100'} p-6 transition-all`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Bling</h3>
                <p className="text-xs text-gray-400">ERP & Gestão</p>
              </div>
            </div>
            {blingStatus?.status === 'connected' ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                CONECTADO
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">NÃO CONECTADO</span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Importe automaticamente seus produtos, preços e estoque do Bling para alimentar o assistente de orçamento.
          </p>

          {blingStatus?.status === 'connected' ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Última sincronização:</span>
                  <span className="font-medium text-gray-700">
                    {syncLogs[0]?.finished_at ? new Date(syncLogs[0].finished_at).toLocaleString() : 'Nunca'}
                  </span>
                </div>
                {syncLogs[0] && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Encontrados</p>
                      <p className="text-sm font-bold text-gray-900">{syncLogs[0].products_found}</p>
                    </div>
                    <div className="flex-1 text-center border-l border-gray-200">
                      <p className="text-[10px] text-gray-400 uppercase font-bold text-green-600">Novos</p>
                      <p className="text-sm font-bold text-gray-900">{syncLogs[0].products_created}</p>
                    </div>
                    <div className="flex-1 text-center border-l border-gray-200">
                      <p className="text-[10px] text-gray-400 uppercase font-bold text-blue-600">Atualizados</p>
                      <p className="text-sm font-bold text-gray-900">{syncLogs[0].products_updated}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Sincronizar Agora
                </button>
                <button 
                  onClick={handleDisconnect}
                  className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
                  title="Desconectar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleConnectBling}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Conectar Bling
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Conexão segura via OAuth 2.0 • Tokens criptografados</span>
          </div>
        </div>

        {/* NUVEMSHOP CARD */}
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 opacity-60">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                <span className="text-blue-600 font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-400">Nuvemshop</h3>
                <p className="text-xs text-gray-300">E-commerce</p>
              </div>
            </div>
            <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full italic">EM BREVE</span>
          </div>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Instale a Lumi diretamente na sua loja Nuvemshop e sincronize seus produtos em tempo real.
          </p>

          <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed">
            Indisponível
          </button>
        </div>
      </div>

      {/* SYNC LOGS TABLE (Only if connected) */}
      {blingStatus?.status === 'connected' && syncLogs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Histórico de Sincronização
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-gray-700">Data/Hora</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Resultados</th>
                  <th className="px-6 py-4 font-bold text-gray-700 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(log.finished_at || log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="text-green-600 font-medium">Sucesso</span>
                      ) : log.status === 'partial_success' ? (
                        <span className="text-amber-600 font-medium">Sucesso Parcial</span>
                      ) : log.status === 'running' ? (
                        <span className="text-blue-600 font-medium animate-pulse">Sincronizando...</span>
                      ) : (
                        <span className="text-red-600 font-medium">Erro</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {log.products_created} novos • {log.products_updated} atualizados
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {log.error_message ? (
                        <button 
                          onClick={() => alert(log.error_message)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Ver erro
                        </button>
                      ) : (
                        <Box className="w-4 h-4 text-gray-200 ml-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}