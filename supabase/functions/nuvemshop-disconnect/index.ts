import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    const { storeId } = await req.json()
    if (!storeId) throw new Error('storeId é obrigatório')

    // 1. Verify store ownership
    const { data: owner } = await supabaseClient
      .from('store_owners')
      .select('id')
      .eq('store_id', storeId)
      .eq('user_id', user.id)
      .single()

    if (!owner) throw new Error('Você não tem permissão para gerenciar esta loja')

    // 2. Disconnect
    // We remove tokens and disable button
    await supabaseClient
      .from('integrations')
      .delete()
      .eq('store_id', storeId)
      .eq('provider', 'nuvemshop')

    await supabaseClient
      .from('storefront_quote_settings')
      .update({ enabled: false })
      .eq('store_id', storeId)

    // Optional: Clear nuvemshop_store_id if you want to allow full reconnection
    // await supabaseClient.from('stores').update({ nuvemshop_store_id: null }).eq('id', storeId)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in nuvemshop-disconnect:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
