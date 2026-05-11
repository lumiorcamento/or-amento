import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Service for buyer profile management
 */
export const buyerService = {
  /**
   * Gets current buyer user data from Supabase Auth and DB
   */
  async getCurrentBuyer() {
    if (!isSupabaseConfigured()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('buyer_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Gets or creates a buyer profile (public profile)
   */
  async getOrCreateBuyerProfile({ userId, name, email, phone }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('buyer_users')
      .upsert({ user_id: userId, name, email, phone, last_login_at: new Date() }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Gets buyer preferences for a specific store
   */
  async getBuyerStoreProfile({ storeId, buyerUserId }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('buyer_store_profiles')
      .select('*')
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Updates buyer preferences for a specific store
   */
  async updateBuyerPreferences({ storeId, buyerUserId, preferences }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('buyer_store_profiles')
      .upsert({
        store_id: storeId,
        buyer_user_id: buyerUserId,
        ...preferences,
        updated_at: new Date()
      }, { onConflict: 'store_id, buyer_user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Clears buyer personalization for a specific store (keeps profile and quotes)
   */
  async clearBuyerPersonalization({ storeId, buyerUserId }) {
    if (!isSupabaseConfigured()) return null;

    const { error } = await supabase
      .from('buyer_store_profiles')
      .update({
        preferred_budget_range: null,
        preferred_categories: [],
        preferred_use_cases: [],
        common_audience: null,
        average_order_value: 0,
        notes_for_ai: '',
        updated_at: new Date()
      })
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId);

    if (error) throw error;
    return true;
  }
};
