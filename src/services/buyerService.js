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
  },

  /**
   * Merchant side: Gets a summary of the buyer's activity in a specific store
   */
  async getBuyerStoreSummary({ storeId, buyerUserId }) {
    if (!isSupabaseConfigured()) return null;

    // Get the store-specific profile
    const { data: profile, error: profileError } = await supabase
      .from('buyer_store_profiles')
      .select('*')
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId)
      .single();

    // Get quote count and latest date
    const { data: quotes, error: quotesError } = await supabase
      .from('quote_requests')
      .select('id, created_at, estimated_total, original_prompt')
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId)
      .order('created_at', { ascending: false });

    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    if (quotesError) throw quotesError;

    const totalQuotes = quotes?.length || 0;
    
    return {
      profile: profile || {},
      totalQuotes,
      averageOrderValue: profile?.average_order_value || 0,
      lastQuoteDate: quotes?.[0]?.created_at || null,
      lastQuotePrompt: quotes?.[0]?.original_prompt || null,
      isRecurringCustomer: totalQuotes > 1,
      preferredCategories: profile?.preferred_categories || [],
      preferredUseCases: profile?.preferred_use_cases || [],
      commonAudience: profile?.common_audience || null,
      notesForAI: profile?.notes_for_ai || ''
    };
  }
};
