import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Service for managing quote requests
 */
export const quoteService = {
  /**
   * Creates a new quote request with items (uses RPC for security and atomicity)
   */
  async createQuoteRequest(payload) {
    if (!isSupabaseConfigured()) {
      // Demo Fallback
      console.log("Demo Mode: Creating mock quote request", payload);
      return {
        quote_request_id: 'ORC-DEMO-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        estimated_total: payload.items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
        item_count: payload.items.length
      };
    }

    const { data, error } = await supabase.rpc('create_quote_request_with_items', {
      p_store_id: payload.storeId,
      p_original_prompt: payload.originalPrompt,
      p_interpreted_need: payload.interpretedNeed || {},
      p_items: payload.items, 
      p_customer_contact_name: payload.contact.name,
      p_customer_contact_email: payload.contact.email,
      p_customer_contact_phone: payload.contact.phone,
      p_consent_to_contact: payload.contact.consent || false
    });

    if (error) {
      console.error("Error creating quote via RPC:", error);
      throw error;
    }

    return data;
  },

  /**
   * Gets quotes for a specific buyer in a specific store
   */
  async getBuyerQuotes({ storeId, buyerUserId }) {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        quote_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Gets a specific quote by ID
   */
  async getQuoteById({ quoteId, storeId, buyerUserId }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        quote_items (
          *,
          products (*)
        )
      `)
      .eq('id', quoteId)
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUserId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Merchant side: Gets all quote requests for a store
   */
  async getStoreQuoteRequests(storeId) {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        buyer_users (id, name, email, phone)
      `)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Merchant side: Gets a specific quote request for a store with all details
   */
  async getStoreQuoteRequestById({ storeId, quoteId }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        buyer_users (*),
        quote_items (
          *,
          products (*)
        )
      `)
      .eq('id', quoteId)
      .eq('store_id', storeId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Merchant side: Updates quote status
   */
  async updateQuoteStatus({ storeId, quoteId, status }) {
    if (!isSupabaseConfigured()) return true;

    const { data, error } = await supabase
      .from('quote_requests')
      .update({ status, updated_at: new Date() })
      .eq('id', quoteId)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
