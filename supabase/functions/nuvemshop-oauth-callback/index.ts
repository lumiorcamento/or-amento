import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { encryptSecret } from "../_shared/crypto.ts"

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

    const { storeId, code, state } = await req.json()
    if (!storeId || !code || !state) throw new Error('Parâmetros obrigatórios ausentes')

    // 1. Verify store ownership
    const { data: owner } = await supabaseClient
      .from('store_owners')
      .select('id')
      .eq('store_id', storeId)
      .eq('user_id', user.id)
      .single()

    if (!owner) throw new Error('Você não tem permissão para gerenciar esta loja')

    // 2. Validate state
    const { data: oauthState, error: stateError } = await supabaseClient
      .from('integration_oauth_states')
      .select('*')
      .eq('store_id', storeId)
      .eq('state', state)
      .eq('provider', 'nuvemshop')
      .is('used_at', null)
      .single()

    if (stateError || !oauthState) throw new Error('State inválido ou expirado')
    
    await supabaseClient
      .from('integration_oauth_states')
      .update({ used_at: new Date().toISOString() })
      .eq('id', oauthState.id)

    // 3. Exchange code for token
    const clientId = Deno.env.get('NUVEMSHOP_CLIENT_ID')
    const clientSecret = Deno.env.get('NUVEMSHOP_CLIENT_SECRET')

    if (!clientId || !clientSecret) throw new Error('Nuvemshop API não configurada no servidor')

    const response = await fetch('https://www.tiendanube.com/apps/authorize/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code
      })
    })

    const tokenData = await response.json()
    if (!response.ok) {
      console.error('Nuvemshop OAuth error:', tokenData)
      throw new Error(tokenData.error_description || 'Erro ao trocar código por token na Nuvemshop')
    }

    // 4. Save store mapping and integration
    const nuvemshopStoreId = String(tokenData.user_id)
    
    // Update store with nuvemshop_store_id
    const { error: storeUpdateError } = await supabaseClient
      .from('stores')
      .update({ nuvemshop_store_id: nuvemshopStoreId })
      .eq('id', storeId)

    if (storeUpdateError) throw storeUpdateError

    // Encrypt token
    const accessTokenEnc = await encryptSecret(tokenData.access_token)

    const { error: upsertError } = await supabaseClient
      .from('integrations')
      .upsert({
        store_id: storeId,
        provider: 'nuvemshop',
        status: 'connected',
        access_token_encrypted: accessTokenEnc,
        metadata: {
          user_id: tokenData.user_id,
          scope: tokenData.scope,
          token_type: tokenData.token_type,
          connected_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'store_id, provider'
      })

    if (upsertError) throw upsertError

    // 5. Create default settings
    await supabaseClient
      .from('storefront_quote_settings')
      .upsert({
        store_id: storeId,
        enabled: false,
        button_text: 'Criar orçamento personalizado com IA',
        button_position: 'floating'
      }, {
        onConflict: 'store_id'
      })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in nuvemshop-oauth-callback:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
