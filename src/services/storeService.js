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
      console.log(`[storeService] Buscando loja: ${slug}...`);
      
      // Criar uma promessa de timeout de 8 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout de conexão com Supabase (8s)")), 8000)
      );

      const fetchPromise = supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single();

      // Correr contra o timeout
      const { data, error } = await Promise.race([
        fetchPromise.then(res => res),
        timeoutPromise
      ]).catch(err => ({ data: null, error: err }));

      if (error) {
        console.error(`[storeService] Erro Supabase para slug ${slug}:`, error);
        if (error.code === 'PGRST116') {
          return isDemoSlug ? this.getDemoStoreFallback() : null;
        }
        throw error;
      }
      
      return data || (isDemoSlug ? this.getDemoStoreFallback() : null);
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
