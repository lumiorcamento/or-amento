import { supabase } from "@/lib/supabase";
import { buyerService } from "./buyerService";

/**
 * Service for authentication management
 */
export const authService = {
  /**
   * Signs up a new buyer and creates their profile
   */
  async signUpBuyer(data) {
    const { name, email, phone, password } = data;
    console.log("[authService] signUpBuyer attempt:", { email, hasPassword: !!password });
    
    const trimmedEmail = email?.trim();
    const trimmedPassword = password;

    if (!trimmedEmail) throw new Error("DEBUG: E-mail não fornecido para o authService.");
    if (!trimmedPassword) throw new Error("DEBUG: Senha não fornecida para o authService.");

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: {
        data: {
          full_name: name?.trim(),
          phone: phone?.trim() || undefined,
        }
      }
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error("Falha ao criar usuário.");

    // 2. Create buyer_user record (Optional/Resilient)
    // We wrap this in try-catch because the database trigger might handle it
    // or the RLS might have a slight delay in recognizing the new session.
    try {
      const buyerUser = await buyerService.getOrCreateBuyerProfile({
        userId: user.id,
        name,
        email,
        phone
      });

      // 3. Create buyer_store_profile
      await buyerService.updateBuyerPreferences({
        storeId,
        buyerUserId: buyerUser.id,
        preferences: {
          consent_to_personalization: consentToPersonalization
        }
      });
    } catch (profileError) {
      console.warn("[authService] Non-critical error creating profile during signup:", profileError);
      // We don't throw here. The BuyerContext will handle profile creation/sync on next load.
    }

    return { user };
  },

  /**
   * Signs in a buyer
   */
  async signInBuyer({ email, password }) {
    console.log("[authService] signInBuyer attempt:", { email });
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) throw new Error("DEBUG: E-mail não fornecido para Login.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password
    });

    if (error) throw error;
    return data;
  },

  /**
   * Signs out
   */
  async signOutBuyer() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Gets current session
   */
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  /**
   * Gets current authenticated user
   */
  async getCurrentAuthUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  /**
   * Listens to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
