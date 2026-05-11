import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Service for product management
 */
export const productService = {
  /**
   * Calculates a readiness score for AI recommendations
   */
  calculateProductReadiness(product) {
    if (!product) return { status: 'poor', score: 0, label: 'Erro' };
    
    if (!product.active) {
      return { status: 'inactive', score: 0, label: 'Inativo', color: 'bg-gray-100 text-gray-500' };
    }
    
    if (product.stock_quantity <= 0) {
      return { status: 'out_of_stock', score: 20, label: 'Sem estoque', color: 'bg-red-100 text-red-700' };
    }

    const checks = {
      name: !!product.name,
      price: product.price > 0,
      description: !!product.description && product.description.length > 20,
      image: !!product.image_url,
      category: !!product.category,
      tags: !!product.tags && product.tags.length > 0,
      context: !!product.target_audience || !!product.use_case
    };

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    if (score >= 90) return { status: 'ready', score, label: 'Pronto para IA', color: 'bg-green-100 text-green-700' };
    if (score >= 50) return { status: 'needs_improvement', score, label: 'Precisa melhorar', color: 'bg-amber-100 text-amber-700' };
    return { status: 'poor', score, label: 'Poucos dados', color: 'bg-orange-100 text-orange-700' };
  },

  /**
   * Gets all products for a specific store (including inactive)
   */
  async getProductsByStore(storeId) {
    if (!isSupabaseConfigured()) {
      // Demo fallback - using local storage or static data
      const { DEMO_PRODUCTS } = await import('@/lib/demoData');
      return DEMO_PRODUCTS.map(p => ({ ...p, active: p.active ?? true, stock_quantity: p.stock ?? 10 }));
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Gets only active products for the buyer assistant
   */
  async getActiveProductsByStore(storeId) {
    if (!isSupabaseConfigured()) {
      const { DEMO_PRODUCTS } = await import('@/lib/demoData');
      return DEMO_PRODUCTS;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('active', true)
      .gt('stock_quantity', 0)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Creates a new product manually
   */
  async createProduct({ storeId, product }) {
    if (!isSupabaseConfigured()) return { ...product, id: Date.now().toString() };

    const payload = {
      ...product,
      store_id: storeId,
      source: product.source || 'manual',
      active: product.active !== undefined ? product.active : true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing product
   */
  async updateProduct({ storeId, productId, updates }) {
    if (!isSupabaseConfigured()) return updates;

    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', productId)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Archives a product (soft delete)
   */
  async archiveProduct({ storeId, productId }) {
    return this.updateProduct({ storeId, productId, updates: { active: false } });
  },

  /**
   * Restores an archived product
   */
  async restoreProduct({ storeId, productId }) {
    return this.updateProduct({ storeId, productId, updates: { active: true } });
  },

  /**
   * Bulk import products from CSV
   */
  async bulkImportProducts({ storeId, products }) {
    if (!isSupabaseConfigured()) return products;

    const payload = products.map(p => ({
      ...p,
      store_id: storeId,
      source: 'csv',
      active: p.active !== undefined ? p.active : true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    // Use upsert by store_id and sku if sku is provided, otherwise just insert
    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'store_id, sku', ignoreDuplicates: false })
      .select();

    if (error) throw error;
    return data;
  }
};
