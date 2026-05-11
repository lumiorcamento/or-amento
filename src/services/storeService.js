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
    if (!isSupabaseConfigured()) {
      return this.getDemoStoreFallback();
    }

    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching store by slug (${slug}):`, error);
      return this.getDemoStoreFallback();
    }
  },

  /**
   * Returns demo store data as fallback
   */
  getDemoStoreFallback() {
    return DEMO_STORE;
  }
};
