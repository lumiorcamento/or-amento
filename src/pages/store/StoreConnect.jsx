import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Trash2, 
  Clock, 
  Box, 
  ArrowRight,
  Loader2,
  Settings,
  Layout,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { useStoreOwner } from '@/lib/StoreOwnerContext';
import { productService } from '@/services/productService';
import { nuvemshopService } from '@/services/nuvemshopService';
import { toast } from 'sonner';

export default function StoreConnect() {
  const { currentStore } = useStoreOwner();
  const [blingStatus, setBlingStatus] = useState(null);
  const [nuvemshopStatus, setNuvemshopStatus] = useState(null);
  const [nuvemSettings, setNuvemSettings] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInstallingScript, setIsInstallingScript] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (currentStore) {
      loadIntegrationData();
    }
  }, [currentStore]);

  async function loadIntegrationData() {
    setIsLoading(true);
    try {
      const [bStatus, nStatus, nSettings, logs] = await Promise.all([
        productService.getIntegrationStatus(currentStore.id, 'bling'),
        productService.getIntegrationStatus(currentStore.id, 'nuvemshop'),
        nuvemshopService.getSettings(currentStore.id),
        productService.getSyncLogs(currentStore.id, 'bling')
      ]);
      setBlingStatus(bStatus);
      setNuvemshopStatus(nStatus);
      setNuvemSettings(nSettings);
      setSyncLogs(logs);
    } catch (err) {
      console.error('Error loading integration data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- BLING HANDLERS ---
  async function handleConnectBling() {
    try {
      const authUrl = await productService.initiateBlingConnection(currentStore.id);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating Bling connection:', err);
      toast.error('Não foi possível iniciar a conexão com o Bling.');
    }
  }

  async function handleSyncBlingNow() {
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

  // --- NUVEMSHOP HANDLERS ---
  async function handleConnectNuvemshop() {
    try {
      const { url } = await nuvemshopService.startOAuth(currentStore.id);
      window.location.href = url;
    } catch (err) {
      console.error('Error initiating Nuvemshop connection:', err);
      toast.error('Erro ao iniciar conexão com Nuvemshop.');
    }
  }

  async function handleInstallScript() {
    setIsInstallingScript(true);
    const toastId = toast.loading('Instalando botão na loja Nuvemshop...');
    try {
      await nuvemshopService.installScript(currentStore.id);
      toast.success('Botão instalado com sucesso!', { id: toastId });
      loadIntegrationData();
    } catch (err) {
      console.error('Error installing script:', err);
      toast.error('Erro ao instalar botão.', { id: toastId });
    } finally {
      setIsInstallingScript(false);
    }
  }

  async function handleSaveSettings() {
    setIsSavingSettings(true);
    try {
      await nuvemshopService.updateSettings(currentStore.id, nuvemSettings);
      toast.success('Configurações salvas!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Erro ao salvar configurações.');
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function handleDisconnect(provider) {
    if (!confirm(`Tem certeza que deseja desconectar o ${provider}?`)) return;
    try {
      if (provider === 'bling') {
        await productService.disconnectBling(currentStore.id);
        setBlingStatus(null);
      } else {
        await nuvemshopService.disconnect(currentStore.id);
        setNuvemshopStatus(null);
      }
      toast.success(`${provider} desconectado.`);
    } catch (err) {
      toast.error(`Erro ao desconectar ${provider}.`);
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrações</h1>
        <p className="text-gray-500">Conecte sua loja às plataformas externas para automatizar seu catálogo e vitrine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BLING CARD */}
        <div className={`bg-white rounded-2xl border ${blingStatus?.status === 'connected' ? 'border-green-100 shadow-sm' : 'border-gray-100'} p-6 flex flex-col`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Bling</h3>
                <p className="text-xs text-gray-400">ERP & Catálogo</p>
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

          <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-grow">
            Sincronize automaticamente seus produtos, preços e estoque do Bling para alimentar a inteligência do seu assistente de orçamento.
          </p>

          {blingStatus?.status === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Última sincronização:</span>
                  <span className="font-medium text-gray-700">
                    {syncLogs[0]?.finished_at ? new Date(syncLogs[0].finished_at).toLocaleString() : 'Nunca'}
                  </span>
                </div>
                {syncLogs[0] && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Total</p>
                      <p className="text-base font-bold text-gray-900">{syncLogs[0].products_found}</p>
                    </div>
                    <div className="flex-1 text-center border-l border-gray-200">
                      <p className="text-[10px] text-green-600 uppercase font-bold mb-1">Novos</p>
                      <p className="text-base font-bold text-gray-900">{syncLogs[0].products_created}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSyncBlingNow}
                  disabled={isSyncing}
                  className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Sincronizar Agora
                </button>
                <button 
                  onClick={() => handleDisconnect('bling')}
                  className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleConnectBling}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              Conectar Bling
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* NUVEMSHOP CARD */}
        <div className={`bg-white rounded-2xl border ${nuvemshopStatus?.status === 'connected' ? 'border-blue-100 shadow-sm' : 'border-gray-100'} p-6 flex flex-col`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Nuvemshop</h3>
                <p className="text-xs text-gray-400">Loja & Vitrine</p>
              </div>
            </div>
            {nuvemshopStatus?.status === 'connected' ? (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                CONECTADO
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">NÃO CONECTADO</span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-grow">
            Exiba o botão de orçamento com IA diretamente na sua loja Nuvemshop e capture mais clientes com recomendações personalizadas.
          </p>

          {nuvemshopStatus?.status === 'connected' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-blue-700 font-bold uppercase">
                    <Layout className="w-3.5 h-3.5" />
                    Status do Botão
                  </div>
                  {nuvemSettings?.enabled ? (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 uppercase">Inativo</span>
                  )}
                </div>
                <div className="text-xs text-blue-600/70 leading-snug">
                  O botão está configurado para aparecer na posição <strong>{nuvemSettings?.button_position}</strong>.
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleInstallScript}
                  disabled={isInstallingScript}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isInstallingScript ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                  {nuvemSettings?.enabled ? 'Atualizar Botão' : 'Instalar Botão'}
                </button>
                <button 
                  onClick={() => handleDisconnect('nuvemshop')}
                  className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleConnectNuvemshop}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              Conectar Nuvemshop
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* NUVEMSHOP CONFIGURATION UI (Only if connected) */}
      {nuvemshopStatus?.status === 'connected' && (
        <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Layout className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personalizar Vitrine</h2>
                <p className="text-sm text-gray-400">Configure como o botão de orçamento aparece para seus clientes.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm font-medium text-gray-500">{nuvemSettings?.enabled ? 'Ativo' : 'Inativo'}</span>
                  <button 
                    onClick={() => setNuvemSettings({...nuvemSettings, enabled: !nuvemSettings.enabled})}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${nuvemSettings?.enabled ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${nuvemSettings?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>
               <button 
                 onClick={handleSaveSettings}
                 disabled={isSavingSettings}
                 className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
               >
                 {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-50">
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Box className="w-4 h-4" /> Texto do Botão
                </label>
                <input 
                  type="text" 
                  value={nuvemSettings?.button_text || ''} 
                  onChange={(e) => setNuvemSettings({...nuvemSettings, button_text: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Criar orçamento com IA"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Cor e Estilo
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={nuvemSettings?.button_color || '#14532d'} 
                    onChange={(e) => setNuvemSettings({...nuvemSettings, button_color: e.target.value})}
                    className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none p-0"
                  />
                  <input 
                    type="text" 
                    value={nuvemSettings?.button_color || '#14532d'} 
                    onChange={(e) => setNuvemSettings({...nuvemSettings, button_color: e.target.value})}
                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   Posição na Loja
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['floating', 'product_area', 'bottom_bar'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setNuvemSettings({...nuvemSettings, button_position: pos})}
                      className={`py-3 rounded-xl border-2 text-[10px] font-bold uppercase transition-all ${
                        nuvemSettings?.button_position === pos 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {pos === 'floating' ? 'Flutuante' : pos === 'product_area' ? 'Produtos' : 'Barra Inf.'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center relative">
              <div className="text-[10px] font-bold text-gray-300 uppercase absolute top-8 left-8">Pré-visualização</div>
              
              <div className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                 {/* Mock UI for preview */}
                 <div className="space-y-2 w-full">
                    <div className="h-2 w-2/3 bg-gray-100 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                    <div className="h-16 w-full bg-gray-50 rounded-xl mt-4"></div>
                 </div>

                 {/* The Actual Button Preview */}
                 <div 
                  className={`absolute transition-all duration-300 shadow-lg px-4 py-2.5 rounded-xl flex items-center gap-2 pointer-events-none scale-75`}
                  style={{
                    backgroundColor: nuvemSettings?.button_color || '#14532d',
                    color: '#ffffff',
                    bottom: nuvemSettings?.button_position === 'bottom_bar' ? '0' : '16px',
                    right: nuvemSettings?.button_position === 'bottom_bar' ? '0' : '16px',
                    left: nuvemSettings?.button_position === 'bottom_bar' ? '0' : 'auto',
                    borderRadius: nuvemSettings?.button_position === 'bottom_bar' ? '0' : '12px',
                    width: nuvemSettings?.button_position === 'bottom_bar' ? '100%' : 'auto',
                    justifyContent: 'center'
                  }}
                 >
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <span className="text-[11px] font-bold">{nuvemSettings?.button_text || 'Criar orçamento'}</span>
                 </div>
              </div>

              <div className="mt-8 text-center max-w-xs">
                <p className="text-xs text-gray-400">
                  O botão abrirá seu assistente de orçamento em: <br />
                  <span className="text-blue-500">app.lumiia.com/s/{currentStore?.slug}/orcamento</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYNC LOGS TABLE (Keep existing Bling logs) */}
      {blingStatus?.status === 'connected' && syncLogs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Histórico de Sincronização (Bling)
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-gray-700">Data/Hora</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Resultados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                      {new Date(log.finished_at || log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="text-green-600 font-bold text-xs uppercase tracking-tight">Sucesso</span>
                      ) : log.status === 'partial_success' ? (
                        <span className="text-amber-600 font-bold text-xs uppercase tracking-tight">Sucesso Parcial</span>
                      ) : log.status === 'running' ? (
                        <span className="text-blue-600 font-bold text-xs uppercase animate-pulse tracking-tight">Processando...</span>
                      ) : (
                        <span className="text-red-600 font-bold text-xs uppercase tracking-tight">Erro</span>
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