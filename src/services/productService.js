import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_PRODUCTS } from "@/lib/demoData";

/**
 * Service for product management
 */
export const productService = {
  /**
   * Fetches all products for a store
   */
  async getProductsByStore(storeId) {
    if (!isSupabaseConfigured()) return DEMO_PRODUCTS;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return DEMO_PRODUCTS;
    }
  },

  /**
   * Fetches only active products for a store
   */
  async getActiveProductsByStore(storeId) {
    if (!isSupabaseConfigured()) {
      return DEMO_PRODUCTS.filter(p => p.active);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching active products:", error);
      return DEMO_PRODUCTS.filter(p => p.active);
    }
  },

  /**
   * Fetches a single product by ID
   */
  async getProductById(productId) {
    if (!isSupabaseConfigured()) {
      return DEMO_PRODUCTS.find(p => p.id === productId);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }
};
