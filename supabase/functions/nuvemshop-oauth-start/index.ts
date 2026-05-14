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

    // 2. Create state
    const state = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

    const { error: stateError } = await supabaseClient
      .from('integration_oauth_states')
      .insert({
        store_id: storeId,
        provider: 'nuvemshop',
        state,
        created_by: user.id,
        expires_at: expiresAt
      })

    if (stateError) throw stateError

    // 3. Build Auth URL
    const clientId = Deno.env.get('NUVEMSHOP_CLIENT_ID')
    const redirectUri = Deno.env.get('NUVEMSHOP_REDIRECT_URI')
    
    // Authorization URL for Nuvemshop
    const url = `https://www.tiendanube.com/apps/${clientId}/authorize?state=${state}`

    return new Response(JSON.stringify({ url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in nuvemshop-oauth-start:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
