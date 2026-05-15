import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_STORE } from "@/lib/demoData";

/**
 * Service for store management
 */
export const storeService = {
  /**
   * Fetches a store by its slug
   */
  async getStoreBySlug(slug) {
    // Only allow demo fallback if specifically requested via slug or if in DEV without config
    const isDemoSlug = slug === 'loja-demonstracao';
    
    if (!isSupabaseConfigured()) {
      if (isDemoSlug || import.meta.env.DEV) {
        return this.getDemoStoreFallback();
      }
      throw new Error("Configuração do banco de dados ausente.");
    }

    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found is handled by UI
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`[storeService] Error fetching store (${slug}):`, error);
      // In production, we don't fallback to demo automatically if Supabase fails
      if (isDemoSlug) return this.getDemoStoreFallback();
      throw error;
    }
  },

  getDemoStoreFallback() {
    return DEMO_STORE;
  }
};
