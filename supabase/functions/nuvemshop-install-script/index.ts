import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { decryptSecret } from "../_shared/crypto.ts"

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
      .eq('provider', 'nuvemshop')
      .single()

    if (intError || !integration) throw new Error('Integração Nuvemshop não encontrada')

    const { data: store } = await supabaseClient
      .from('stores')
      .select('nuvemshop_store_id')
      .eq('id', storeId)
      .single()

    if (!store?.nuvemshop_store_id) throw new Error('ID da loja Nuvemshop não vinculado')

    const accessToken = await decryptSecret(integration.access_token_encrypted)
    const scriptUrl = `${Deno.env.get('PUBLIC_APP_URL')}/nuvemshop/lumiia-quote-button.js`

    // 3. Install Script on Nuvemshop
    const response = await fetch(`https://api.tiendanube.com/v1/${store.nuvemshop_store_id}/scripts`, {
      method: 'POST',
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LumiIA (contato@lumiia.com.br)'
      },
      body: JSON.stringify({
        src: scriptUrl,
        event: 'onload',
        where: 'storefront'
      })
    })

    const result = await response.json()
    if (!response.ok) {
      console.error('Nuvemshop script install error:', result)
      throw new Error(result.error_description || result.message || 'Erro ao instalar script na Nuvemshop')
    }

    // 4. Update settings
    await supabaseClient
      .from('storefront_quote_settings')
      .update({ enabled: true })
      .eq('store_id', storeId)

    return new Response(JSON.stringify({ success: true, scriptId: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in nuvemshop-install-script:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
