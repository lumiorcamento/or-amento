import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { decryptSecret, encryptSecret } from "../_shared/crypto.ts"
import { mapBlingProductToSupabaseProduct } from "../_shared/blingProductMapper.ts"

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

    // 2. Get Integration and Token
    const { data: integration, error: intError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('store_id', storeId)
      .eq('provider', 'bling')
      .single()

    if (intError || !integration) throw new Error('Integração Bling não encontrada')

    let accessToken = await decryptSecret(integration.access_token_encrypted)
    
    // Check if expired
    if (new Date(integration.expires_at) < new Date(Date.now() + 60000)) {
      console.log('Bling token expired, refreshing...')
      accessToken = await refreshBlingToken(supabaseClient, integration)
    }

    // 3. Create Sync Log
    const { data: syncLog } = await supabaseClient
      .from('integration_sync_logs')
      .insert({
        store_id: storeId,
        integration_id: integration.id,
        provider: 'bling',
        status: 'running'
      })
      .select()
      .single()

    // 4. Fetch Products from Bling
    let productsFound = 0
    let productsCreated = 0
    let productsUpdated = 0
    let productsErrored = 0
    
    try {
      // Fetch products (limiting to 100 for now, should loop for full sync)
      const blingResponse = await fetch('https://api.bling.com.br/Api/v3/produtos?pagina=1&limite=100', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      
      const blingData = await blingResponse.json()
      if (!blingResponse.ok) throw new Error(blingData.error?.message || 'Erro ao buscar produtos no Bling')

      const items = blingData.data || []
      productsFound = items.length

      for (const item of items) {
        try {
          const mapped = mapBlingProductToSupabaseProduct(item, storeId)
          
          // Check if product already exists to preserve AI fields
          const { data: existing } = await supabaseClient
            .from('products')
            .select('tags, target_audience, age_range, use_case, description')
            .eq('store_id', storeId)
            .eq('source', 'bling')
            .eq('external_id', mapped.external_id)
            .single()

          if (existing) {
            // Preserve AI fields if they have value
            if (existing.tags?.length) mapped.tags = existing.tags
            if (existing.target_audience) mapped.target_audience = existing.target_audience
            if (existing.age_range) mapped.age_range = existing.age_range
            if (existing.use_case) mapped.use_case = existing.use_case
            // Only use Bling description if current is empty
            if (existing.description && !mapped.description) mapped.description = existing.description
            
            productsUpdated++
          } else {
            productsCreated++
          }

          await supabaseClient.from('products').upsert(mapped, {
            onConflict: 'store_id, source, external_id'
          })
        } catch (e) {
          console.error(`Error syncing product ${item.id}:`, e)
          productsErrored++
        }
      }

      // Update Log Success
      await supabaseClient
        .from('integration_sync_logs')
        .update({
          status: productsErrored === 0 ? 'success' : 'partial_success',
          finished_at: new Date().toISOString(),
          products_found: productsFound,
          products_created: productsCreated,
          products_updated: productsUpdated,
          products_skipped: productsErrored
        })
        .eq('id', syncLog.id)

      return new Response(JSON.stringify({ 
        success: true, 
        summary: { found: productsFound, created: productsCreated, updated: productsUpdated, errored: productsErrored } 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (error) {
      // Update Log Error
      await supabaseClient
        .from('integration_sync_logs')
        .update({
          status: 'error',
          finished_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', syncLog.id)
      
      throw error
    }

  } catch (error) {
    console.error('Error in bling-sync-products:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function refreshBlingToken(supabaseClient: any, integration: any) {
  const clientId = Deno.env.get('BLING_CLIENT_ID')
  const clientSecret = Deno.env.get('BLING_CLIENT_SECRET')
  const refreshToken = await decryptSecret(integration.refresh_token_encrypted)

  const authHeader = btoa(`${clientId}:${clientSecret}`)
  const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  const tokenData = await response.json()
  if (!response.ok) throw new Error('Erro ao renovar token do Bling')

  const accessTokenEnc = await encryptSecret(tokenData.access_token)
  const refreshTokenEnc = await encryptSecret(tokenData.refresh_token)
  const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()

  await supabaseClient
    .from('integrations')
    .update({
      access_token_encrypted: accessTokenEnc,
      refresh_token_encrypted: refreshTokenEnc,
      expires_at: expiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', integration.id)

  return tokenData.access_token
}
