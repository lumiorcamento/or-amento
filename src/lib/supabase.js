import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// No production, we MUST have these variables. 
// If they are missing, we throw an error that will be caught by the Error Boundary or UI.
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "ERRO CRÍTICO: Variáveis de ambiente do Supabase (VITE_SUPABASE_URL/ANON_KEY) não configuradas.";
  console.error(errorMsg);
  
  if (!import.meta.env.DEV) {
    // In production, we want this to be very visible in the logs
    // We don't throw a global error here to avoid crashing the whole import tree,
    // but we ensure isSupabaseConfigured() returns a clear false.
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl.includes('supabase.co');
};
