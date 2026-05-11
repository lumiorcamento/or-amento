import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Service for Nuvemshop integration
 */
export const nuvemshopService = {
  /**
   * Initiates Nuvemshop OAuth flow
   */
  async startOAuth(storeId) {
    if (!isSupabaseConfigured()) return { url: '#' };

    const { data, error } = await supabase.functions.invoke('nuvemshop-oauth-start', {
      body: { storeId }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Finalizes connection
   */
  async connectCallback(storeId, code, state) {
    if (!isSupabaseConfigured()) return { success: true };

    const { data, error } = await supabase.functions.invoke('nuvemshop-oauth-callback', {
      body: { storeId, code, state }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Installs storefront script
   */
  async installScript(storeId) {
    if (!isSupabaseConfigured()) return { success: true };

    const { data, error } = await supabase.functions.invoke('nuvemshop-install-script', {
      body: { storeId }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Disconnects Nuvemshop
   */
  async disconnect(storeId) {
    if (!isSupabaseConfigured()) return { success: true };

    const { data, error } = await supabase.functions.invoke('nuvemshop-disconnect', {
      body: { storeId }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Gets button settings
   */
  async getSettings(storeId) {
    if (!isSupabaseConfigured()) {
      return { enabled: false, button_text: 'Criar orçamento com IA', button_position: 'floating' };
    }

    const { data, error } = await supabase
      .from('storefront_quote_settings')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Updates button settings
   */
  async updateSettings(storeId, settings) {
    if (!isSupabaseConfigured()) return settings;

    const { data, error } = await supabase
      .from('storefront_quote_settings')
      .upsert({ ...settings, store_id: storeId, updated_at: new Date() }, { onConflict: 'store_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
