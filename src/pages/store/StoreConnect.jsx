import React, { useState, useEffect } from "react";
import { 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle, 
  Unlink, 
  ArrowRight, 
  Copy, 
  Check, 
  Zap
} from "lucide-react";
import { productService } from "@/services/productService";
import { storeService } from "@/services/storeService";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-hot-toast";

export default function StoreConnect() {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [integration, setIntegration] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      const storeData = await storeService.getStoreByOwner(user.id);
      if (storeData) {
        setStore(storeData);
        const [status, logs] = await Promise.all([
          productService.getIntegrationStatus(storeData.id, 'bling'),
          productService.getSyncLogs(storeData.id, 'bling')
        ]);
        setIntegration(status);
        setSyncLogs(logs);
      }
    } catch (error) {
      console.error("Error loading integration data:", error);
      toast.error("Erro ao carregar dados de integração");
    } finally {
      setLoading(false);
    }
  }

  async function handleConnectBling() {
    try {
      const authUrl = await productService.initiateBlingConnection(store.id);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting Bling:", error);
      toast.error("Erro ao iniciar conexão com Bling");
    }
  }

  async function handleSyncProducts() {
    try {
      setSyncing(true);
      const result = await productService.syncBlingProducts(store.id);
      toast.success(`Sincronização concluída! ${result.summary?.created || 0} novos produtos.`);
      loadData();
    } catch (error) {
      console.error("Error syncing products:", error);
      toast.error("Erro ao sincronizar produtos");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm("Deseja realmente desconectar o Bling? Os produtos sincronizados continuarão no catálogo, mas não serão mais atualizados.")) return;
    
    try {
      await productService.disconnectBling(store.id);
      toast.success("Bling desconectado com sucesso");
      loadData();
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast.error("Erro ao desconectar");
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copiado!");
  }

  const publicLink = store ? `${window.location.origin}/s/${store.slug}/orcamento?source=nuvemshop` : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrações do Catálogo</h1>
        <p className="text-gray-500">Conecte seu ERP para alimentar o assistente de IA com produtos reais.</p>
      </div>

      {/* BLING SECTION - PRIMARY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bling ERP</h2>
              <p className="text-sm text-gray-500">Fonte oficial de produtos, preços e estoque.</p>
            </div>
          </div>
          {integration?.status === 'connected' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              CONECTADO
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
              NÃO CONECTADO
            </span>
          )}
        </div>

        <div className="p-6">
          {integration?.status === 'connected' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Última Sincronização</div>
                  <div className="text-sm font-bold text-gray-900">
                    {syncLogs[0] ? new Date(syncLogs[0].created_at).toLocaleString() : 'Nunca sincronizado'}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Produtos Sincronizados</div>
                  <div className="text-sm font-bold text-gray-900">
                    {syncLogs[0] ? `${syncLogs[0].products_created + syncLogs[0].products_updated} itens` : '0 itens'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSyncProducts}
                  disabled={syncing}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-2 bg-white text-red-600 border border-red-100 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                >
                  <Unlink className="w-4 h-4" />
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto space-y-4">
                <p className="text-gray-600">
                  O Bling é a fonte oficial do seu catálogo. Ao conectar, o LumiIA importará seus produtos para que a IA possa recomendá-los.
                </p>
                <button
                  onClick={handleConnectBling}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-200"
                >
                  Conectar Bling ERP
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NUVEMSHOP SECTION - SIMPLIFIED (MANUAL LINK) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nuvemshop</h2>
              <p className="text-sm text-gray-500">Sua vitrine de vendas para os orçamentos.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            ATIVO VIA LINK
          </span>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Link do Assistente Personalizado
            </h3>
            <p className="text-blue-800 text-sm mb-6 leading-relaxed">
              Cole este link no menu, banner ou botões da sua loja Nuvemshop. 
              Seus clientes serão levados ao assistente, que usará os produtos sincronizados do Bling para gerar orçamentos.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-blue-700 uppercase tracking-wider ml-1">Seu Link Público</label>
                <div className="flex items-center gap-2 bg-white p-1.5 pl-4 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex-1 text-sm font-mono text-gray-600 truncate">
                    {publicLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(publicLink)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Dica de instalação:</strong> Vá em <span className="font-bold">Minha conta / Menus</span> no painel Nuvemshop e adicione um novo link chamado "Orçamento com IA" apontando para a URL acima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYNC HISTORY */}
      {syncLogs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Histórico de Sincronização</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3">Data/Hora</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Sucesso</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Erro</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {log.products_created} novos • {log.products_updated} atualizados
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