import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Service for store owner authentication (Merchant Panel)
 */
export const storeOwnerAuthService = {
  /**
   * Signs in a store owner using email and password
   */
  async signInStoreOwner({ email, password }) {
    if (!isSupabaseConfigured()) {
      // Demo fallback
      if (email === 'demo@lumi.com' && password === 'demo123') {
        return { user: { email, id: 'demo-owner-id' }, session: {} };
      }
      throw new Error('Modo demonstração: use demo@lumi.com / demo123');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Check if user is actually a store owner
    const { data: ownerRecord, error: ownerError } = await supabase
      .from('store_owners')
      .select('*, stores(*)')
      .eq('user_id', data.user.id);

    if (ownerError || !ownerRecord || ownerRecord.length === 0) {
      // If not an owner, we should sign them out
      await supabase.auth.signOut();
      throw new Error('Você não tem permissão para acessar o painel da loja.');
    }

    return { ...data, ownerRecord };
  },

  /**
   * Signs out the current store owner
   */
  async signOutStoreOwner() {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  /**
   * Gets the current authenticated store owner and their stores
   */
  async getCurrentStoreOwner() {
    if (!isSupabaseConfigured()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: ownerRecords, error } = await supabase
      .from('store_owners')
      .select('*, stores(*)')
      .eq('user_id', user.id);

    if (error || !ownerRecords || ownerRecords.length === 0) return null;

    return {
      user,
      ownerRecords,
      primaryStore: ownerRecords[0].stores
    };
  },

  /**
   * Listens for auth state changes
   */
  onStoreOwnerAuthStateChange(callback) {
    if (!isSupabaseConfigured()) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return () => subscription.unsubscribe();
  }
};
