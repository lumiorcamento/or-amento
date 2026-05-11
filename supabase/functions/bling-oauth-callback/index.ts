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

    // 2. Validate state (CSRF Protection)
    const { data: oauthState, error: stateError } = await supabaseClient
      .from('integration_oauth_states')
      .select('*')
      .eq('store_id', storeId)
      .eq('state', state)
      .eq('provider', 'bling')
      .is('used_at', null)
      .single()

    if (stateError || !oauthState) throw new Error('State inválido ou expirado')
    if (new Date(oauthState.expires_at) < new Date()) throw new Error('State expirado')

    // Mark state as used
    await supabaseClient
      .from('integration_oauth_states')
      .update({ used_at: new Date().toISOString() })
      .eq('id', oauthState.id)

    // 3. Exchange code for tokens
    const clientId = Deno.env.get('BLING_CLIENT_ID')
    const clientSecret = Deno.env.get('BLING_CLIENT_SECRET')
    const redirectUri = Deno.env.get('BLING_REDIRECT_URI')

    if (!clientId || !clientSecret) throw new Error('Bling API não configurada no servidor')

    const authHeader = btoa(`${clientId}:${clientSecret}`)
    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri || ''
      })
    })

    const tokenData = await response.json()
    if (!response.ok) {
      console.error('Bling OAuth error:', tokenData)
      throw new Error(tokenData.error_description || 'Erro ao trocar código por token no Bling')
    }

    // 4. Encrypt and Save
    const accessTokenEnc = await encryptSecret(tokenData.access_token)
    const refreshTokenEnc = await encryptSecret(tokenData.refresh_token)
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()

    const { error: upsertError } = await supabaseClient
      .from('integrations')
      .upsert({
        store_id: storeId,
        provider: 'bling',
        status: 'connected',
        access_token_encrypted: accessTokenEnc,
        refresh_token_encrypted: refreshTokenEnc,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'store_id, provider'
      })

    if (upsertError) throw upsertError

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in bling-oauth-callback:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
